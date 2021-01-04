import pgQuery from '../../../postgres/pg-query.js';

// POST /api/account/verify
// Check for matching email and password
async function verify (email, password) {
    const data = await pgQuery(`SELECT email, is_exec, id FROM account WHERE email = '${email}' AND password = crypt('${password}', password);`);
    return data.rows;
}

// POST /api/account/generate-token
// Generate a password reset token and set the expiration timestamp
async function generateToken (email) {
    let token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);

    // re-generate token if already in table - highly unlikely to happen even once, so runtime in reality is not bad.
    while((await pgQuery(`SELECT * FROM account WHERE reset_token = '${token}';`)).rows.length > 0) {
        token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
    }

    // save token and set expiration time 2 days in the future
    const data = await pgQuery(`
        UPDATE account
        SET reset_token = '${token}', token_expire_time = current_timestamp + INTERVAL '1 hour'
        WHERE email = '${email}';
    `);

    data.token = token;
    return data;
}

// GET /api/account/check-reset
async function checkReset (token) {
    // Get the email address associated with a token if token is not expired
    const validResetWindow = await pgQuery(`
        SELECT email FROM account
        WHERE current_timestamp <= token_expire_time AND reset_token = '${token}';
    `);

    return validResetWindow.rows;
}

// POST /api/account/reset-pw
// Reset password for the account with the given email
async function resetPassword (email, password) {
    try {
        // Set reset_token to null so link cannot be reused and set new password
        await pgQuery(`
            UPDATE account SET
                reset_token = null,
                token_expire_time = null,
                password = crypt('${password}', gen_salt('md5'))
            WHERE email = '${email}';
        `);
    } catch(err) {
        throw("Could not update password: " + err);
    }
    return "Changed password for " + email;
}

// POST /api/account/create
// Create an account with randomized initial password
async function create (email, student_id, is_exec) {
    const randomPassword = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
    const data = await pgQuery(`INSERT INTO account (email, password, student_id, is_exec)
        VALUES ('${email}', crypt('${randomPassword}', gen_salt('md5')), '${student_id}', ${is_exec});`); 
    return data;
}

// GET /api/account/list
// List accounts (id, email, is_exec, student_id) and student (fname, lname, school_level) information
// Paginated - uses args for limit and offset
async function list(limit, offset) {
    const data = {accountRows: [], totalCount: null};
    // Get data for 10 accounts
    const accounts = await pgQuery(`
        SELECT a.id, a.email, a.is_exec, a.student_id, s.fname, s.lname, s.school_level
        FROM account a INNER JOIN student s ON a.student_id=s.id
        ORDER BY LOWER(s.lname) ASC
        LIMIT ${limit}
        OFFSET ${offset}
    ;`);

    if(accounts.rowCount != 0) data.accountRows = accounts.rows;
    // Get total number of accounts
    data.totalCount = (await pgQuery(`SELECT COUNT(*) FROM account a INNER JOIN student s ON a.student_id=s.id;`)).rows[0].count;
    return data;
}

export default async (req, res) => {
    const {
      query: { pid },
    } = req

    let result = {};

    try {
        if(req.method === 'POST'){
            const body = typeof(req.body) === 'object' ? req.body : JSON.parse(req.body);
            switch(pid) {
                case 'verify':
                    result = await verify(body.email, body.password);
                    break;
                case 'create':
                    if(!body.email) throw("Missing email in request body");
                    if(!body.student_id) throw ("Missing student_id in request body");
                    const is_exec = (typeof body.is_exec === 'undefined' || body.is_exec === null) ? false : body.is_exec;
                    result = await create(body.email, body.student_id, is_exec);
                    break;
                case 'generate-token':
                    if(!body.email) throw ("Missing email address in request body.");
                    result = await generateToken(body.email);
                    break;
                case 'reset-pw':
                    if(!body.password || !body.email) throw ("Missing email and/or new password");
                    result = await resetPassword(body.email, body.password);
                    break;
                default:
                    throw("Invalid pid");
            }
        } else if(req.method === 'GET') {
            switch(pid) {
                case 'check-reset':
                    if(!req.query.token) throw("Missing token in query");
                    result = await checkReset(req.query.token);
                    break;
                case 'list':
                    if(!req.query.offset || !req.query.limit) throw("Missing limit and/or offset in query");
                    result = await list(req.query.limit, req.query.offset);
                    break;
                default:
                    throw("Invalid pid");
            }
        } else {
            throw("Invalid request type for account");
        }
        res.statusCode = 200;
    } catch(err) {
        res.statusCode = 500;
        result.error = err;
    } finally {
        res.json(result);
    }
  }
