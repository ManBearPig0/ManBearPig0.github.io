class ElementEditor {
    constructor() {
        this.text = {
            editorDisableText: "Return to View Mode",
            editorEnableText: "Enable Editor Mode",
        }


        /* NOTE To-do:
            Highlight all elements of selected type.
            Highlight if hover over a specific element.
            Highlight if element is selected.

            get and show the style of selected element
            update the style of selected element
        */


        this.editorEnabled = false;

        // Initialize editor button
        this.editorButton = document.getElementById('footer__editer-button--toggle');
        this.editorButton.addEventListener('click', (e) => this.handleToggleEditor(e, this.text));
        this.editorButton.replaceChild(document.createTextNode(this.text.editorEnableText), this.editorButton.childNodes[0]);

        // Initialize elements to edit
        this.editableElements = {};
        this.elementSelect = document.getElementById('element-select');

        Array.from(this.elementSelect.options).map(option => {
            let tagName = option.value;
            let elements = document.getElementsByTagName(tagName);

            this.editableElements[tagName] = elements;
        });

        this.selectedElement = Object.keys(this.editableElements)[0];
        this.elementSelect.addEventListener("change", (e) => {
            let previous_elems = this.editableElements[this.selectedElement];
            let selected_elems = this.editableElements[e.target.value];

            this.selectedElement = e.target.value;

            Array.from(previous_elems).forEach(element => {
                element.removeEventListener('mouseenter', this.elementMouseEnter);
                element.removeEventListener('mouseleave', this.elementMouseLeave);

            });

            Array.from(selected_elems).forEach(element => {
                element.addEventListener('mouseenter', this.elementMouseEnter);
                element.addEventListener('mouseleave', this.elementMouseLeave);
            });

        });

        console.log(this.editableElements);
    }

    elementMouseEnter(e) {
        console.log("entered", e.target);
    }

    elementMouseLeave(e) {
        console.log("left", e.target);
    }

    handleSelectElement(e, editor) {
        editor.selectedElement = e.target.value;
    }

    handleToggleEditor(e, text) {
        console.log(this.selectedElement);
        this.editorEnabled = !this.editorEnabled

        let footer__upper = document.querySelector('.footer__upper');
        let root = document.querySelector(':root');
        let rootStyle = getComputedStyle(root);
        let menu = document.querySelector('footer .footer__upper menu');

        let button = e.target;

        if (this.editorEnabled) {
            footer__upper.style.setProperty('height', rootStyle.getPropertyValue('--footer__upper-ub-size'));
            menu.classList.remove('hidden');
            button.replaceChild(document.createTextNode(this.text.editorDisableText), button.childNodes[0]);

        } else {
            footer__upper.style.setProperty('height', rootStyle.getPropertyValue('--footer__upper-lb-size'));
            menu.classList.add('hidden');
            button.replaceChild(document.createTextNode(text.editorEnableText), button.childNodes[0]);
        }
    }



    test() {
        console.log("test editor");
    }
}

const Editor = new ElementEditor();

// Test code
Editor.test();

// Export Module to be able to require() this file.
// module.exports = Editor;