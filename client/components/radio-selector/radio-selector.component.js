'use strict';

import { Component } from "../component.js";
import { $, $r } from "../../app.js";

export class RadioGroup extends Component {
    constructor(options) {
        super({
            stylesheet: '/components/radio-selector/radio-selector.component.css'
        })
        this.initElement(options);
    }
    async initElement(options) {
        this.radioButtons = new Array;
        for(const [i, v] of options.entries()) {
            const el = await $r('div', '/components/radio-selector/radio-selector.component.html');
            const input = $(el, 'input');
            this.radioButtons.push(input);
            input.setAttribute("name", "test");
            input.id = i
            input.value = v;
            const label = $(el, 'label');
            label.setAttribute('for', i);
            $(el, 'label').append(v)
            this.container.appendChild(el)
        }
        
    }
    getValue() {
        return $(this, 'input[name="test"]:checked')?.value;
    }
    setValue() {

    }

}

customElements.define('radio-button', RadioGroup);