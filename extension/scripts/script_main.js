// login For the
// chrome.storage.local.get('signed_in', (data) => {
//     if (data.signed_in) {
//       chrome.action.setPopup({popup: 'popup.html'});
//     } else {
//       chrome.action.setPopup({popup: 'popup_sign_in.html'});
//     }
//   });
// console.log('Is this shit even preting something nigga')
// document.addEventListener("click", () => {
//     chrome.runtime.sendMessage({
//       type: "click_event"
//     });
// })

// async function getResponse() {
//     let response = await fetch('http://listapp.be.sexy:8000/link_in_db?' + new URLSearchParams({
//     'link' : url.innerHTML,
//     }), {
//     method: 'GET',
//     headers: {
//         'accept': 'application/json',
//         'Content-Type': 'application/json',
//         'Access-Control-Allow-Origin': '*',
//     },
//     })
//         .then(function (response) {  
//             console.log('res link', response);
//             let cosa = response.json();
//             console.log('json', cosa);
//             return cosa;
//         })   
//         .catch(function (error) {
//             //console.log(error);
//             return error
//         });
//     return response;
// };

// // this is to check if someone is logged in too
// window.onload = function() {
//     // redirect to main page if user is already logged in
//     is_user_signed_in()
//         .then(res => {
//             if (res.userStatus) {
//                 console.log(res);
//                 owner_id = res.user_info.email;
//                 console.log(owner_id);
//                 document.querySelector('#username').textContent = 'logged in as ' + owner_id;
//             }
            
//         })
//             .then(() => {
//                 getResponse()
//                     .then(res => {
//                         console.log('res', res);
//                         if (res.is_in_db) {
//                             console.log('link is in db');
//                             window.location.replace('./index_archive.html');
//                         } else {
//                             getCategories()
//                                 .then(function (res) {
//                                     res.forEach(element => {
//                                         var myDiv = document.getElementById("catContainer");
//                                         var button = document.createElement("button");
//                                         var text = document.createTextNode(element);
//                                         button.appendChild(text);
//                                         button.classList.add("category");
//                                         if (element == "pending") {
//                                             button.classList.add("active");
//                                         }
//                                         myDiv.appendChild(button);
//                                     })
//                                     console.log('done pupulating the array');
                                    
//                                 })
//                                 .then(function () {doThingToButtons()});
//                         }
//                     })

//             })

//         .catch(err => console.log(err));
    
// };



// // Category focus on the current tab
// let catContainer = document.getElementById('catContainer');

// // preprocess for sending data to the server
// let saveBtn = document.getElementById("btn");
// saveBtn.addEventListener("click", function () {
//     let url = document.getElementById("url").innerHTML;
//     let name = document.getElementById('name').value;
//     let active_category = document.getElementsByClassName("active")[0].innerHTML;
//     let value_slider = document.getElementById('myRange').value;
//     console.log(`user: ${owner_id}, url: ${url}, nombre: ${name}, cat: ${active_category}, slider: ${value_slider}`)

//     // check if  link is in the database
//     // save thing and close the deal. Normal behaviour

//     //send data to the server
//     fetch('http://listapp.be.sexy:8000/items', {
//     method: 'POST',
//     headers: {
//         'accept': 'application/json',
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//         'titulo': name,
//         'autor': '',
//         'link': url,
//         'archived': 0,
//         'tipo': active_category,
//         'rating': value_slider,
//         'owner_id': owner_id,
//         })
//     })
//         .then(res => {
//             console.log(res);
//             document.getElementById('btn').innerHTML = 'Saved!';
//             document.getElementById('btn').style.backgroundColor = 'green';
//             document.getElementById('btn').style.color = 'white';
//             //setTimeout(() => {  window.close() }, 1000);
//             return false;
//         })
//         .catch(err => console.log(err));

// });


// // logout shit
// let logoutbtn = document.getElementById("logout");
// logoutbtn.addEventListener('click', () => {
//     chrome.runtime.sendMessage({ message: 'logout' },
//         function (response) {
//             if (response === 'success')
//                window.location.replace('./index.html');
//         }
//     );
// });


async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let tab = await chrome.tabs.query(queryOptions);
    return tab[0].url;
};
getCurrentTab()
    .then(function (tab) {
        let link=document.getElementById("url")
        link.innerHTML = tab;
        link.href = tab;
        console.log(tab);
    })
    .catch(function (error) {
        console.log(error);
    })


let input = document.getElementById("tagsInput");
const printFunction = (tag, name_tag) => {
    console.log('print function');
    console.log(tag);
    console.log(name_tag);
    tag.remove();
    tags = tags.filter(e => e !== name_tag);
}

let tags = []
input.addEventListener("keypress", function (event){
    if (event.key === "Enter") {
        console.log('pressed enter');
        event.preventDefault();
        // Activate the function.
        // creating the tag element
        let tagDiv = document.createElement('div')
        tagDiv.classList.add('tag');
        let tagText = document.createElement('div')
        tagText.innerHTML = input.value;
        tagText.classList.add('tagText');
        let eraseButton = document.createElement('div')
        eraseButton.classList.add('eraseButton');
        eraseButton.innerHTML = 'x';
        eraseButton.addEventListener('click', ()=>printFunction(tagDiv, tagText.innerHTML));
        tagDiv.appendChild(eraseButton);
        tagDiv.appendChild(tagText);
        tagDiv.prepend()
        // adding the tag to the array
        tags.push(input.value)
        input.value = '';
        document.getElementById('tagsBox').prepend(tagDiv)
    }
})

// /// erase tags
// let tagButtons = document.getElementsByClassName("eraseButton")
// console.log('print this', typeof(tagButtons));
// for (let i = 0; i < tagButtons.length; i++) {
//     tagButtons[i].addEventListener("click", function() {
//         console.log('pressed erase');
        // let tag = button.parentNode;
        // tag.parentNode.removeChild(tag);
//     })
// }

    

let saveBtn = document.getElementById("saveButton");
saveBtn.addEventListener("click", function () {
    let data = {
        owner_id: 4,
        link:document.getElementById("url").innerHTML,
        content:document.getElementById('content').value,
        rating:document.getElementById('slider').value,
        tags: tags
    }
    console.log('data', JSON.stringify(data));
    fetch('http://localhost:8000/create_item', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then((res) => {
        console.log(res);
        document.getElementById('saveButton').innerHTML = 'Saved!';
        document.getElementById('saveButton').style.backgroundColor = 'green';
        document.getElementById('saveButton').style.color = 'white';
        //setTimeout(() => {  window.close() }, 1000);
        return true;
    })
    .catch(err => console.log('error',err));
})