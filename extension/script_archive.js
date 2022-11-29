
// get the username of the person logged in
var owner_id = null;
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

window.onload = function() {
    // redirect to main page if user is already logged in
    is_user_signed_in()
        .then(res => {
            if (res.userStatus) {
                console.log(res);
                owner_id = res.user_info.email;
                console.log(owner_id);
                document.querySelector('#username').textContent = 'logged in as ' + owner_id;
            }
            
        })
}



async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let tab = await chrome.tabs.query(queryOptions);
    return tab[0].url;
};
// if they archive
let archbutton = document.getElementById("btn_archive");

archbutton.addEventListener('click', () => {
    console.log('archive button clicked');
    let value_slider = document.getElementById('myRange').value;
    getCurrentTab().then(url_res=> {
    console.log(url_res, owner_id, value_slider)
        async function getResponse() {
            let response = await fetch('http://listapp.be.sexy:8000/archive_item_by_link?' + new URLSearchParams({
            'link' : url_res,
            'username' : owner_id,
            'slider_value' : value_slider,
            }), {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            })
            return response;
        };
        getResponse()
            .then(function (response) {  
                console.log('res of archivin',response);
                let button2 = document.getElementById('debug');
                button2.innerHTML = 'succesfully archived';
                archbutton.innerHTML = 'Saved!';
                archbutton.style.backgroundColor = 'green';
                archbutton.style.color = 'white';
                //setTimeout(() => {  window.close() }, 2000);
                return true;
            })   
            .catch(function (error) {
                console.log(error);
                return error
            });
    })
});

// if they cancel
let cancelbutton = document.getElementById("btn_cancel");
cancelbutton.addEventListener('click', () => {
    window.location.replace('./index_main.html');
});