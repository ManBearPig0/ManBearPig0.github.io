class question {
    constructor() {

        window.onload += this.load();
    }

    load() {
        let elems = document.querySelector('p');
        // Create a new text node called "Water"
        var test = document.createTextNode("testing");

        console.log("loading...");

        elems.forEach(e => {
            e.replaceChild(test, e.childNodes[0])
        });
    }

    onClick() {
        // Handle the click
    }

}