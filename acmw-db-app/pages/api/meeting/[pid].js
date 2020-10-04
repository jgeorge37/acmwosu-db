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

export default async (req, res) => {
    const {
      query: { pid },
    } = req

    let result = {};

    try {
        if (req.method === 'GET'){
            if (pid === 'averageAttendance') {
                result = await averageAttendance();
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
