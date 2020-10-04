import pgQuery from '../../../postgres/pg-query.js';

// GET /api/meeting/averageAttendance
async function averageAttendance () {
    const d = new Date();
    const year = d.getFullYear() - 2000;
    const month = d.getMonth();
    let fall = "AU", spring = "SP";
    if (8 <= month <= 12) {
      // it's currrently fall semester
      fall += year;
      spring += (year + 1);
    } else {
      //it's currrently spring (or summer)
      fall += (year - 1);
      spring += year;
    }
    const data = await pgQuery(
      `SELECT AVG(COUNT) FROM
      ( SELECT COUNT(DISTINCT student_id)
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
