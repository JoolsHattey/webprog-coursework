'use strict';

/**
 * @typedef {Object} ComponentStructure
 * @property {string} options.template HTML template to define component structure
 * @property {string} options.stylesheet CSS stylesheet for component styling
 */

export class Component extends HTMLElement {
    /**
     * @param {ComponentStructure} options 
     */
    constructor(options) {
        super();
        this.attachShadow({mode: 'open'});
        this.head = document.createElement('head');
        this.shadowRoot.appendChild(this.head)
        this.addStyleSheet('/styles.css');
        this.container = document.createElement('body');
        this.container.classList.add('hide');
        this.shadowRoot.appendChild(this.container);
        if(options) {
            if(options.stylesheet) {
                this.addStyleSheet(options.stylesheet);
            }
            if(options.template) {
                this.templatePromise = this.addTemplate(options.template);
            }
        }
    }
    /**
     * Hide element until loaded in the DOM to prevent FOUC
     */
    connectedCallback() {
        this.container.classList.remove('hide');
    }
    /**
     * Adds a stylesheet to the elements head
     * @param {string} path CSS stylesheet path
     */
    async addStyleSheet(path) {
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", path);
        this.head.appendChild(linkElem);
    }
    /**
     * Parses HTML template file into the body of the component
     * @param {string} path HTML template path
     */
    async addTemplate(path) {
        const parser = new DOMParser();
        const res = await fetch(path);
        const textTemplate = await res.text();
        const htmlTemplate = parser.parseFromString(textTemplate, 'text/html').querySelector('template');
        this.container.append(htmlTemplate.content.cloneNode(true));
    }
}