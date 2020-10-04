import pgQuery from '../../../postgres/pg-query.js';
import {currentAcademicYear} from '../utility';

// GET /api/meeting/averageAttendance
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
	if(data.rowCount === 0) throw (`No student associated with account ${email}`);
	return (await studentAttendance(data.rows[0].id));
}

export default async (req, res) => {
    const {
      query: { pid },
    } = req

    let result = {};

    try {
        if (req.method === 'GET'){
            if (pid === 'averageAttendance') {
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
            } else {
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
