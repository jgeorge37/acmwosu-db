import pgQuery from '../../../postgres/pg-query.js';
import {checkAuth} from '../auth/[pid]';
import {serialize} from 'cookie';

// GET /api/company/byString
// Given a string check for potential matching companies
async function companiesByString (input) {
    const data = await pgQuery(`SELECT c.cname, c.id FROM company c WHERE LOWER(c.cname) LIKE LOWER('%${input}%');`);
    return data.rows;
}

// email required
async function createContact(email, fname, lname, mailing, companyId) {
    if(!email) throw ("createContact requires an email address");
    let columns = 'email';
    let values = `'${email}'`;
    if(fname) {
        columns += ', fname';
        values += ', ' + `'${fname}'`
    }
    if(lname) {
        columns += ', lname';
        values += ', ' + `'${lname}'`
    }
    if(mailing) {
        columns += ', mailing_addr';
        values += ', ' + `'${mailing}'`
    }
    if(companyId) {
        columns += ', company_id';
        values += ', ' + `'${companyId}'`
    }
    await pgQuery(`INSERT INTO contact (${columns}) VALUES (${values});`);
    return {message: "Inserted " + values};
}

// POST /api/company/create
// Create a company, and optionally an associated contact
async function create (name, email, fname, lname, mailing) {
    await pgQuery(`INSERT INTO company (cname) VALUES ('${name}');`);
    // email is required to add contact
    if(email) {
        let companyId = await pgQuery(`SELECT id FROM company WHERE cname='${name}';`);
        companyId = companyId.rows[0].company_id;
        await createContact(email, fname, lname, mailing, companyId);
    }
    return {message: "Created company " + name};
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
                case 'create-contact': // requires exec permission
                    [auth_token, user_email] = await checkAuth(req, res, true);
                    if(!body.email) throw("Missing email in request body");
                    result = await createContact(body.email, body.fname, body.lname, body.mailing_address, body.company_id);
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
        res.json(result);
    }
  }
 