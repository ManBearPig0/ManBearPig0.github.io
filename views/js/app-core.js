/* This is the core app code.
    You can write code using multiple separate js modules with require('module') and the convert it using Browsify:
    
    Install browsify:
    npm i -g browsify

    Run this to convert to runnable script:
    browserify public/js/app-core.js -o public/js/app.js
*/

// Example for general possible utilities for JS.
if (document.getElementById("test")) {
    Array.from(document.querySelectorAll("#test")).forEach((domContainer) => {
        domContainer.innerHTML = "<p> Changed all elements with id 'test' to this! </p>";
    });
}

if (document.getElementById("module-footer")) {
    Array.from(document.querySelectorAll("#module-footer")).forEach((domContainer) => {
        const newFooter = document.createElement('footer');
        // newFooter.innerHTML = "" //Set to footer includes, but doesnt work. 
    });
}

// Import modules
const ElementEditor = require('../js/components/elementEditor');
const Question = require('../js/components/question');

// Execute additional startup code or something
ElementEditor.test();