// Get user permissions level
async function clientCheckAuth() {
    const email = localStorage.getItem('email');
    const auth_token = localStorage.getItem('auth_token');
    if(email === null || auth_token === null) {
        return {is_exec: null, auth_token: null};
    } else {
        const str64 = Buffer.from(email + ":" + auth_token).toString('base64');
        const headers = new Headers({ "Authorization": `Basic ${str64}` });
        const res = await fetch(`/api/auth/level`, {method: 'GET', headers: headers});
        const result = await res.json();
        if(result.auth_token) localStorage.setItem('auth_token', result.auth_token);
        return result;
    }
}

// Any other request to our API
async function adaFetch(url, requestOptions) {
    const email = localStorage.getItem('email');
    const auth_token = localStorage.getItem('auth_token');
    
    if(email && auth_token) {
        const str64 = Buffer.from(email + ":" + auth_token).toString('base64');
        const headers = new Headers({ "Authorization": `Basic ${str64}` });
        requestOptions.headers = headers;
    }
    
    const res = await fetch(url, requestOptions);
    const result = await res.json();
    if(result.auth_token) localStorage.setItem('auth_token', result.auth_token);
    return result.data;
}

export {clientCheckAuth, adaFetch}