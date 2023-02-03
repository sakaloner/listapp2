async function request(route= '', method=' ', data = {}) {
    if (method === 'GET') {
        const response = await fetch(process.env.API_URL + route, {
            method: method, 
            cache: 'no-cache',
            headers: {
            'Content-Type': 'application/json'
            },
        });
        return response.json(); 
    } else {
        const response = await fetch(process.env.API_URL + route, {
            method: method, 
            cache: 'no-cache',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) 
        });
        return response.json(); 
    }
}
export default request