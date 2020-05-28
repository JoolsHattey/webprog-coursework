'use strict';

import { Component } from '../component.js';
import { Checkbox } from './checkbox.component.js';
import { $r } from '../../utils.js';

export class CheckboxGroup extends Component {
  constructor(options) {
    super({ stylesheet: '/components/checkbox/checkbox.component.css' });
    this.initElement(options);
  }

  async initElement(options) {
    this.checkboxes = [];
    options.forEach(opt => {
      const option = new Checkbox();
      option.textLabel = opt;
      option.setOnChange(() => {
        const validInput = this.checkboxes.every(checkbox => checkbox.getValue() === undefined);
        const event = new CustomEvent('validinput', {
          detail: {
            valid: !validInput,
          },
        });
        this.dispatchEvent(event);
        this.warn(false);
      });
      this.checkboxes.push(option);
      this.container.append(option);
    });
    this.warnEl = await $r('div', '/components/checkbox/input-warn.html');
    this.warnEl.classList.add('hide');
    this.container.append(this.warnEl);
  }

  getValue() {
    const answerArray = [];
    this.checkboxes.forEach(checkbox => {
      const result = checkbox.getValue();
      if (result) {
        answerArray.push(result);
      }
    });
    if (answerArray.length > 0) {
      return answerArray;
    } else if (this.required) {
      this.warn(true);
      return null;
    } else {
      return null;
    }
  }

  setLabel(newValue) {
    this.container.children[0].before(newValue);
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
}

customElements.define('checkbox-group', CheckboxGroup);
