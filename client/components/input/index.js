"use strict";

import { Component } from '../component.js';

export class Input extends Component {
    constructor(type) {
        super();

        this.addStyleSheet("/components/input/styles.css");

        this.container.classList.add("textinput");
        this.shadowRoot.appendChild(this.container);

        const input = document.createElement("input");
        input.classList.add("text");

        const selectedArea = document.createElement("span");
        selectedArea.classList.add("highlight");

        const bottomBar = document.createElement("span");
        bottomBar.classList.add("bar");

        const title = document.createElement("label");

        input.id = "response";
        if(type==="number") {
            input.setAttribute("type", "number");
        }
        this.container.appendChild(input);
        this.container.appendChild(selectedArea);
        this.container.appendChild(bottomBar);
        this.container.appendChild(title);
    }

    getInput() {
        return this.container.querySelector("input").value;
    }
    setInput(newValue) {
        this.container.querySelector("input").value = newValue;
    }
}

customElements.define('input-elmnt', Input);