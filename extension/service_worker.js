console.log('el backend esta prendido')
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type == "click_event") {
        console.log("click event captured in current webpage");
        // Call the callback passed to chrome.action.onClicked
    } else if (request.message === 'login') {
        flip_user_status(true, request.payload)
            .then(res => sendResponse(res))
    } else if (request.message === 'logout') {
        flip_user_status(false, null)
            .then(res => sendResponse(res))
    } else if (request.message === 'userStatus') {
        console.log('activado el userStatus')
        is_user_signed_in()
            .then(res => {
                sendResponse({ 
                    message: 'success', 
                    userStatus: res.userStatus,
                    user_info: res.user_info
                });
            })
    } else if (request.message === 'clicked_icon') {
        console.log('click event happened');
    } else if (request.message === 'is_link_in_db') {
        let link = request.link
        let id = request.id
        isLinkInDB(link, id)
            .then(res => sendResponse(res))
    } else if (request.message === 'archive') {
        archiveItem(request.slider_value)
        .then(res => sendResponse(res))
    } else if (request.message === 'un/archive') {
        unArchiveItem()
        .then(res => sendResponse(res))
    }
    return true;
});

/// to check if someone is signed in
function is_user_signed_in() {
    return new Promise(resolve => {
        chrome.storage.local.get(['userStatus', 'user_info'],
            function (response) {
                if (chrome.runtime.lastError) resolve({ userStatus: 
                    false, user_info: {} })

            resolve(response.userStatus === undefined ?
                    { userStatus: false, user_info: {} } :
                    { userStatus: response.userStatus, 
                        user_info: response.user_info }
                    )
            });
    });
};

function flip_user_status(signIn, user_info) {
    if (signIn) {
        async function fetchToken() {
            const res = await fetch('http://localhost:8000/token', {
                method: 'POST',
                headers: {
                    'accept': 'application/json'
                },
                body: new URLSearchParams({
                    'username': user_info.email,
                    'password': user_info.pass
                })
            })
            return res.json()
        }
        return new Promise(resolve => {
            fetchToken()
            .then((res) => {
                user_info['user_id'] = res.user_id
                console.log('user_info', user_info)
                chrome.storage.local.set({ userStatus: signIn, user_info, token:res.access_token}, function (response) {
                    if (chrome.runtime.lastError) resolve('fail');
                });
                resolve('success')
            })
            .catch(err => console.log('fallo algo', err));
        });

// cambiar todo esto/
    } else if (!signIn) {
        // fetch the localhost:3000/logout route
        return new Promise(resolve => {
            chrome.storage.local.get(['userStatus', 'user_info'], function (response) {
                console.log(response);
                if (chrome.runtime.lastError) resolve('fail');

                if (response.userStatus === undefined) resolve('fail');

                chrome.storage.local.set({ userStatus: signIn, user_info: {} }, function (response) {
                    if (chrome.runtime.lastError) resolve('fail');

                    user_signed_in = signIn;
                    resolve('success');
                });
            });
        });
    }
};


function isLinkInDB(link, id) {
    console.log(link, id)
    async function fetchLink (token) {
        const options = {
            'method': 'GET',
            'headers': {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': `Bearer ${token}`,
            }
        }
        console.log('options', options)
        const response = await fetch('http://localhost:8000/link_in_db?' + new URLSearchParams({'link' : link}), options)
        return response.json()
    }
    return new Promise(resolve => {
        chrome.storage.local.get(['token'], function (response) {
            if (chrome.runtime.lastError) resolve('fail');
            let token = response.token
            fetchLink(token)
                .then((res)=> {  
                    chrome.storage.local.set({ item:res }, function (response) {
                        if (chrome.runtime.lastError) resolve('fail');
                    });
                    console.log('res link', res);
                    resolve(res);
                })   
                .catch(function (error) {
                    console.log('error', error)
                    resolve(error)
                });
        });
    });
};

const archiveItem = (archived_rating) => {
    return new Promise(resolve => {
        chrome.storage.local.get(['item'], function (response) {
            console.log('item in storage', response.item)
            const data = {
                ...response.item,
                archived: true,
                archived_rating: archived_rating
            }
            console.log('data',data)
            fetch('http://localhost:8000/update_item', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    },
                body: JSON.stringify(data)
            })
            .then(res => {
                res.json()
                .then(res => {
                    resolve(res)
                })
            })
            .catch(err => resolve(err))
        })
    })
    
}

const unArchiveItem = () => {
    return new Promise(resolve => {
        chrome.storage.local.get(['item'], function (response) {
            console.log('item in storage', response.item)
            const data = {
                ...response.item,
                archived: false,
            }
            console.log('data',data)
            fetch('http://localhost:8000/update_item', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    },
                body: JSON.stringify(data)
            })
            .then(res => {
                res.json()
                .then(res => {
                    resolve(res)
                })
            })
            .catch(err => resolve(err))
        })
    })
    
}