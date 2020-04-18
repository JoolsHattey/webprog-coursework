"use strict";

import { Component } from '../component.js';

export class Dropdown extends Component {
    constructor(options) {
        super();
        this.initElement(options)
    }
    
    initElement() {
        this.inputSelector = document.createElement("select");
        this.container.appendChild(this.inputSelector);
    }

    setOptions(options) {
        options.forEach(item => {
            const option4 = document.createElement("option");
            option4.value=item.value;
            option4.append(item.text);
            this.inputSelector.appendChild(option4);
        });
    }

    setOnChange(callbackFn) {
        this.inputSelector.onchange = callbackFn;
    }
}

customElements.define('dropdown-el', Dropdown);