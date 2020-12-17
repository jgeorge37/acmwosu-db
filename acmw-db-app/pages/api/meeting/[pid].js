import pgQuery from '../../../postgres/pg-query.js';
import {currentAcademicYear} from '../utility';

// GET /api/meeting/average-attendance
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
async function accountAttendance(email) {
	const data = await pgQuery(`SELECT s.id FROM student s INNER JOIN account a on s.id = a.student_id WHERE a.email = '${email}'`);
	if(!data.rowCount) throw (`No student associated with account ${email}`);
	return (await studentAttendance(data.rows[0].id));
}

// GET /api/meeting/meeting-list
async function meetingList() {
    const data = await pgQuery(`SELECT meeting_name, meeting_date, id FROM meeting`);
    return data.rows;
}

// GET /api/meeting/meeting-attendance
async function meetingAttendance(meetingId) {
    const data = await pgQuery(`
        SELECT s.fname, s.lname
        FROM student s INNER JOIN meeting_student ms ON s.id = ms.student_id
        WHERE ms.meeting_id = '${meetingId}'`)
    return data.rows;
}

// POST /api/meeting/create
// Create a meeting: meeting_name, meeting_date, semester (AUXX or SPXX), and company_id associated (null if no company)
async function create(meeting_name, meeting_date, semester, company_id) {
    // For code expiration, you can get the meeting_date and add two hours to it
    const code = ("" + Math.random()).substring(2, 7);

    // re-generate code if already in table - highly unlikely to happen even once, so runtime in reality is not bad.
    while((await pgQuery(`SELECT * FROM meeting WHERE code = '${code}';`)).rows.length > 0) {
        token = ("" + Math.random()).substring(2, 7);
    }

    const data = await pgQuery(`INSERT INTO meeting (meeting_name, meeting_date, code, semester) 
    VALUES('${meeting_name}', '${meeting_date}', '${code}', '${semester}');`)

    if (company_id) {

        // Get recently created meeting id
        const meetingIdData = await pgQuery(`
            SELECT id 
            FROM meeting
            WHERE meeting_name = '${meeting_name}'`);

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
    return data;  
}

export default async (req, res) => {
    const {
      query: { pid },
    } = req

    let result = {};

    try {
        if (req.method === 'GET') {
            if (pid === 'average-attendance') {
                result = await averageAttendance();
            } else if (pid === 'account-attendance') {
				if(!req.query || (!req.query.email)) {
                    throw("Missing account email in query.");
                }
                result = await accountAttendance(req.query.email);
            } else if (pid === 'student-attendance') {
				if(!req.query || (!req.query.id)) {
                    throw("Missing student id in query.");
                }
                result = await studentAttendance(req.query.id);
            } else if (pid == 'meeting-list') {
                result = await meetingList();
            } else if (pid == 'meeting-attendance') {
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
                case 'create': 
                    if (!body.meeting_name) throw ("Must provide a meeting name!");
                    if (!body.meeting_date) throw ("Must provide meeting date!");
                    if (!body.semester) throw ("Must provide semester!");
                    result = await create(body.meeting_name, body.meeting_date, body.semester, body.company_id);
                    break;
                default:
                    throw("Invalid pid");
            }
        } else {
            throw("Invalid request type for meeting");
        }
        res.statusCode = 200;
    } catch(err) {
        res.statusCode = 500;
        result.error = err;
    } finally {
        res.json(result);
    }
  }
