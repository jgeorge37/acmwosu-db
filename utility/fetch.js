// Get user permissions level
async function clientCheckAuth() {
    const res = await fetch(`/api/auth/level`, {method: 'GET'});
    const result = await res.json();
    return result;
}

export {clientCheckAuth}