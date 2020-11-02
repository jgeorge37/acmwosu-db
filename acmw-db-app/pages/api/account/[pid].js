import pgQuery from '../../../postgres/pg-query.js';

// POST /api/account/verify
// Check for matching email and password
async function verify (email, password) {
    const data = await pgQuery(`SELECT email FROM account WHERE email = '${email}' AND password = crypt('${password}', password);`);
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
        SET reset_token = '${token}', token_expire_time = current_timestamp + INTERVAL '2 days'
        WHERE email = '${email}';
    `);

    // throw error if the email address doesn't match an account
    if(data.rowCount === 0) throw (`Account with email ${email} does not exist.`);
    return data;
}

// POST /api/account/reset-pw
// Reset password for the account associated with a token provided token is not expired.
// Returns the email address of the account whose password was reset.
async function resetPassword (token, password) {
    // Get the email address associated with a token if token is not expired
    const validResetWindow = await pgQuery(`
        SELECT email FROM account
        WHERE current_timestamp <= token_expire_time AND reset_token = '${token}';
    `);
    if(validResetWindow.rowCount === 0) throw ('Reset password link either expired or invalid');

    try {
        // Set reset_token to null so link cannot be reused and set new password
        await pgQuery(`
            UPDATE account SET
                reset_token = null,
                token_expire_time = null,
                password = crypt('${password}', gen_salt('md5'))
            WHERE email = '${validResetWindow.rows[0].email}';
        `);
    } catch(err) {
        throw("Could not update password: " + err);
    }
    return validResetWindow.rows[0].email;
}

// POST /api/account/create
// Create an account: email = new user's email address, password = unencrypted new password, student_id may be null
async function create (email, password, student_id) {
    const data = await pgQuery(`INSERT INTO account (email, password, student_id)
        VALUES ('${email}', crypt('${password}', gen_salt('md5')), ${student_id ? `'${student_id}'`: null});`); // Ensure that if student_id is undefined, empty, etc. it gets inserted as null
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
                    result = await create(body.email, body.password, body.student_id);
                    break;
                case 'generate-token':
                    if(!body.email) throw ("Missing email address in request body.");
                    result = await generateToken(body.email);
                    break;
                case 'reset-pw':
                    if(!body.password || !body.token) throw ("Missing token and/or new password");
                    result = await resetPassword(body.token, body.password);
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
