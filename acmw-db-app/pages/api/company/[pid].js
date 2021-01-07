import pgQuery from '../../../postgres/pg-query.js';
import {checkAuth} from '../auth/[pid]';

// GET /api/company/byString
// Given a string check for potential matching companies
async function companiesByString (input) {
    const data = await pgQuery(`SELECT c.cname, c.id FROM company c WHERE LOWER(c.cname) LIKE LOWER('%${input}%');`);
    return data.rows;
}

// POST /api/company/create
// Create a company, and optionally an associated contact
async function create (name, email, fname, lname, mailing) {
    let data = await pgQuery(`INSERT INTO company (cname) VALUES ('${name}');`);
    // email is required to add contact
    // TODO: call add contact function to be implemented in ADA-44
    /*
    if(email) {

    }
    */
    
    return data;
}

export default async (req, res) => {
    const { 
      query: { pid },
    } = req

    let result = {};
    let auth_token = null;
    let user_email = null;

    try {
        if(req.method === 'GET'){
            if(pid === 'byString') { //requires exec permission
                [auth_token, user_email] = await checkAuth(req, res, true);
                if(!req.query.input) throw ("Missing input query");
                result = await companiesByString(req.query.input);
            } else {
                throw("Invalid pid");
            }
        } else if(req.method === "POST") {
            const body = typeof(req.body) === 'object' ? req.body : JSON.parse(req.body);
            switch(pid) {
                case 'create': //requires exec permission
                    [auth_token, user_email] = await checkAuth(req, res, true);
                    if(!body.company_name) throw("Missing company name in request body");
                    result = await create(body.company_name, body.email, body.fname, body.lname, body.mailing_address);
                    break;
                default:
                    throw("Invalid pid");
            }
        } else {
            throw("Invalid request type for company");
        }
        res.statusCode = 200;
    } catch(err) {
        if(!res.statusCode || res.statusCode === 200 ) res.statusCode = 500;
        result.error = err;
    } finally {
        if(auth_token) res.setHeader('Set-Cookie', serialize('auth_token', user_email+":"+auth_token, { httpOnly: true, path: '/' }));
       // result = {data: result, auth_token: auth_token};
        res.json(result);
    }
  }
