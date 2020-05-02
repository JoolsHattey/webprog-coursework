"use strict";

import { Component } from '../component.js';
import { Checkbox } from '../checkbox/checkbox.component.js';

export class Selector extends Component {
    constructor(options, type) {
        super();
        this.options = new Array;
        options.forEach(opt => {
            const container = document.createElement("div");
            let option;
            switch (type) {
                case 'checkbox':
                    option = new Checkbox();
                    option.setAttribute("id", opt);
                    break;
            
                default:
                    option = document.createElement('div')
                    break;
            }
            const label = document.createElement("label");
            label.setAttribute("for", opt);
            // option.setAttribute("type", type);
            // option.setAttribute("name", "name");
            // option.setAttribute("value", opt);
            // option.setAttribute("id", opt);
            // const label = document.createElement("label");
            // label.setAttribute("for", opt);
            label.textContent = opt;
            container.appendChild(option);
            container.appendChild(label);
            this.options.push(option);
            this.container.appendChild(container);
        });
    }
    getInput() {
        let result = new Array;
        this.options.forEach(el => {
            if(el.checked) result.push(el.value);
        });
        return result;
    }
}

customElements.define('selector-elmnt', Selector);