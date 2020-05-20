'use strict';

import { Component } from "../component.js";
import { Checkbox } from "./checkbox.component.js";

export class CheckboxGroup extends Component {
  constructor(options) {
    super();
    this.initElement(options);
  }
  initElement(options) {
    console.log(options)
    this.checkboxes = new Array;
    options.forEach(opt => {
      const option = new Checkbox();
      option.textLabel = opt;
      option.addEventListener('click', (e) => {
        const event = new CustomEvent('validinput', {
          detail: {
            valid: !(e.target.value === '')
          }
        });
        this.dispatchEvent(event);
        // this.warn(false);
      })
      this.checkboxes.push(option);
      this.container.append(option);
    });
  }
  getValue() {
    const answerArray = new Array;
    this.checkboxes.forEach(checkbox => {
      const result = checkbox.getValue();
      if(result) {
        answerArray.push(result);
      }
    });
    if(answerArray.length > 0) {
      return answerArray;
    }
    return;
  }
}

customElements.define('checkbox-group', CheckboxGroup);