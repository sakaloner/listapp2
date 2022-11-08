// get the username of the person logged in
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
        .catch(err => console.log(err));
};



console.log("Probando que se restaure la extension");
async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let tab = await chrome.tabs.query(queryOptions);
    return tab[0].url;
};
getCurrentTab()
    .then(function (tab) {
        document.getElementById("url").innerHTML = tab;
        console.log(tab);
    })
    .catch(function (error) {
        console.log(error);
    })

// Category focus on the current tab
let catContainer = document.getElementById('catContainer');

let btns = catContainer.getElementsByClassName("category");

for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
      let current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";
    });
};

// preprocess for sending data to the server
let saveBtn = document.getElementById("btn");
saveBtn.addEventListener("click", function () {
    let url = document.getElementById("url").innerHTML;
    let name = document.getElementById('name').value;
    let active_category = document.getElementsByClassName("active")[0].innerHTML;
    let value_slider = document.getElementById('myRange').value;
    console.log(`user: ${owner_id}, url: ${url}, nombre: ${name}, cat: ${active_category}, slider: ${value_slider}`)

    // send data to the server
    fetch('http://localhost:8000/items', {
    method: 'POST',
    headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        'titulo': name,
        'autor': '',
        'link': url,
        // change to an actual todo category when you make it
        'tipo': 'articulos',
        'rating': value_slider,
        'owner_id': owner_id,
        })
    });
});


// logout shit
let logoutbtn = document.getElementById("logout");
logoutbtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ message: 'logout' },
        function (response) {
            if (response === 'success')
               window.location.replace('./index.html');
        }
    );
});

