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

function doThingToButtons() {
    let btns = catContainer.getElementsByClassName("category");
    console.log(btns);
    for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function() {
        console.log('clickec button', btns[i].textContent);
        let current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
        });
    };
}
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
            .then(() => {
                getCategories()
                    .then(function (res) {
                        res.forEach(element => {
                            var myDiv = document.getElementById("catContainer");
                            var button = document.createElement("button");
                            var text = document.createTextNode(element);
                            button.appendChild(text);
                            button.classList.add("category");
                            if (element == "pending") {
                                button.classList.add("active");
                            }
                            myDiv.appendChild(button);
                        })
                        console.log('done pupulating the array');
                        
                    })
                    .then(function () {doThingToButtons()});
            })
        .catch(err => console.log(err));
    
};

const getCategories = async () => {
    const result = await fetch(`http://listapp.be.sexy:8000/get_categories/${owner_id}`, {
        headers: {
            'accept': 'application/json'
        }
        })
        .then(function (response) {
            const categories = response.json();
            return categories;
        })
        .catch(function (error) { console.log(error)});
    return result;
}


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

// preprocess for sending data to the server
let saveBtn = document.getElementById("btn");
saveBtn.addEventListener("click", function () {
    let url = document.getElementById("url").innerHTML;
    let name = document.getElementById('name').value;
    let active_category = document.getElementsByClassName("active")[0].innerHTML;
    let value_slider = document.getElementById('myRange').value;
    console.log(`user: ${owner_id}, url: ${url}, nombre: ${name}, cat: ${active_category}, slider: ${value_slider}`)

    // check if  link is in the database

    async function getResponse() {
        let response = await fetch('http://listapp.be.sexy:8000/link_in_db?' + new URLSearchParams({
        'link' : url,
        }), {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        })
            .then(function (response) {  
               // console.log('res link', response);
                let cosa = response.json();
                //console.log('json', cosa);
                return cosa;
            })   
            .catch(function (error) {
                //console.log(error);
                return error
            });
        return response;
    };
    const already_saved = async() => {
        let response = await getResponse();
        console.log(response.is_in_db);
        console.log(response);
        if (response.is_in_db == true) {
            /// 
            console.log('link already saved');
            // archive the item
            fetch('http://listapp.be.sexy:8000/update')
            return true;
        } else {
            // save thing and close the deal. Normal behaviour
            console.log('link not saved');
            // send data to the server
            fetch('http://listapp.be.sexy:8000/items', {
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
                'tipo': active_category,
                'rating': value_slider,
                'owner_id': owner_id,
                })
            })
                .then(res => {
                    console.log(res);
                    document.getElementById('btn').innerHTML = 'Saved!';
                    document.getElementById('btn').style.backgroundColor = 'green';
                    document.getElementById('btn').style.color = 'white';
                    setTimeout(() => {  window.close() }, 1000);
                    return false;
                })
                .catch(err => console.log(err));
            
        }
    };
    already_saved()
            
    
    

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

