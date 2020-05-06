'use strict';

import { Component } from "../component.js";
import { $ } from "../../app.js";

export class TextInput extends Component {
    constructor() {
        super({
            template: '/components/text-input/text-input.component.html',
            stylesheet: '/components/text-input/text-input.component.css'
        });
        if(this.hasAttribute('size')) {
            this.sizeNotInit = this.setSize(this.getAttribute('size'))
        }
    }

    static get observedAttributes() { return ['size','underline'] }

    attributeChangedCallback(name, oldValue, newValue) {
        if(name === 'size') {
            this.setSize(newValue);
        }
        if(name === 'underline') {
            this.setUnderline(newValue)
        }
    }

    async setUnderline(newValue) {
        await this.templatePromise;
        if(newValue === 'true') {
            $(this, '#input').classList.remove('noUnderline');
        } else {
            $(this, '#input').classList.add('noUnderline');
        }
    }

    async setSize(value) {
        await this.templatePromise;
        const el = $(this, '#input');
        if(value === 'singleline') {
            this.inputEl = document.createElement('input');
            this.container.classList.remove('multiLine');
            this.container.classList.add('singleLine');
        } else if(value === 'multiline') {
            this.inputEl = document.createElement('textarea');
            this.inputEl.setAttribute('style', `height: ${this.inputEl.scrollHeight}px;overflow-y:hidden;`)
            this.inputEl.rows = 1;
            this.container.classList.remove('singleLine');
            this.container.classList.add('multiLine');
            this.inputEl.addEventListener('input', () => this.resize(), false);
        }
        this.inputEl.id = 'input';
        this.container.replaceChild(this.inputEl, el);
    }

    getValue() {
        const inputValue = this.inputEl.value;
        if(inputValue === "" && this.required === 'true') {
            $(this, '.bar').classList.add('warn');
            this.inputEl.classList.add('warnInput')
            this.inputEl.focus()
        };
        if(inputValue === "") return;
        return inputValue;
    }
    async setValue(newValue) {
        await this.sizeNotInit;
        this.inputEl.value = newValue;
        console.log("settingsS")
        this.inputEl.dispatchEvent(new Event('input'));
    }

    resize() {
        console.log(this.inputEl.scrollHeight)
        console.log("yiss")
        this.inputEl.setAttribute('style', 'height: auto;')
        this.inputEl.setAttribute('style', `height: ${this.inputEl.scrollHeight}px;`)
    }

    get required() {
        return this.getAttribute('required');
    }
    set required(newValue) {
        this.setAttribute('required', newValue);
    }
    get size() {
        return this.getAttribute('size');
    }
    set size(newValue) {
        this.setAttribute('size', newValue);
    }
    get underline() {
        return this.getAttribute('underline');
    }
    set underline(newValue) {
        this.setAttribute('underline', newValue);
    }
}

customElements.define('text-input', TextInput);