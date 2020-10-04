import pgQuery from '../../../postgres/pg-query.js';
import {currentAcademicYear} from '../utility';

// GET /api/student/totalUniqueMembers
async function totalUniqueMembers () {
    const [fall, spring] = currentAcademicYear();
    const data = await pgQuery(`SELECT COUNT(DISTINCT name_dot_num)
                                FROM student
                                INNER JOIN meeting_student
                                  INNER JOIN meeting
                                  ON meeting_student.meeting_id=meeting.id
                                ON student.id=meeting_student.student_id
                                WHERE (meeting.semester='${fall}' OR meeting.semester='${spring}')`);
    return data.rows[0]["count"] ? data.rows[0]["count"] : 0;
}

export default async (req, res) => {
    const {
      query: { pid },
    } = req

    let result = {};

    try {
        if (req.method === 'GET'){
            if (pid === 'totalUniqueMembers') {
                result = await totalUniqueMembers();
            } else {
                throw("Invalid pid");
            }
        } else {
            throw("Invalid request type for student");
        }
        res.statusCode = 200;
    } catch(err) {
        res.statusCode = 500;
        result.error = err;
    } finally {
        res.json(result);
    }
  }
