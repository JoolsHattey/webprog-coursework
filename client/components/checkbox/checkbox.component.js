'use strict';

import { Component } from "../component.js";
import { $ } from "../../app.js";

export class Checkbox extends Component {
    constructor() {
        super({
            template: '/components/checkbox/checkbox.component.html',
            stylesheet: '/components/checkbox/checkbox.component.css'
        });
        this.templatePromise.then(() => {
            this.inputEl = $(this, 'input');
        })
        if(this.hasAttribute('textLabel')) {
            this.setAttribute('textLabel', this.getAttribute('textLabel'));
        }
    }
    get textLabel() {
        this.getAttribute('textLabel');
    }
    set textLabel(newValue) {
        this.setAttribute('textLabel', newValue);
        $(this, 'label').append(newValue);
        console.log("yiss")
    }
    /**
     * @returns {boolean}
     */
    getValue() {
        return this.inputEl.checked;
    }
    setValue(newValue) {
        this.inputEl.checked = newValue;
    }
    /**
     * @param {Function} callback 
     */
    setOnChange(callback) {
        this.inputEl.addEventListener('change', callback);
    }
}

customElements.define('checkbox-el', Checkbox);