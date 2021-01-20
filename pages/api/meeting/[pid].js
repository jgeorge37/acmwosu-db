import pgQuery from '../../../postgres/pg-query.js';
import {currentAcademicYear} from '../../../utility/utility';
import {checkAuth} from '../auth/[pid]';
import {serialize} from 'cookie';

// GET /api/meeting/average-attendance
// Average attendance for each semester of the current academic year
async function averageAttendance () {
    const [fall, spring] = currentAcademicYear();
    const data = await pgQuery(
      `SELECT AVG(COUNT) FROM
      ( SELECT COUNT(student_id)
      FROM meeting_student
      RIGHT JOIN meeting
      ON meeting_student.meeting_id=meeting.id
      WHERE (meeting.semester='${fall}' OR meeting.semester='${spring}')
      GROUP BY meeting.id) as counts;`
    );
    return data.rows[0]["avg"] ? data.rows[0]["avg"] : 0;
}

// GET /api/meeting/student-attendance
// Get number of meetings per semester of the current academic year for a student id
async function studentAttendance(id) {
	const [fall, spring] = currentAcademicYear();
	const numMeetings = await pgQuery(`
		SELECT m.semester, COUNT(m.id) 
		FROM meeting m INNER JOIN meeting_student ms ON m.id = ms.meeting_id
		WHERE ms.student_id = '${id}' AND (m.semester='${fall}' OR m.semester='${spring}')
		GROUP BY m.semester;
	`);
	return numMeetings.rows;
}

// GET /api/meeting/account-attendance
// Get number of meetings per semester of the current academic year for an email address
async function accountAttendance(email) {
	const data = await pgQuery(`SELECT s.id FROM student s INNER JOIN account a on s.id = a.student_id WHERE a.email = '${email}'`);
	if(!data.rowCount) throw (`No student associated with account ${email}`);
	return (await studentAttendance(data.rows[0].id));
}

// GET /api/meeting/meeting-list
// Return names, dates, and ids of all meetings
async function meetingList() {
    const data = await pgQuery(`SELECT meeting_name, meeting_date, id FROM meeting ORDER BY meeting_date DESC`);
    return data.rows;
}

// GET /api/meeting/meeting-attendance
// Get the attendance for a particular meeting
async function meetingAttendance(meetingId) {
    const data = await pgQuery(`
        SELECT s.fname, s.lname, s.name_dot_num, ms.add_to_newsletter
        FROM student s INNER JOIN meeting_student ms ON s.id = ms.student_id
        WHERE ms.meeting_id = '${meetingId}'`)
    return data.rows;
}

// POST /api/meeting/create
// Create a meeting: meeting_name, meeting_date, semester (AUXX or SPXX), and company_id associated (null if no company)
async function create(meeting_name, meeting_date, semester, company_id) {
    const localTime = new Date(meeting_date);  // UTC equivalent of the input in local time, i.e. 6pm central = 7pm eastern = 12am UTC
    const easternTime = new Date(localTime.toLocaleString("en-US", {timeZone: "America/New_York"}));
    const timeDiff = easternTime.getTime() - localTime.getTime();  // ie 7pm - 6pm
    // ie convert 7pm local time to 7pm eastern time
    const finalTime = new Date(localTime.getTime() - timeDiff); 

    // set expiration to 11:59pm ET of day of meeting
    const expireTime = new Date(finalTime.getTime());
    expireTime.setHours(23 - timeDiff/(3600000));
    expireTime.setMinutes(59);

    let code = ("" + Math.random()).substring(2, 7);

    // re-generate code if already in table - highly unlikely to happen even once, so runtime in reality is not bad.
    while((await pgQuery(`SELECT * FROM meeting WHERE code = '${code}';`)).rows.length > 0) {
        code = ("" + Math.random()).substring(2, 7);
    }

    const data = await pgQuery(`INSERT INTO meeting (meeting_name, meeting_date, code, semester, code_expiration) 
    VALUES('${meeting_name}', '${finalTime.toUTCString()}', '${code}', '${semester}', '${expireTime.toUTCString()}');`)

    if (company_id) {

        // Get recently created meeting id
        const meetingIdData = await pgQuery(`
            SELECT id 
            FROM meeting
            WHERE code = '${code}'`);

        const meetingId = meetingIdData.rows[0]["id"];

        // add to meeting_company table
        if ((await pgQuery(`SELECT * FROM company WHERE id = '${company_id}';`)).rows.length > 0) {
            await pgQuery(`INSERT INTO meeting_company (meeting_id, company_id)
            VALUES('${meetingId}', '${company_id}');`);
        } else {
            // This shouldn't happen b/c company search should be used but just in case
            throw ("No company was found under that name!");
        }
    }

    data.code = code;
    data.expiration = expireTime.toLocaleString("en-US", {timeZone: "America/New_York"});
    return data; 
}

