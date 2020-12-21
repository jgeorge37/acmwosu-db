import pgQuery from '../../../postgres/pg-query.js';

// GET /api/ghc/check-external-scholarship
async function checkExternalScholarship(email) {
  const data = await pgQuery(`SELECT s.id FROM student s INNER JOIN account a on s.id = a.student_id WHERE a.email = '${email}'`);
	if(!data.rowCount) throw (`No student associated with account ${email}`);
  const result  = await pgQuery(`SELECT external_sch FROM ghc WHERE student_id = '${data.rows[0].id}'`);
  if(!result.rowCount) throw (`No GHC student associated with account ${email}`);
  return result.rows[0].external_sch;
}

export default async (req, res) => {
    const {
      query: { pid },
    } = req

    let result = {};

    try {
        if (req.method === 'GET') {
            if (pid === 'check-external-scholarship') {
               if (!req.query || (!req.query.email)) {
                  throw("Missing account email in query.");
               }
               result = await checkExternalScholarship(req.query.email);
            } else {
                throw("Invalid pid");
            }
        } else {
            throw("Invalid request type for ghc");
        }
        res.statusCode = 200;
    } catch(err) {
        console.log(err)
        res.statusCode = 500;
        result.error = err;
    } finally {
        res.json(result);
    }
  }
