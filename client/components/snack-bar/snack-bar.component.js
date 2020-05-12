'use strict';

import { Component } from "../component.js";
import { $ } from "../../app.js";

export class SnackBar extends Component {
    constructor() {
        super({
            template: '/components/snack-bar/snack-bar.component.html',
            stylesheet: '/components/snack-bar/snack-bar.component.css'
        });
    }
    async addTitle(name) {
        await this.templatePromise;
        $(this, '#content').append(name);
    }
    async show(timeout) {
        await this.templatePromise;
        document.body.appendChild(this)
        if(this.getAttribute('loading') === 'true') {
            $(this, 'progress-spinner').classList.remove('hide');
        }
        this.style.transform = 'scale3d(1, 1, 1)';
        if(timeout) {
        setTimeout(() => {
            this.style.transform = 'scale3d(0, 0, 0)';
            setTimeout(() => document.body.removeChild(this), 100)
        }, timeout);
        }
    }
    hide() {
        this.style.transform = 'scale3d(0, 0, 0)';
        setTimeout(() => document.body.removeChild(this), 100)
    }
}

customElements.define('snack-bar', SnackBar);