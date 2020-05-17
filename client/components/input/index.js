"use strict";

import { Component } from '../component.js';
import { $ } from '../../app.js';

export class Input extends Component {
    constructor(type, size) {
        super({
            template: '/components/input/index.html',
            stylesheet: '/components/input/styles.css'
        });
        this.initElement(type, size);
    }

    async initElement(type, size) {
        await this.templatePromise;
        if(size == null) {
            size = this.getAttribute('size');
        }
        this.container.classList.add("textinput");
        if(type==="number") {
            $(this, "#response").setAttribute("type", "number");
        }
        const el = $(this, 'div');
        this.size = size;
        if(size==="multiline") {
            this.multiLineInput = document.createElement('textarea');
            this.container.replaceChild(this.multiLineInput, el);
            this.multiLineInput.classList.add('multiLine');
            this.multiLineInput.id = 'response';
            this.multiLineInput.setAttribute('style', `height: ${this.multiLineInput.scrollHeight}px;overflow-y:hidden;`);
            this.multiLineInput.addEventListener('input', this.inputEvent, false);
        } else {
            const singleLineInput = document.createElement('input');
            this.container.replaceChild(singleLineInput, el);
            singleLineInput.classList.add('singleLine');
            singleLineInput.id = 'response';
        }
    }

    inputEvent() {
        this.multiLineInput.style.height = 'auto';
        this.multiLineInput.style.height = `${this.multiLineInput.scrollHeight}px`;
    }

    static get observedAttributes() { return ['underline'] }

    async attributeChangedCallback(name, oldValue, newValue) {
        await this.templatePromise;
        console.log(newValue)
        this.setUnderline(newValue==='true');
    }

    async setUnderline(newValue) {
        await this.templatePromise;
        if(newValue) {
            $(this, '#response').classList.remove('noUnderline');
        } else {
            $(this, '#response').classList.add('noUnderline');
        }
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

    getValue() {
        return this.container.querySelector("#response").value;
    }
    setValue(newValue) {
        if(this.templatePromise) {
            this.templatePromise.then(() => {
                this.container.querySelector("#response").value = newValue;
                if(this.size === 'multiline') {
                    this.inputEvent();
                }
            });
        } else {
            this.container.querySelector("#response").value = newValue;
            if(this.size === 'multiline') {
                this.inputEvent();
            }
        }
        
    }
}

window.customElements.define('input-elmnt', Input);