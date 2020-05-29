'use strict';

import { Component } from '../component.js';
import { html } from '../../utils.js';

export class Dropdown extends Component {
  constructor(options) {
    super({
      stylesheet: '/components/dropdown/dropdown.component.css',
    });
    this.initElement(options);
  }

  initElement() {
    this.inputSelector = html('select');
    this.container.append(this.inputSelector);
  }

  setOptions(options) {
    options.forEach(item => {
      const option = document.createElement('option');
      option.value = item.value;
      option.append(item.text);
      this.inputSelector.appendChild(option);
    });
  }

  setValue(option) {
    this.inputSelector.value = option;
  }

  setOnChange(callbackFn) {
    this.inputSelector.onchange = callbackFn;
  }
}

window.customElements.define('dropdown-el', Dropdown);
