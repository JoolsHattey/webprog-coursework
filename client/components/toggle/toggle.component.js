'use strict';

import { Component } from "../component.js";
import { $ } from "../../app.js";

export class Toggle extends Component {
    constructor() {
        super({
            template: '/components/toggle/toggle.component.html',
            stylesheet: '/components/toggle/toggle.component.css'
        });
        this.initElement();
    }

    async initElement() {
        await this.templatePromise;
        $(this, 'input').addEventListener('change', e => this.checked = e.target.checked);
    }

    async setOnChange(callback) {
        await this.templatePromise;
        $(this, 'input').addEventListener('change', callback);
    }

    static get observedAttributes() { return ['checked'] }

    async attributeChangedCallback(name, oldValue, newValue) {
        await this.templatePromise;
        this.setValue(newValue);
    }

    getValue() {
        return $(this, 'input').checked;
    }
    setValue(value) {
        if(typeof value === 'string') {
            $(this, 'input').checked = value === 'true';
        } else {
            $(this, 'input').checked = value;
        }
    }

    get checked() {
        this.getAttribute('checked');
    }
    set checked(newValue) {
        this.setAttribute('checked', newValue);
    }
}

customElements.define('toggle-el', Toggle);