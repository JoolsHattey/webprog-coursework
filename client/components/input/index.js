"use strict";

import { Component } from '../component.js';

export class Input extends Component {
    constructor(type) {
        super({
            template: '/components/input/index.html',
            stylesheet: '/components/input/styles.css'
        });
        this.container.classList.add("textinput");
        this.templatePromise.then(() => {
            this.templatePromise = null;
            if(type==="number") {
                this.shadowRoot.querySelector("input")
                    .setAttribute("type", "number");
            }
        });
    }

    getInput() {
        return this.container.querySelector("input").value;
    }
    setInput(newValue) {
        if(this.templatePromise) {
            this.templatePromise.then(() => {
                this.container.querySelector("input").value = newValue;
            });
        } else {
            this.container.querySelector("input").value = newValue;
        }
        
    }
}

customElements.define('input-elmnt', Input);