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
    }
    get textLabel() {
        this.getAttribute('textlabel');
    }
    set textLabel(newValue) {
        this.setAttribute('textlabel', newValue);
    }
    static get observedAttributes() { return ['textlabel'] }

    async attributeChangedCallback(name, oldValue, newValue) {
        await this.templatePromise;
        console.log(newValue)
        this.setTextLabel(newValue);
    }
    setTextLabel(newValue) {
        $(this, 'span').append(newValue);
        this.inputEl.value = newValue;
    }

    /**
     * @returns {boolean}
     */
    getValue() {
        if(this.inputEl.checked) {
            return this.inputEl.value;
        }
        return;
    }
    async setValue(newValue) {
        await this.templatePromise;
        this.inputEl.checked = newValue;
    }
    /**
     * @param {Function} callback 
     */
    setOnChange(callback) {
        this.inputEl.addEventListener('change', callback);
    }
}

window.customElements.define('checkbox-el', Checkbox);