// POST /api/meeting/delete
// delete a meeting given meeting_id
async function delete_(id) {
    const data = await pgQuery(`SELECT meeting_name, semester FROM meeting WHERE id=${id};`);
    if(data.rowCount === 0) throw(`Meeting with id ${id} not found.`);
    
    const meetingInfo = data.rows[0].meeting_name + " - " + data.rows[0].semester;
    // delete attendance records
    await pgQuery(`DELETE FROM meeting_student WHERE meeting_id=${id};`); 
    // delete company partnership
    await pgQuery(`DELETE FROM meeting_company WHERE meeting_id=${id};`);
    // delete meeting
    await pgQuery(`DELETE FROM meeting WHERE id=${id};`);
    
    return "Successfully deleted " + meetingInfo;
}

export default async (req, res) => {
    const {
      query: { pid },
    } = req

    let result = {};
    let auth_token = null;
    let user_email = null;

    try {
        if (req.method === 'GET') {
            if (pid === 'average-attendance') { // requires exec permission
                [auth_token, user_email] = await checkAuth(req, res, true);
                result = await averageAttendance();
            } else if (pid === 'account-attendance') {
				if(!req.query || (!req.query.email)) {
                    throw("Missing account email in query.");
                }
                // requires account permission IF querying for SELF
                [auth_token, user_email] = await checkAuth(req, res, false);
                if(user_email !== req.query.email) {
                    // query is not for signed in user - requires exec permission
                    [auth_token, user_email] = await checkAuth(req, res, true);
                }
                result = await accountAttendance(req.query.email);
            } else if (pid === 'student-attendance') { // no auth check - student ids are not public
				if(!req.query || (!req.query.id)) {
                    throw("Missing student id in query.");
                }
                result = await studentAttendance(req.query.id);
            } else if (pid == 'meeting-list') { // requires exec permission
                [auth_token, user_email] = await checkAuth(req, res, true);
                result = await meetingList();
            } else if (pid == 'meeting-attendance') {  // requires exec permission
                [auth_token, user_email] = await checkAuth(req, res, true);
                if(!req.query || (!req.query.meetingId)) {
                    throw("Missing meeting id in query.")
                }
                result = await meetingAttendance(req.query.meetingId);
            } else {
                throw("Invalid pid");
            }
        } else if (req.method === 'POST') {
            const body = typeof(req.body) === 'object' ? req.body : JSON.parse(req.body);
            switch(pid) {
                case 'create': // requires exec permission
                    [auth_token, user_email] = await checkAuth(req, res, true);
                    if (!body.meeting_name) throw ("Must provide a meeting name!");
                    if (!body.meeting_date) throw ("Must provide meeting date!");
                    if (!body.semester) throw ("Must provide semester!");
                    result = await create(body.meeting_name, body.meeting_date, body.semester, body.company_id);
                    break;
                case 'delete': // requires exec permission
                    [auth_token, user_email] = await checkAuth(req, res, true);
                    if(!body.meeting_id) throw("Must provide a meeting_id");
                    result = await delete_(body.meeting_id);
                    break;
                default:
                    throw("Invalid pid");
            }
        } else {
            throw("Invalid request type for meeting");
        }
        res.statusCode = 200;
    } catch(err) {
        if(!res.statusCode || res.statusCode === 200 ) res.statusCode = 500;
        console.log(err)
        result.error = err;
    } finally {
        if(auth_token) res.setHeader('Set-Cookie', serialize('auth_token', user_email+":"+auth_token, { httpOnly: true, path: '/' }));
        res.json(result);
    }
  }
