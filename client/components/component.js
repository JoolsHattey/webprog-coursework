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
    this.styleTag = document.createElement('style');
    this.head.append(this.styleTag);
    this.shadowRoot.append(this.head, this.container);
    if (options) {
      const req = [];
      if (options.stylesheet) {
        req.push(this.addStyleSheet(options.stylesheet));
      }
      if (options.template) {
        req.push(this.addTemplate(options.template));
      }
      /**
       * Promise which resolves when template and styles have loaded
       */
      this.loaded = Promise.all(req);
    }
  }

  /**
   * Adds a stylesheet to the components head
   * @param {string} path CSS stylesheet path
   */
  async addStyleSheet(path) {
    const res = await fetch(path);
    const styleText = await res.text();
    this.styleTag.append(styleText);
    // Make sure CSS imports are at top
    const firstLine = styleText.split('\n')[0];
    if (firstLine.includes('@import')) {
      this.styleTag.textContent = firstLine + this.styleTag.textContent;
    }
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
