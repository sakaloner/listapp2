async function Request(url='', method='', data={}) {
    const MAIN_URL = process.env.MAIN_URL;
    let options = {
        method:method,
        headers: {
            'Access-Control-Allow-Credentials': 'true',
            'Content-Type': 'application/json'
        },
    }
    if ( 'GET' === method ) {
        url += '?' + (new URLSearchParams(data)).toString();
    } else {
        options.body = JSON.stringify(data);
    }
    const final_url = `http://${MAIN_URL+url}`;
    return fetch(final_url,options).then(response=>response.json())
}

export default Request;
