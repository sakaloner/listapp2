// async function fetchData() {
//     const res=await fetch ("https://api.coronavirus.data.gov.uk/v1/data");
//     const record=await res.json();
//     console.log(record);
//     document.getElementById("date").innerHTML=record.data[0].date;
//     document.getElementById("areaName").innerHTML=record.data[0].areaName;
//     document.getElementById("latestBy").innerHTML=record.data[0].latestBy;
//     document.getElementById("deathNew").innerHTML=record.data[0].deathNew;
// }
// fetchData();
console.log("Probando que se restaure la extension");
async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let tab = await chrome.tabs.query(queryOptions);
    return tab[0].url;
};
// getCurrentTab()
//     .then(function (tab) {
//         document.getElementById("url").innerHTML = tab;
//         console.log(tab);
//     })
//     .catch(function (error) {
//         console.log(error);
//     })

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
    // let url = document.getElementById("url").innerHTML;
    let name = document.getElementById('name').value;
    let active_category = document.getElementsByClassName("active")[0].innerHTML;
    let value_slider = document.getElementById('myRange').value;
    console.log(`url: ${url}, nombre: ${name}, cat: ${active_category}, slider: ${value_slider}`)

});
let varis = chrome.storage.local.get();
console.log(varis);

