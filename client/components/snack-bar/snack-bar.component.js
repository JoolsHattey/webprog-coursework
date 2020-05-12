'use strict';

import { Component } from "../component.js";
import { $ } from "../../app.js";

export class SnackBar extends Component {
    constructor() {
        super({
            template: '/components/snack-bar/snack-bar.component.html',
            stylesheet: '/components/snack-bar/snack-bar.component.css'
        });
        this.classList.add('hidden');
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
        this.style.transform = `translate3d(0, 0, 0)`
        if(timeout) {
        setTimeout(() => {
            this.style.transform = 'translate3d(0, 9%, 0)';
            setTimeout(() => document.body.removeChild(this), 1000)
        }, timeout);
        } else {
            this.style.transform = 'translate3d(0, 9%, 0)';
        }
    }
    hide() {
        this.style.transform = 'translate3d(0, 0, 0)';
        setTimeout(() => document.body.removeChild(this), 1000);
    }
}

customElements.define('snack-bar', SnackBar);