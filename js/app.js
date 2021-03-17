(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

// Import modules
const ElementEditor = require('../js/components/elementEditor');
ElementEditor.test();
},{"../js/components/elementEditor":2}],2:[function(require,module,exports){
class ElementEditor {
    constructor() {
        // Get editor button
        this.editorButton = document.querySelector('#footer__editer-button--toggle');
        console.log("button:", this.editorButton);
        editorButton.addEventListener('click', handleToggleEditor);

        this.state = {
            editorEnabled: false,
        }

        window.onload += this.init();

        this.test();
    }

    init() {
        console.log("what?");

        // Create a function for getting a variable value
        function myFunction_get() {
            // Get the styles (properties and values) for the root
            var rs = getComputedStyle(r);
            // Alert the value of the --blue variable
            alert("The value of --blue is: " + rs.getPropertyValue('--blue'));
        }

        // Create a function for setting a variable value
        function myFunction_set() {
            // Set the value of variable --blue to another value (in this case "lightblue")
            r.style.setProperty('--blue', 'lightblue');
        }
    }

    handleToggleEditor() {
        this.editorEnabled = !this.editorEnabled

        let footer__upper = document.querySelector('#footer__upper');
        let root = document.querySelector(':root');

        console.log("toggle footer size:", root, footer__upper);

        if (this.editorEnabled) {
            footer__upper.style.setProperty(root.getPropertyValue('--footer__upper-ub-size'));
        } else {
            footer__upper.style.setProperty(root.getPropertyValue('--footer__upper-lb-size'));
        }
    }

    handleEnableEditor() {

    }

    test() {
        console.log("test2");
    }
}


module.exports = new ElementEditor();

// let editor = new ElementEditor();
// console.log("created editor: ", editor);

// editor.test();
},{}]},{},[1]);
