import pgQuery from '../../../postgres/pg-query.js';

// Generate (new) auth token and expire time. Returns encrypted token.
async function generateAuth(email) {
    const tok = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
    await pgQuery(`
        UPDATE account SET 
        auth_token = '${tok}', 
        auth_expire_time = current_timestamp + INTERVAL '1 hour'
        WHERE email = '${email}'
    ;`);
    return tok;
}

// Refresh token if needed
async function handleToken(email, tok) {
    const is_expired = !((await pgQuery(`SELECT id FROM account 
        WHERE email='${email}' AND auth_token='${tok}' AND current_timestamp < auth_expire_time;`)).rowCount > 0)
    return (is_expired ? (await generateAuth(email)) : tok);
}

// Read request cookies
function readCookie(req) {
    if(req.cookies && req.cookies.auth_token) {
        let authStr = req.cookies.auth_token;
        // extract email and token 
        const email = authStr.split(":")[0];
        const tok = authStr.split(":")[1];
        return {email: email, tok: tok};
    }
    return null;
}

function readHeaders(req) {
    if(req.headers && req.headers.authorization && req.headers.authorization.indexOf("Bearer ") === 0) {
        let authHeader = req.headers.authorization;
        authHeader = decodeURIComponent(authHeader.split(" ")[1]);
        const email = authHeader.split(":")[0];
        const tok = authHeader.split(":")[1];
        return {email: email, tok: tok}
    }
    return null;
}

// Throws error if unauthorized or forbidden. If authorized/allowed, check for token refresh.
async function checkAuth(req, res, exec_only) {
    const authInfo = readHeaders(req) || readCookie(req); // check headers if user is using Postman or similar, cookies if browser
    //if(authInfo === null) authInfo = readCookie(req);  // check cookies if user is using browser
    if(authInfo === null) {
        res.statusCode = 401;
        throw("Missing or bad cookie or auth header");
    }
    // get authorization level
    const data = await getAuth(req);
    // no account found for email and token combo
    if(data.is_exec === null) {
        res.statusCode = 401;
        throw("Unauthorized");
    } else if(exec_only && data.is_exec === false) {
        res.statusCode = 403;
        throw("Forbidden");
    }
    // possibly get new token
    return [data.auth_token, authInfo.email];
}

// GET /api/auth/level
// Get the authorization level and auth token of an account.
// req = request
async function getAuth(req) {
    const result = {is_exec: null, auth_token: null};
    const authInfo = readHeaders(req) || readCookie(req);
    if(authInfo === null) return result;

    const tok_data = await pgQuery(`SELECT is_exec FROM account WHERE email='${authInfo.email}' AND auth_token='${authInfo.tok}';`);
    if(tok_data.rowCount > 0) {
        result.is_exec = tok_data.rows[0].is_exec;
        result.auth_token = (await handleToken(authInfo.email, authInfo.tok));
    }
    return result;
}

export default async (req, res) => {
    const {
      query: { pid },
    } = req

    let result = {};

    try {
        if(req.method === 'GET') {
            switch(pid) {
                case 'level':
                    result = await getAuth(req);
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
        console.log(err)
        result.error = err;
    } finally {
        res.json(result);
    }
  }

export {generateAuth, checkAuth};