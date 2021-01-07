// Get user permissions level
async function clientCheckAuth() {
    const res = await fetch(`/api/auth/level`, {method: 'GET'});
    const result = await res.json();
    return result;
}

// Any other request to our API
async function adaFetch(url, requestOptions) {
   const res = await fetch(url, requestOptions);
   const result = res.json();
   return result;
}

export {clientCheckAuth, adaFetch}