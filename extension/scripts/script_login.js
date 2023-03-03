// Is someone logged in already?
(async () => {
    const res = await chrome.runtime.sendMessage({message:'userStatus'})
    if (res.userStatus) window.location.replace('./index_main.html')
})()

document.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    const email = document.querySelector('#username').value
    const pass = document.querySelector('#password').value
    if (!email || !pass) {
        document.querySelector('#message').innerHTML = "Invalid email or password";
        document.querySelector('#message').classList.add('error');
        return
    }
    chrome.runtime.sendMessage({ message: 'login',
        payload: {email, pass}},
        function (response) {
            if (response === 'success'){
                document.querySelector('#message').innerHTML = "succesfull login";
                document.querySelector('#message').classList.add('success');
                console.log('response, log ing', response)
                setTimeout(() => (window.location.replace('./index_main.html')),1200);
            }else {
                document.querySelector('#message').innerHTML = "Invalid email or password";
                document.querySelector('#message').classList.add('error');
            }
        }
    );
});

// open a tab to the register page when clicking on the register link
document.querySelector('#register').addEventListener('click', event => {
    event.preventDefault();
    chrome.tabs.create({ url: 'http://localhost:3000/register' });
});