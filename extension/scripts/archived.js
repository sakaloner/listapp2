let cancel = document.getElementById("btn_cancel");
cancel.addEventListener('click', () => {
    console.log('cancel');
    window.close()
});




let username = document.getElementById("username");
chrome.runtime.sendMessage({message:'userStatus'})
.then(res => {
    console.log('wrod',res)
    username.innerHTML += res.user_info.email
})


archive.addEventListener('click', () => {
    chrome.runtime.sendMessage({ message: 'archive', payload: {slider_value:slider_value}},
        (response)=> {
            console.log('response archive', response)
            if (response === 'success'){
                window.location.replace('./index_archive.html');
            } else {
                console.log('error')
            }
        }
    );
});

// logout shit
let logoutbtn = document.getElementById("logout");
logoutbtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ message: 'logout' },
        function (response) {
            if (response==='success')
               window.location.replace('../popups/index_login.html')
        }
    );
});