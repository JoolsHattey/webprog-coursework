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
    this.attachShadow({ mode: 'open' });
    this.head = document.createElement('head');
    this.container = document.createElement('body');
    this.shadowRoot.append(this.head, this.container);
    if (options) {
      if (options.stylesheet) {
        this.addStyleSheet(options.stylesheet);
      }
      if (options.template) {
        /**
         * Promise which resolves when HTML template has loaded
         */
        this.templatePromise = this.addTemplate(options.template);
      }
    }
  }

  /**
   * Adds a stylesheet to the components head
   * @param {string} path CSS stylesheet path
   */
  addStyleSheet(path) {
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', path);
    this.head.append(linkElem);
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
