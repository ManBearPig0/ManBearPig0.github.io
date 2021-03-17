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

        // Should also contain body and children of main
        this.candidateElements = document.body.children;
        this.editableElements = {};
        this.elementSelect = document.getElementById('element-select');

        for (var i = 0; i < this.candidateElements.length; i++) {
            let tagName = this.candidateElements[i].nodeName;
            switch (tagName) {
                case 'BODY':
                case 'HEADER':
                case 'FOOTER':
                case 'ASIDE':
                case 'ARTICLE':
                case 'SECTION':
                    // if the option is not in the select
                    if (Object.values(this.elementSelect).indexOf(tagName) == -1) {
                        let option = document.createElement("option");
                        option.value = tagName;
                        let text = document.createTextNode(option.value);
                        option.appendChild(text);
                        this.elementSelect.appendChild(option);

                        let elements = document.getElementsByTagName(option.value);
                        let elementObjects = Array.from(elements).map(element => {
                            return new EditableElement(element);
                        });
                        this.editableElements[option.value] = elementObjects;
                    }
            }
        }

        this.selectedElement = Object.keys(this.editableElements)[0];
        this.elementSelect.addEventListener("change", (e) => {
            let previous_elems = this.editableElements[this.selectedElement];
            let selected_elems = this.editableElements[e.target.value];

            this.selectedElement = e.target.value;

            Array.from(previous_elems).forEach(elem => {
                elem.disable(elem);
            });

            Array.from(selected_elems).forEach(elem => {
                elem.enable(elem);
            });

        });

        console.log(this.editableElements);
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


class EditableElement {
    constructor(element) {
        this.element = element;
        this.editEnabled = false;
        this.selected = false;

        this.element.addEventListener('mouseenter', (e) => this.elementMouseEnter(e, this));
        this.element.addEventListener('mouseleave', (e) => this.elementMouseLeave(e, this));
        this.element.addEventListener('click', (e) => this.elementMouseClick(e, this))
    }

    disable(_this) {
        _this.editEnabled = false;
        this.selected = false;
        _this.removeElementHighlight(_this);
        _this.element.classList.remove('highlight--selected');
        // Remove event listener doesnt work
        // _this.element.removeEventListener('mouseenter', (e) => _this.elementMouseEnter(e, _this));
        // _this.element.removeEventListener('mouseleave', (e) => _this.elementMouseLeave(e, _this));
    }

    enable(_this) {
        _this.editEnabled = true;
        // Remove event listener doesnt work
        // _this.element.addEventListener('mouseenter', (e) => _this.elementMouseEnter(e, _this));
        // _this.element.addEventListener('mouseleave', (e) => _this.elementMouseLeave(e, _this));
    }

    elementMouseEnter(e, _this) {
        if (_this.editEnabled) {
            _this.setElementHighlight(_this);
        }
    }

    elementMouseLeave(e, _this) {
        _this.removeElementHighlight(_this);
    }

    elementMouseClick(e, _this) {
        if (this.editEnabled) {
            this.selected = true;
            _this.element.classList.remove('highlight');
            _this.element.classList.add('highlight--selected');
        }
    }

    setElementHighlight(_this) {
        _this.element.classList.add('highlight');
    }

    removeElementHighlight(_this) {
        _this.element.classList.remove('highlight');
    }
}

const Editor = new ElementEditor();

// Test code
Editor.test();

// Export Module to be able to require() this file.
// module.exports = Editor;
