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
// this is to check if someone is logged in too
window.onload = function() {
    console.log('Clicked icon');
    // redirect to main page if user is already logged in
    let return_session = false;
    is_user_signed_in()
        .then(res => {
            if (res.userStatus) {
                window.location.replace('./index_main.html');
            }
            
        })
        .catch(err => console.log(err));
};


  
document.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();

    const email = document.querySelector('#username').value;
    const pass = document.querySelector('#password').value;

    if (email && pass) {
        
    } else {
        document.querySelector('#username').placeholder = "Enter an email.";
        document.querySelector('#password').placeholder = "Enter a password.";
        document.querySelector('#username').style.backgroundColor = 'red';
        document.querySelector('#password').style.backgroundColor = 'red';
        document.querySelector('#username').classList.add('white_placeholder');
        document.querySelector('#password').classList.add('white_placeholder');
    };
    console.log("submitted")

    chrome.runtime.sendMessage({ message: 'login',
        payload: {email, pass}},
        function (response) {
            if (response === 'success')
            window.location.replace('./index_main.html');
        }
    );
});

// open a tab to the register page when clicking on the register link
document.querySelector('#register').addEventListener('click', event => {
    event.preventDefault();
    chrome.tabs.create({ url: 'http://listapp.be.sexy:5173/signup' });
});