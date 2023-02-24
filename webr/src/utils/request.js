async function Request(url='', method='', data={}, contentType='application/json') {
    const MAIN_URL = process.env.MAIN_URL;
    let options = {
        method:method,
        headers: {
            'Access-Control-Allow-Credentials': 'true',
            'Content-Type': contentType,
            'Credentials': 'include',
        },
    }
    if ( 'GET' === method ) {
        url += '?' + (new URLSearchParams(data)).toString();
    } else {
        if (contentType === 'application/json'){
            options.body = JSON.stringify(data);
        } else {
            options.body = data
        }
    }
    const final_url = `http://${MAIN_URL+url}`;
    console.log('request',final_url, options)
    return (await fetch(final_url,options))
}

export default Request;
