'use strict';

import { Component } from '../component.js';
import { $ } from '../../app.js';

export class TextInput extends Component {
  constructor() {
    super({
      template: '/components/text-input/text-input.component.html',
      stylesheet: '/components/text-input/text-input.component.css',
    });
    this.initElement();
  }

  initElement() {
    if (this.hasAttribute('size')) {
      this.sizeNotInit = this.setSize(this.getAttribute('size'));
    }
    if (this.hasAttribute('fontsize')) {
      this.setFontSize(this.getAttribute('fontsize'));
    }
    // if (this.hasAttribute('inputtype')) {
    //   this.setInputType(this.getAttribute('inputtype'));
    // }
  }

  static get observedAttributes() { return ['size', 'underline', 'fontsize', 'inputtype', 'inputstyle']; }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'size') {
      this.setSize(newValue);
    }
    if (name === 'underline') {
      this.setUnderline(newValue);
    }
    if (name === 'fontsize') {
      this.setFontSize(newValue);
    }
    if (name === 'inputtype') {
      this.setInputType(newValue);
    }
    if (name === 'inputstyle') {
      this.setInputStyle(newValue);
    }
  }

  async setUnderline(newValue) {
    await this.templatePromise;
    if (newValue === 'true') {
      this.inputEl.classList.remove('noUnderline');
    } else {
      this.inputEl.classList.add('noUnderline');
    }
  }

  async setFontSize(value) {
    await this.templatePromise;
    if (value === 'large') {
      this.inputEl.classList.add('largeText');
      this.inputEl.classList.remove('smallText');
    } else {
      this.inputEl.classList.add('smallText');
      this.inputEl.classList.remove('largeText');
    }
  }

  async setSize(value) {
    await this.templatePromise;
    const el = $(this, '#input');
    if (value === 'singleline') {
      this.inputEl = document.createElement('input');
      this.container.classList.remove('multiLine');
      this.container.classList.add('singleLine');
    } else if (value === 'multiline') {
      this.inputEl = document.createElement('textarea');
      this.inputEl.rows = 1;
      this.container.classList.remove('singleLine');
      this.container.classList.add('multiLine');
      this.inputEl.addEventListener('input', () => this.resize(), false);
    }
    if (this.required) {
      this.inputEl.addEventListener('keyup', (e) => {
        console.log(e.target.value);
        const event = new CustomEvent('validinput', {
          detail: {
            valid: !(e.target.value === ''),
          },
        });
        this.validInput = !(e.target.value === '');
        this.dispatchEvent(event);
        this.warn(false);
      });
    }
    this.inputEl.id = 'input';
    this.container.children[0].replaceChild(this.inputEl, el);
  }

  async setInputType(newValue) {
    await this.templatePromise;
    await this.sizeNotInit;
    console.log(this.inputEl);
    this.inputEl.type = newValue;
  }

  async setInputStyle(newValue) {
    await this.templatePromise;
    await this.sizeNotInit;
    if (newValue === 'filled') {
      this.inputEl.classList.add('filledTextInput');
    }
  }

  warn(value) {
    if (!this.warnVisible && !value) {

    } else if (this.warnVisible && !value) {
      $(this, '.bar').classList.remove('warn');
      $(this, '#requiredAlert').style = 'display: none;';
      this.inputEl.classList.remove('warnInput');
      this.warnVisible = false;
    } else {
      $(this, '.bar').classList.add('warn');
      $(this, '#requiredAlert').style = '';
      this.inputEl.classList.add('warnInput');
      this.inputEl.focus();
      this.warnVisible = true;
    }
  }

  getValue() {
    const inputValue = this.inputEl.value;
    if (inputValue === '' && this.required === 'true') {
      this.warn(true);
    }
    if (inputValue === '') return;
    return inputValue;
  }

  async setValue(newValue) {
    await this.templatePromise;
    await this.sizeNotInit;
    this.inputEl.value = newValue;
    if (this.size === 'multiline') {
      const intervalID = window.setInterval(() => {
        if (this.inputEl.scrollHeight > 0) {
          this.resize();
          window.clearInterval(intervalID);
        }
      }, 10);
    }
  }

  resize() {
    this.inputEl.setAttribute('style', 'height: auto;');
    this.inputEl.setAttribute('style', `height: ${this.inputEl.scrollHeight + 1}px;`);
  }

  async setOnChange(callback) {
    await this.sizeNotInit;
    this.inputEl.addEventListener('change', callback);
  }

  async setLabel(newValue) {
    await this.templatePromise;
    this.container.children[0].children[0].before(newValue);
  }

  get required() {
    return this.getAttribute('required');
  }

  set required(newValue) {
    this.setAttribute('required', newValue);
  }

  get size() {
    return this.getAttribute('size');
  }

  set size(newValue) {
    this.setAttribute('size', newValue);
  }

  get underline() {
    return this.getAttribute('underline');
  }

  set underline(newValue) {
    this.setAttribute('underline', newValue);
  }

  get inputType() {
    return this.getAttribute('inputtype');
  }

  set inputType(newValue) {
    this.setAttribute('inputtype', newValue);
  }
}

window.customElements.define('text-input', TextInput);
