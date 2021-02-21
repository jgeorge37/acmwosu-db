import pgQuery from '../../../postgres/pg-query.js';
import { checkAuth } from '../auth/[pid].js';
import {serialize} from 'cookie';

// GET /api/ghc/check-external-scholarship
async function checkExternalScholarship(email) {
  const data = await pgQuery(`SELECT s.id FROM student s INNER JOIN account a on s.id = a.student_id WHERE a.email = '${email}'`);
	if(!data.rowCount) throw (`No student associated with account ${email}`);
  const result  = await pgQuery(`SELECT external_sch FROM ghc WHERE student_id = '${data.rows[0].id}'`);
  if(!result.rowCount) throw (`No GHC-specific data associated with account ${email}`);
  return result.rows[0].external_sch;
}

// POST /api/ghc/enter-external-scholarship
async function enterExternalScholarship(name_dot_num, id, type, description) {
  let prefix;
  if (type === "External Scholarship") {
    prefix = "Ext=";
  } else if (type === "Alternate Requirement") {
    prefix = "Alt=";
  } else {
    throw("Invalid type.")
  }

  try {
    await pgQuery(`
      UPDATE ghc SET
        req_description='${prefix + description}',
        external_sch=True
      WHERE student_id=${id};
    `);
  } catch(err) {
    throw("Yikes, could not update external scholarship requirement for " + name_dot_num + "!\n" + err)
  }
  return "Successfully updated external scholarship requirement for " + name_dot_num;
}

// GET /api/ghc/volunteer-hours
async function getVolunteerHours(email) {

  const volunteerData = await pgQuery(`
    SELECT g.volunteer_hours, g.volunteer_sources 
    FROM ghc g INNER JOIN account a on g.student_id = a.id
    WHERE a.email = '${email}';
  `)

  if (!volunteerData.rows[0]) throw ('No GHC volunteers hours are recorded!')

  const volunteerHours = volunteerData.rows[0]["volunteer_hours"];
  var totalVolunteerHours = 0;
  if (volunteerHours) volunteerHours.forEach((hours) => {totalVolunteerHours += hours});
  volunteerData.rows[0].totalHours = totalVolunteerHours;
  return volunteerData.rows[0];

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
            } else if (pid == 'volunteer-hours') { 
                if (!req.query || !req.query.email) {
                  throw("Missing account email in query.");
                }
                // requires account permission IF querying for SELF
                [auth_token, user_email] = await checkAuth(req, res, false);
                if(user_email !== req.query.email) {
                  // query is not for signed in user - requires exec permission
                  [auth_token, user_email] = await checkAuth(req, res, true);
                }
                result = await getVolunteerHours(req.query.email);
            } else {
                throw("Invalid pid");
            }
        } else if (req.method === 'POST') {
          const body = typeof(req.body) === 'object' ? req.body : JSON.parse(req.body);
          if (pid === 'enter-external-scholarship') {  // requires exec permission
            [auth_token, user_email] = await checkAuth(req, res, true);
            if (!body.name_dot_num) throw("Missing name_dot_num");
            if (!body.student_id) throw("Missing student_id");
            if (!body.req_type) throw("Missing req_type");
            if (!body.req_desc) throw("Missing req_desc");
            result = await enterExternalScholarship(body.name_dot_num, body.student_id, body.req_type, body.req_desc);
          } else {
              throw("Invalid pid")
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
        res.json(result);
    }
  }
