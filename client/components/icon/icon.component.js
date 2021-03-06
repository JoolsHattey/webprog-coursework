'use strict';

import { Component } from '../component.js';
import { $ } from '../../utils.js';

export class Icon extends Component {
  constructor() {
    super({
      template: '/components/icon/icon.component.html',
      stylesheet: '/components/icon/icon.component.css',
    });
    this.initElement();
    if (!this.hasAttribute('size')) this.setAttribute('size', 'default');
    if (!this.hasAttribute('colour')) this.setAttribute('colour', 'light');
  }

  async initElement() {
    await this.loaded;
    this.iconImg = $(this, 'img');
    this.iconImg.src = `/assets/icons/${this.innerHTML}_icon_${this.getAttribute('colour')}.svg`;
    this.iconImg.alt = `${this.innerHTML} icon`;
    switch (this.getAttribute('size')) {
      case 'default':
        this.style.setProperty('--icon-width', '24px');
        this.style.setProperty('--icon-height', '24px');
        break;
      case 'button':
        this.style.setProperty('--icon-width', '18px');
        this.style.setProperty('--icon-height', '18px');
        break;
      default:
        break;
    }
  }
}

window.customElements.define('icon-el', Icon);
