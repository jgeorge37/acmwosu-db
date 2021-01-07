import pgQuery from '../../../postgres/pg-query.js';
import { checkAuth } from '../auth/[pid].js';

// GET /api/ghc/check-external-scholarship
async function checkExternalScholarship(email) {
  const data = await pgQuery(`SELECT s.id FROM student s INNER JOIN account a on s.id = a.student_id WHERE a.email = '${email}'`);
	if(!data.rowCount) throw (`No student associated with account ${email}`);
  const result  = await pgQuery(`SELECT external_sch FROM ghc WHERE student_id = '${data.rows[0].id}'`);
  if(!result.rowCount) throw (`No GHC-specific data associated with account ${email}`);
  return result.rows[0].external_sch;
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
            if (pid === 'check-external-scholarship') { 
              if (!req.query || (!req.query.email)) {
                  throw("Missing account email in query.");
              }
              // requires account permission IF querying for SELF
              [auth_token, user_email] = await checkAuth(req, res, false);
              if(user_email !== req.query.email) {
                // query is not for signed in user - requires exec permission
                [auth_token, user_email] = await checkAuth(req, res, true);
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
       if(!res.statusCode || res.statusCode === 200 ) res.statusCode = 500;
        result.error = err;
        console.log(err)
    } finally {
      if(auth_token) res.setHeader('Set-Cookie', serialize('auth_token', user_email+":"+auth_token, { httpOnly: true, path: '/' }));
       // result = {data: result, auth_token: auth_token};
        res.json(result);
    }
  }
