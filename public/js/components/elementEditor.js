class ElementEditor {
    constructor() {
        window.onload += this.load();
    }

    load() {
        let elem = document.querySelector("p");
        // Create a new text node called "Water"
        var test = document.createTextNode("testing");

        //asfasf
        console.log("loading...");

        // elems.forEach((e) => {
        elem.replaceChild(test, elem.childNodes[0]);
        // });
    }

    test() {
        console.log("test2");
    }
}