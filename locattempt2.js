// ==UserScript==
// @name         FarmRPG Text Scanner
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Scan pages for text elements and export JSON
// @match        https://farmrpg.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    
    const SCRIPT_VERSION = "0.1.3";

    function getPageName() {
        return location.hash.replace(/\#\!\//g, "_").replace(/\?.+/g, "");
    }

    function getUniqueSelector(el) {
        if (el.id) {
            return `#${el.id}`;
        }

        let path = [];
        while (el && el.nodeType === Node.ELEMENT_NODE) {
            let selector = el.nodeName.toLowerCase();

            if (el.className) {
                let classes = el.className.trim().split(/\s+/).join(".");
                selector += "." + classes;
            }

            let sibling = el;
            let nth = 1;
            while (sibling.previousElementSibling) {
                sibling = sibling.previousElementSibling;
                nth++;
            }

            selector += `:nth-child(${nth})`;
            path.unshift(selector);
            el = el.parentElement;
        }

        return path.join(" > ");
    }

    const arraysEqual = (arr1, arr2) => {
        // Check if lengths are the same first
        if (arr1.length !== arr2.length) {
          return false;
        }
      
        // Check if all items exist and are in the same order
        return arr1.every((element, index) => {
          return element === arr2[index];
        });
      };

    // reversing the selector to get the element back from the selector, for testing purposes
    function getElementBySelector(selector) {
        return document.querySelector(selector);
    }

    function applyTranslation(selector, translated, n) {
        const el = getElementBySelector(selector);
        if (!el) {
            console.error(`Element not found for selector: ${selector}`);
            return;
        }

        // this should leave other elements like icons intact, and only change the text content of the element
        //filtering only text nodes and changing all of them to strings in translated
        const nodesTextOnly = Array.from(el.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
        nodesTextOnly.forEach((node, index) => {
            if (index < translated.length) {
                console.log(`Translating node ${n} index ${index} in selector: ${selector} to "${translated[index]}"`);
                node.nodeValue = translated[index];
            } else {            
                console.warn(`No translation provided for node ${n} index ${index} in selector: ${selector}`);    
                node.nodeValue = "";
            }
        });

    }

    function scanPage() {
        const pageName = getPageName();

        let result = {
            version: SCRIPT_VERSION,
            pages: {},
        };

        result.pages[pageName] = {
            locations: {},
            lang: {},
        };

        let elements = document.body.querySelectorAll("*");
        let counter = 0;

        elements.forEach(el => {
            if (
                el.tagName === "SCRIPT" ||
                el.tagName === "STYLE" ||
                el.tagName === "NOSCRIPT" ||
                window.getComputedStyle(el).display === "none"
            ) return;


            let text = [];
            const nodes = Array.from(el.childNodes);
        
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                
                if (node.nodeType === Node.TEXT_NODE && node.nodeValue) {
                    text.push(node.nodeValue);
                }
            }
            if (text.length > 0 && text[0].trim() !== "") {
                let selector = getUniqueSelector(el);
                let blockedmatches = "/chat-txt|chat|/"
                if (selector.match(blockedmatches)) {return;}

                // if the text already exists in the list, we append a location to list of locations
                let existingKey = null;
                for (let key in result.pages[pageName].lang.en) {
                    if (arraysEqual(result.pages[pageName].lang.en[key], text)) {
                        existingKey = key;
                        break;
                    } else {
                    }
                }

                if (existingKey) {
                    let locationCount = Object.keys(result.pages[pageName].locations[existingKey]).length + 1;
                    result.pages[pageName].locations[existingKey][`location${locationCount}`] = selector;
                } else {
                    result.pages[pageName].locations = {
                        ...result.pages[pageName].locations,
                        [`text_${counter}`]: {
                            location1: selector,
                        }
                    };
                    result.pages[pageName].lang = {
                        ...result.pages[pageName].lang,
                        [`text_${counter}`]: {
                            en: text,
                            ru: text,
                        }
                    };
                };

                    counter++;
                }
            });

        console.log("Scan result:", result);

        return result;
    }

    function translatePage(translations, language) {
        const pageName = getPageName();
        if (!translations[pageName]) {
            console.warn(`No translations found for page: ${pageName}`);
            return;
        }

        const pageTranslations = translations.pages[pageName];
        for (let key in pageTranslations.locations) {
            const text = pageTranslations.lang[key][language];
            const selector = pageTranslations.locations[key];

            for (let locationKey in selector) {
                const locationSelector = selector[locationKey];
                applyTranslation(locationSelector, text, key.replace("text_", ""));
            }
        }
    }

    function downloadJSON(data) {
        const blob = new Blob(
            [JSON.stringify(data, null, 2)],
            { type: "application/json" }
        );

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "translations.txt";
        a.click();

        URL.revokeObjectURL(url);
    }

    function checkForNewPages() {
        setInterval(() => {
            let currentPage = getPageName();
            if (window.currentPage !== currentPage) {
                console.log(`Page changed from ${window.currentPage} to ${currentPage}`);
                window.currentPage = currentPage;
                // need to append a new page without deleting the previous ones, so we need to merge the new result with the old one
                let newResult = scanPage();
                for (let page in newResult.pages) {
                    if (!window.result.pages[page]) {
                        window.result.pages[page] = newResult.pages[page];
                        console.log(`New page added: ${page}`);
                    } else {
                        // Merge locations and lang for existing pages
                        for (let key in newResult.pages[page].locations) {
                            if (!window.result.pages[page].locations[key]) {
                                window.result.pages[page].locations[key] = newResult.pages[page].locations[key];
                            }
                        }
                        for (let key in newResult.pages[page].lang) {
                            if (!window.result.pages[page].lang[key]) {
                                window.result.pages[page].lang[key] = newResult.pages[page].lang[key];
                            }
                        }
                        console.log(`Page updated: ${page}`);
                    }
                }
            }
        }, 1000);
    }

    // Run manually from console:
    function main() {
        window.getUniqueSelector = getUniqueSelector;
        window.scanFarmRPGPage = scanPage;
        window.applyTranslation = applyTranslation;
        window.downloadJSON = downloadJSON;
        window.translatePage = translatePage;
        window.getPageName = getPageName;

        console.log(`text scanner v${SCRIPT_VERSION} loaded`);
        window.result = scanPage();
        window.currentPage = getPageName();
        checkForNewPages();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }



})();
