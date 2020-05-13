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
        this.styleTag = document.createElement('style');
        this.head.append(this.styleTag)
        this.addStyleSheet('/styles.css');
        this.container = document.createElement('body');
        this.shadowRoot.append(this.head, this.container);
        if(options) {
            const req = [];
            if(options.stylesheet) {
                req.push(this.addStyleSheet(options.stylesheet));
            }
            if(options.template) {
                req.push(this.addTemplate(options.template));
            }
            this.templatePromise = Promise.all(req);
        }
    }
    /**
     * Adds a stylesheet to the elements head
     * @param {string} path CSS stylesheet path
     */
    async addStyleSheet(path) {
        // const linkElem = document.createElement("link");
        // linkElem.setAttribute("rel", "stylesheet");
        // linkElem.setAttribute("href", path);
        // this.head.appendChild(linkElem);
        const res = await fetch(path);
        const cssText = await res.text();
        this.styleTag.append(cssText);
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