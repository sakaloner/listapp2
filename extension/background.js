
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type == "click_event") {
        console.log("click event captured in current webpage");
        // Call the callback passed to chrome.action.onClicked
    } else if (request.message === 'login') {
        flip_user_status(true, request.payload)
            .then(res => sendResponse(res))
            .catch(err => console.log(err));
        return true;
    
    } else if (request.message === 'logout') {
        flip_user_status(false, null)
            .then(res => sendResponse(res))
            .catch(err => console.log(err));
        return true;
    } else if (request.message === 'userStatus') {
        is_user_signed_in()
            .then(res => {
                sendResponse({ 
                    message: 'success', 
                    userStatus: res.userStatus,
                    user_info: res.user_info.email 
                });
            })
            .catch(err => console.log(err));
            return true;
    } else if (request.message === 'clicked_icon') {
        console.log('click event happened');
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

});

function flip_user_status(signIn, user_info) {
    if (signIn) {
        console.log(user_info);
        return fetch('http://listapp.be.sexy:8000/token', {
            method: 'POST',
            headers: {
                'accept': 'application/json'
            },
            body: new URLSearchParams({
                'username': user_info.email,
                'password': user_info.pass
            })
        })
            .then(res => {
                console.log(res);
                return new Promise(resolve => {
                    if (res.status !== 200) resolve('fail')

                    chrome.storage.local.set({ userStatus: signIn, user_info }, function (response) {
                        if (chrome.runtime.lastError) resolve('fail');

                        user_signed_in = signIn;
                        resolve('success');
                    });
                })
            })
            .catch(err => console.log('fallo algo', err));
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

