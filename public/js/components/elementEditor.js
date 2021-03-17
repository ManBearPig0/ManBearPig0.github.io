class ElementEditor {
    constructor() {
        this.text = {
            editorDisableText: "Return to View Mode",
            editorEnableText: "Enable Editor Mode",
        }

        this.editorEnabled = false;

        // Initialize editor button
        this.editorButton = document.getElementById('footer__editer-button--toggle');
        this.editorButton.addEventListener('click', (e) => this.handleToggleEditor(e, this));
        this.editorButton.replaceChild(document.createTextNode(this.text.editorEnableText), this.editorButton.childNodes[0]);

        this.editableElements = {};
        this.elementSelect = document.getElementById('element-select');
        this.styleSelect = document.getElementById('style-select');
        this.styleInputFieldContainer = document.getElementById('style-input-field');

        function addEditableElement(_this, elementName, candidateElements) {
            // Create new option for Select element
            let option = document.createElement("option");
            let text = document.createTextNode(elementName);
            option.value = elementName;
            option.appendChild(text);
            _this.elementSelect.appendChild(option);

            // Add element to Editable Elements
            let elements = document.getElementsByTagName(option.value);
            let elementObjects = Array.from(candidateElements).filter(element => {
                return (element.tagName == elementName);
            }).map(element => {
                return new EditableElement(element, _this);
            });

            _this.editableElements[option.value] = elementObjects;
        }

        let candidateElements = document.body.children;
        addEditableElement(this, "BODY", document.getElementsByTagName("BODY"));
        for (var i = 0; i < candidateElements.length; i++) {
            let tagName = candidateElements[i].nodeName;
            switch (tagName) {
                case 'BODY':
                case 'HEADER':
                case 'FOOTER':
                case 'ASIDE':
                case 'ARTICLE':
                case 'SECTION':
                case 'MAIN':
                    // if the option is not in the select
                    if (!this.editableElements[tagName]) {
                        addEditableElement(this, tagName, candidateElements);
                    }
            }
        }

        this.selectedElementType = Object.keys(this.editableElements)[0];
        this.selectedStyle = Array.from(this.styleSelect.children).find(e => { return true; }).value;

        this.styleInputData = {
            "font-size": { type: 'text', placeholder: 'Press Enter to Set font-size', value: null },
            "background-color": { type: 'color', placeholder: 'Set background color', value: null },
            "color": { type: 'color', placeholder: 'Set text color', value: null }
        };
        this.selectedElement = null;
        this.elementSelect.addEventListener("change", (e) => this.toggleEnabledElements(this, e.target.value));
        this.styleSelect.addEventListener("change", (e) => this.toggleSelectStyle(e.target.value))

    }

    setSelectedElement(elem) {
        // Deselect all elements
        this.editableElements[this.selectedElementType].forEach(element => {
            if (element.selected) {
                element.deselect(element);
            }
        });

        // Set new selected element
        this.selectedElement = elem;

        if (elem) {

            let currentStyle = window.getComputedStyle ? window.getComputedStyle(elem.element, null) : elem.element.currentStyle;

            // Update style values
            this.styleInputData["font-size"].value = currentStyle.fontSize;
            this.styleInputData["background-color"].value = currentStyle.backgroundColor;
            this.styleInputData["color"].value = currentStyle.color;

            // update style field
            this.changeInputField(this.styleInputData[this.selectedStyle]);
        }
    }

    toggleEnabledElements(_this, newElement) {
        let previous_elems = this.editableElements[this.selectedElementType];
        let selected_elems = this.editableElements[newElement];
        this.selectedElementType = newElement;

        Array.from(previous_elems).forEach(elem => {
            elem.disable(elem);
        });

        Array.from(selected_elems).forEach(elem => {
            elem.enable(elem);
        });

        this.setSelectedElement(null);
    }

    toggleSelectStyle(style) {
        this.selectedStyle = style;
        this.changeInputField(this.styleInputData[style]);
    }

    changeInputField(inputData) {
        console.log("input data", inputData);

        let _this = this;
        let inputField = document.createElement('input');
        inputField.type = inputData.type;
        inputField.value = inputData.value;
        inputField.placeholder = inputData.placeholder;
        if (inputData.type == "color") {
            inputField.addEventListener('change', function(e) {
                _this.updateElementStyle(e);
            });
        } else {
            inputField.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    _this.updateElementStyle(e);
                }
            });
        }
        inputField.addEventListener('keypress', function(e) {
            console.log(e);
            if (e.key === 'Enter' || inputData.type == "color") {
                _this.updateElementStyle(e);
            }
        });

        // Remove previous input field
        if (this.styleInputFieldContainer.childNodes.length > 0) {
            this.styleInputFieldContainer.removeChild(this.styleInputFieldContainer.childNodes[0])
        }


        // Add new input field with new data
        this.styleInputFieldContainer.appendChild(inputField);
    }

    updateElementStyle(e) {
        this.selectedElement.element.style[this.selectedStyle] = e.target.value;
    }

    handleToggleEditor(e, _this) {
        this.editorEnabled = !this.editorEnabled

        let footer__upper = document.querySelector('.footer__upper');
        let root = document.querySelector(':root');
        let rootStyle = getComputedStyle(root);
        let menu = document.querySelector('footer .footer__upper menu');

        let button = e.target;

        if (this.editorEnabled) {
            footer__upper.style.setProperty('height', rootStyle.getPropertyValue('--footer__upper-ub-size'));
            menu.classList.remove('hidden');
            button.replaceChild(document.createTextNode(_this.text.editorDisableText), button.childNodes[0]);
            this.toggleEnabledElements(this, this.selectedElementType);

        } else {
            footer__upper.style.setProperty('height', rootStyle.getPropertyValue('--footer__upper-lb-size'));
            menu.classList.add('hidden');
            button.replaceChild(document.createTextNode(_this.text.editorEnableText), button.childNodes[0]);
            this.toggleEnabledElements(this, null);
        }
    }
}


class EditableElement {
    constructor(element, parent) {
        this.element = element;
        this.editEnabled = false;
        this.selected = false;
        this.setSelectedElement = () => parent.setSelectedElement(this);

        this.element.addEventListener('mouseenter', (e) => this.elementMouseEnter(e, this));
        this.element.addEventListener('mouseleave', (e) => this.elementMouseLeave(e, this));
        this.element.addEventListener('click', (e) => this.elementMouseClick(e))
    }

    deselect(_this) {
        _this.selected = false;
        _this.removeElementHighlight(_this);
        _this.element.classList.remove('highlight--selected');
    }

    disable(_this) {
        _this.editEnabled = false;
        _this.deselect(_this);

    }

    enable(_this) {
        _this.editEnabled = true;
    }

    elementMouseEnter(e, _this) {
        if (_this.editEnabled) {
            _this.setElementHighlight(_this);
        }
    }

    elementMouseLeave(e, _this) {
        _this.removeElementHighlight(_this);
    }

    elementMouseClick(e) {
        if (this.editEnabled && this.selected == false) {
            this.setSelectedElement(this);
            this.selected = true;
            this.element.classList.remove('highlight');
            this.element.classList.add('highlight--selected');
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


// Export Module to be able to require() this file.
// module.exports = Editor;