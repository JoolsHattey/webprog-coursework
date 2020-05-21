'use strict';

import { Component } from '../component.js';

export class Card extends Component {
  /**
   *
   * @param {Object} options
   * @param {string} options.template HTML template to define component structure
   * @param {string} options.stylesheet CSS stylesheet for component styling
   */
  constructor(options) {
    super(options);
    this.addStyleSheet('/components/card/card.component.css');
  }

  createTitle(name) {
    const title = document.createElement('h3');
    title.append(name);
    this.container.appendChild(title);
  }

  createContent(content) {
    const contentEl = document.createElement('div');
    contentEl.append(content);
    this.container.appendChild(contentEl);
  }

  insertElement(el) {
    this.container.appendChild(el);
  }

  setOnClick(callbackFn) {
    this.container.onclick = callbackFn;
  }

  get visible() {
    return this.getAttribute('visible') === 'true';
  }

  /**
   * @param {boolean} newValue
   */
  set visible(newValue) {
    this.setAttribute('visible', newValue ? 'true' : 'false');
    this.style = newValue ? '' : 'display: none;';
  }

  setVisible(value) {
    if (value) {
      this.style = '';
    } else {
      this.style = 'display: none;';
    }
  }

  triggerVisible() {
    this.visible = !(this.getAttribute('visible') === 'true');
  }
}

window.customElements.define('card-el', Card);
