import pgQuery from '../../../postgres/pg-query.js';

// GET /api/student/totalUniqueMembers
async function totalUniqueMembers () {
    const data = await pgQuery(`SELECT COUNT(DISTINCT name_dot_num) FROM student`);
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
