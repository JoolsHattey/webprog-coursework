"use strict";

import { Component } from '../component.js';
import { $ } from '../../app.js';

export class Dropdown extends Component {
    constructor(options) {
        super({
            template: '/components/dropdown/dropdown.component.html',
            styles: '/components/dropdown/dropdown.component.css'
        });
        this.initElement(options);
    }
    
    async initElement() {
        await this.templatePromise;
        this.inputSelector = $(this, 'select');
    }

    async setOptions(options) {
        await this.initElement();
        options.forEach(item => {
            const option = document.createElement("option");
            option.value = item.value;
            option.append(item.text);
            this.inputSelector.appendChild(option);
        });
    }

    async setOption(option) {
        await this.initElement();
        this.inputSelector.value = option;
    }

    async setOnChange(callbackFn) {
        await this.initElement();
        this.inputSelector.onchange = callbackFn;
    }
}

customElements.define('dropdown-el', Dropdown);