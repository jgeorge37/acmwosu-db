import pgQuery from '../../../postgres/pg-query.js';

// POST /api/account/verify
// Check for matching email and password
async function verify (email, password) {
    const data = await pgQuery(`SELECT email FROM account WHERE email = '${email}' AND password = crypt('${password}', password);`);
    return data.rows;
}

// POST /api/account/create
// Create an account: email = new user's email address, password = unencrypted new password, student_id may be null
async function create (email, password, student_id) {
    const data = await pgQuery(`INSERT INTO account (email, password, student_id) 
        VALUES ('${email}', crypt('${password}', gen_salt('md5')), ${student_id ? `'${student_id}'`: null});`); // Ensure that if student_id is undefined, empty, etc. it gets inserted as null
    console.log(data)
    return data;
}

export default async (req, res) => {
    const { 
      query: { pid },
    } = req

    let result = {};

    try {
        if(req.method === 'POST'){
            const body = JSON.parse(req.body);
            switch(pid) {
                case 'verify':
                    result = await verify(body.email, body.password);
                    break;
                case 'create':
                    console.log(body.student_id)
                    result = await create(body.email, body.password, body.student_id);
                    break;
                default:
                    throw("Invalid pid");
            }
        }
        res.statusCode = 200;
    } catch(err) {
        res.statusCode = 500;
        result.error = err;
    } finally {
        res.json(result);
    }
  }