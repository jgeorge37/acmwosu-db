import pgQuery from '../../../postgres/pg-query.js';

// GET /api/student/totalUniqueMembers
async function totalUniqueMembers () {
    const d = new Date();
    const year = d.getFullYear() - 2000;
    const month = d.getMonth();
    var fall = "AU", spring = "SP";
    if (8 <= month <= 12) {
      // it's currrently fall semester
      fall += year;
      spring += (year + 1);
    } else {
      //it's currrently spring (or summer)
      fall += (year - 1);
      spring += year;
    }
    const data = await pgQuery(`SELECT COUNT(DISTINCT name_dot_num)
                                FROM student
                                INNER JOIN
                                  meeting_student INNER JOIN meeting
                                  ON meeting_student.meeting_id=meeting.id
                                  AND (meeting.semester='${fall}' OR meeting.semester='${spring}')
                                ON student.id=meeting_student.student_id`);
    return data.rows[0]["count"];
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
