"use strict";

import { Component } from '../component.js';

export class Card extends Component {
    /**
     * 
     * @param {Object} options 
     * @param {string} options.template HTML template to define component structure
     * @param {string} options.styles CSS stylesheet for component styling
     */
    constructor(options) {
        super(options);
        this.container.classList.add("card");
        this.addStyleSheet("/components/card/styles.css");
    }
    createTitle(name) {
        const title = document.createElement("div");
        title.append(name);
        this.container.appendChild(title);
    }
    createContent(content) {
        const contentEl = document.createElement("div");
        contentEl.append(content);
    }
    insertElement(el) {
        this.container.appendChild(el);
    }
    setOnClick(callbackFn) {
        this.container.onclick = callbackFn;
    }
    /**
     * @param {boolean} newValue
     */
    set visible(newValue) {
        this.setAttribute('visible', newValue ? 'true' : 'false');
        this.style = newValue ? '' : 'display: none;';
    }
    setVisible(value) {
        if(value) {
            this.style = "";
        } else {
            this.style = "display: none;";
        }
    }
    triggerVisible() {
        this.visible = !(this.getAttribute('visible') === 'true')
    }
}

customElements.define("card-el", Card);