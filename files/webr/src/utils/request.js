import {getToken} from './cookies'

async function Request(url='', method='', data={}, auth=false, contentType='application/json') {
    const MAIN_URL = process.env.MAIN_URL;
    const {cookie} = await getToken()

    let options = {
        method:method,
        headers: {
            'Access-Control-Allow-Credentials': 'true',
            'Content-Type': contentType,
            // 'Credentials': 'include',
            'Access-Control-Allow-Origin': '*',
            'Authorization': auth ? `Bearer ${cookie}` : " "
        }
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
    if (!auth) { delete options.headers.Authorization}
    const final_url = `http://${MAIN_URL+url}`;
    console.log('request',final_url, options)
    return (await fetch(final_url,options))
}

export default Request;
