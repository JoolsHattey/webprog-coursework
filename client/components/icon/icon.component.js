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
    }

    async initElement() {
        await this.templatePromise;
        this.iconImg = $(this, 'img');

        console.log(this.innerHTML);
        switch (this.innerHTML) {
            case 'home':
                this.iconImg.src = '/assets/home_icon.png'
                break;
            case 'account':
                this.iconImg.src = '/assets/account_icon_light.png'
                break;
            case 'settings':
                this.iconImg.src = '/assets/settings-icon-dark.png'
                break;
            case 'delete':
                this.iconImg.src = '/assets/delete_icon_dark.png'
                break;
            default:
                break;
        }
    }
}

customElements.define('icon-el', Icon);