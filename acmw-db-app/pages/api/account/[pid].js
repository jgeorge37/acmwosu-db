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
        WHERE email = '${email}'
    `);

    // throw error if the email address doesn't match an account
    if(data.rowCount === 0) throw (`Account with email ${email} does not exist.`);
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
    
            if(pid === 'verify') {
                result = await verify(body.email, body.password);
            } else if(pid == 'generate-token') {
                if(!body.email) throw("Missing email address in request body.");
                result = await generateToken(body.email);
            } else {
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