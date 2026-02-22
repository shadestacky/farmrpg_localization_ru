// ==UserScript==
// @name         getting items
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  try to take over the world!
// @author       You
// @match        https://farmrpg.com/index.php
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    async function fetchPageData(url) {
        try {
            const response = await fetch(url); // Make the network request

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.text(); // Parse the response body as text
            return data;
            // Use the fetched data here
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    function parseDoc(data) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        return doc;
    }

    function getItemDetails(data) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const name = doc.querySelector('.center.sliding') !== null ? doc.querySelector('.center.sliding').innerText.trim() : "";
        if (name === "") {
          return { name: "", description: "", aboutthisitem: "" };
        };
        const description = doc.querySelector('#img') !== null ? doc.querySelector('#img').innerText.trim()
            : Array.from(Array.from(doc.querySelector(".content-block").childNodes)[5].childNodes).filter(node => node.nodeType == node.TEXT_NODE) ?
              Array.from(Array.from(doc.querySelector(".content-block").childNodes)[5].childNodes).filter(node => node.nodeType == node.TEXT_NODE).map(t => t.textContent) : "";
        //"about this item" may not exist, so theres a need for a check
        const aboutthisitem = doc.querySelector('.content-block-title i.fa-book') ? doc.querySelector('.content-block-title i.fa-book').parentElement.nextElementSibling.querySelector('.card-content .card-content-inner').innerText.trim() : "";
        console.log({ name, description, aboutthisitem });
        return { name, description, aboutthisitem };
    }

    function getAllItemDetailsById() {
        let everyitem = Array.from(document.querySelector(".views").querySelector("[data-page='everything']").querySelector(".pages").querySelector("[data-page='everything']").querySelector(".content-block").childNodes).filter(node => node.tagName === "A").slice(3);
        let everyitemdetailsbyId = {};
        everyitem.forEach(item => {
            const id = item.getAttribute("href").split("id=")[1];
            fetchPageData(item.href).then(data => {
                everyitemdetailsbyId[id] = getItemDetails(data);
            });
        });
        return everyitemdetailsbyId;
    }

    function getAllItemDetailsByName() {
        itemsbyid = getAllItemDetailsById();
        let everyitemdetailsbyName = {};
        for (let id in itemsbyid) {
            const name = itemsbyid[id].name;
            everyitemdetailsbyName[name] = itemsbyid[id];
        }
        // sort the object by key, which is the name of the item
        everyitemdetailsbyName = Object.fromEntries(Object.entries(everyitemdetailsbyName).sort());
        return everyitemdetailsbyName;
    }

    function main() {
        setTimeout(() => {
            window.fetchPageData = fetchPageData;
            window.parseDoc = parseDoc;
            window.getItemDetails = getItemDetails;
            window.getAllItemDetailsById = getAllItemDetailsById;
            window.getAllItemDetailsByName = getAllItemDetailsByName;
            console.log("item getter loaded")

        }, 3000);
    }
    window.runscript = main;
    if (document.readyState === 'loading') {
        console.log("waiting for load...")
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})();