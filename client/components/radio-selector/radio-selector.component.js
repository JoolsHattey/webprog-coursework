'use strict';

import { Component } from '../component.js';
import { $, $r } from '../../app.js';

export class RadioGroup extends Component {
  constructor(options) {
    super({
      stylesheet: '/components/radio-selector/radio-selector.component.css',
    });
    this.elLoaded = this.initElement(options);
  }

  async initElement(options) {
    this.radioButtons = [];
    for (const [i, v] of options.entries()) {
      const el = await $r('div', '/components/radio-selector/radio-selector.component.html');
      const input = $(el, 'input');
      this.radioButtons.push(input);
      input.setAttribute('name', 'test');
      input.id = i;
      input.value = v;
      const label = $(el, 'label');
      label.setAttribute('for', i);
      $(el, 'label').append(v);
      el.addEventListener('click', (e) => {
        const event = new CustomEvent('validinput', {
          detail: {
            valid: !(e.target.value === ''),
          },
        });
        this.validInput = !(e.target.value === '');
        this.dispatchEvent(event);
        this.warn(false);
      });
      this.container.append(el);
    }
    this.warnEl = await $r('div', '/components/radio-selector/input-warn.html');
    this.warnEl.classList.add('hide');
    this.container.append(this.warnEl);
    // $(this, 'input[name="test"]:checked').addEventListener('click', () => console.log('chagne'))
  }

  warn(value) {
    if (!this.warnVisible && !value) {
    } else if (this.warnVisible && !value) {
      this.warnEl.classList.add('hide');
      this.warnVisible = false;
    } else {
      this.warnEl.classList.remove('hide');
      this.warnVisible = true;
    }
  }

  getValue() {
    const inputEl = $(this, 'input[name="test"]:checked');
    let inputValue;
    if (inputEl) inputValue = inputEl.value;
    console.log(inputValue);
    if (inputValue && !this.required) {
      return inputValue;
    } else {
      this.warn(true);
      return inputValue;
    }
  }

  setValue() {

  }

  async setLabel(newValue) {
    await this.elLoaded;
    this.container.children[0].before(newValue);
  }

  get required() {
    return this.getAttribute('required');
  }

  set required(newValue) {
    this.setAttribute('required', newValue);
  }
}

window.customElements.define('radio-button', RadioGroup);
