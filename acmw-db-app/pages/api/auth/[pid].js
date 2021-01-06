import pgQuery from '../../../postgres/pg-query.js';
import {encryptWithAES, decryptWithAES, base64dec} from '../../../utility/crypto';

// Generate (new) auth token and expire time. Returns encrypted token.
async function generateAuth(email) {
    const tok = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
    await pgQuery(`
        UPDATE account SET 
        auth_token = '${tok}', 
        auth_expire_time = current_timestamp + INTERVAL '1 hour'
        WHERE email = '${email}'
    ;`);
    return encryptWithAES(tok);
}

// Refresh token if needed
async function handleToken(email, enc_tok) {
    const dec_tok = decryptWithAES(enc_tok)
    const is_expired = !((await pgQuery(`SELECT id FROM account 
        WHERE email='${email}' AND auth_token='${dec_tok}' AND current_timestamp < auth_expire_time;`)).rowCount > 0)
    return (is_expired ? (await generateAuth(email)) : enc_tok);
}

// Read request headers
function readHeader(req) {
    if(req.headers && req.headers.authorization) {
        let authStr = req.headers.authorization;
        if(authStr.indexOf("Basic ") === 0) {
            authStr = base64dec(authStr.slice("Basic ".length));
            // extract email and encrypted token 
            const email = authStr.split(":")[0];
            const enc_tok = authStr.split(":")[1];
            return {email: email, enc_tok: enc_tok};
        }
    }
    return null;
}

// Throws error if unauthorized or forbidden. If authorized/allowed, check for token refresh.
async function checkAuth(req, res, exec_only) {
    const authInfo = readHeader(req);
    if(authInfo === null) {
        res.statusCode = 401;
        throw("Missing or bad auth header");
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
    const authInfo = readHeader(req);
    if(authInfo === null) return result;

    const dec_tok = decryptWithAES(authInfo.enc_tok);
    const tok_data = await pgQuery(`SELECT is_exec FROM account WHERE email='${authInfo.email}' AND auth_token='${dec_tok}';`);
    if(tok_data.rowCount > 0) {
        result.is_exec = tok_data.rows[0].is_exec;
        result.auth_token = (await handleToken(authInfo.email, authInfo.enc_tok));
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
        result.error = err;
    } finally {
        res.json(result);
    }
  }

export {generateAuth, checkAuth};