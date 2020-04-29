'use strict';

import { Component } from "../component.js";
import { $ } from "../../app.js";

export class Icon extends Component {
    constructor() {
        super({
            template: '/components/icon/icon.component.html',
            styles: '/components/icon/icon.component.css'
        });
        this.initElement();
        if(!this.hasAttribute('colour')) this.setAttribute('colour', 'light');
    }

    async initElement() {
        await this.templatePromise;
        this.iconImg = $(this, 'img');

        console.log(this.innerHTML);
        this.iconImg.src = `/assets/${this.innerHTML}_icon_${this.getAttribute('colour')}.png`;
    }
}

customElements.define('icon-el', Icon);