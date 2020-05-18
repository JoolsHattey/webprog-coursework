'use strict';

import { Component } from "../component.js";
import { $ } from "../../app.js";

export class TextInput extends Component {
    constructor() {
        super({
            template: '/components/text-input/text-input.component.html',
            stylesheet: '/components/text-input/text-input.component.css'
        });
        this.initElement();
    }

    async initElement() {
        if(this.hasAttribute('size')) {
            this.sizeNotInit = this.setSize(this.getAttribute('size'));
        }
        if(this.hasAttribute('fontsize')) {
            this.setFontSize(this.getAttribute('fontsize'));
        }
    }

    static get observedAttributes() { return ['size','underline', 'fontsize'] }

    attributeChangedCallback(name, oldValue, newValue) {
        if(name === 'size') {
            this.setSize(newValue);
        }
        if(name === 'underline') {
            this.setUnderline(newValue);
        }
        if(name === 'fontsize') {
            this.setFontSize(newValue);
        }
    }

    async setUnderline(newValue) {
        await this.templatePromise;
        if(newValue === 'true') {
            this.inputEl.classList.remove('noUnderline');
        } else {
            this.inputEl.classList.add('noUnderline');
        }
    }

    async setFontSize(value) {
        await this.templatePromise;
        if(value === 'large') {
            this.inputEl.classList.add('largeText');
            this.inputEl.classList.remove('smallText');
        } else {
            this.inputEl.classList.add('smallText');
            this.inputEl.classList.remove('largeText');
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
            this.inputEl.rows = 1;
            this.container.classList.remove('singleLine');
            this.container.classList.add('multiLine');
            this.inputEl.addEventListener('input', () => this.resize(), false); 
        }
        if(this.required) {
            this.inputEl.addEventListener('keyup', (e) => {
                console.log(e.target.value)
                const event = new CustomEvent('validinput', {
                    detail: {
                        valid: !(e.target.value === '')
                    }
                });
                this.validInput = !(e.target.value === '');
                this.dispatchEvent(event);
                this.warn(false);
            });
        }
        this.inputEl.id = 'input';
        this.container.children[0].replaceChild(this.inputEl, el);
    }

    warn(value) {
        if(!this.warnVisible && !value) {

        } else if(this.warnVisible && !value) {
            $(this, '.bar').classList.remove('warn');
            $(this, '#requiredAlert').style = 'display: none;';
            this.inputEl.classList.remove('warnInput');
            this.warnVisible = false;
        } else {
            $(this, '.bar').classList.add('warn');
            $(this, '#requiredAlert').style = '';
            this.inputEl.classList.add('warnInput');
            this.inputEl.focus();
            this.warnVisible = true;
        }
        
    }

    getValue() {
        const inputValue = this.inputEl.value;
        if(inputValue === "" && this.required === 'true') {
            this.warn(true);
        };
        if(inputValue === "") return;
        return inputValue;
    }
    async setValue(newValue) {
        await this.sizeNotInit;
        this.inputEl.value = newValue;
        this.resize();
        this.inputEl.dispatchEvent(new Event('input'))
    }

    resize() {
        this.inputEl.setAttribute('style', 'height: auto;')
        this.inputEl.setAttribute('style', `height: ${this.inputEl.scrollHeight > 20 ? this.inputEl.scrollHeight : 20}px;`)
    }

    async setOnChange(callback) {
        await this.sizeNotInit;
        this.inputEl.addEventListener('change', callback);
    }

    async setLabel(newValue) {
        await this.templatePromise;
        this.container.children[0].children[0].before(newValue);
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

window.customElements.define('text-input', TextInput);