async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let tab = await chrome.tabs.query(queryOptions);
    return tab[0].url;
};
// get the username 
let user_id
let username = document.getElementById("username");
chrome.runtime.sendMessage({message:'userStatus'})
.then(res => {
    console.log('wrod',res)
    username.innerHTML += res.user_info.email
    user_id = res.user_info.user_id
    getCurrentTab()
    .then(function (tab) {
        console.log('linko',tab, user_id);
        chrome.runtime.sendMessage({message:'is_link_in_db', link:tab, id:user_id})
        .then(res => {
            console.log('link in db',res)
            if (res.archived) {
                window.location.replace('./archived.html');
                return
            }
            if (res.id_item){
                window.location.replace('./index_archive.html');
                return
            }
        })
    })

})


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


let saveBtn = document.getElementById("saveButton");
saveBtn.addEventListener("click", function () {
    let data = {
        owner_id: 4,
        link:document.getElementById("url").innerHTML,
        content:document.getElementById('content').value,
        rating:document.getElementById('slider').value,
        tags: tags? tags : null
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
        setTimeout(() => {  window.close() }, 1200);
        return true;
    })
    .catch(err => console.log('error',err));
})
