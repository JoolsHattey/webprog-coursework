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
    addTitle(name) {
        this.templatePromise.then(() => {
            $(this, '#content').append(name);
        });
    }
    show() {
        document.body.appendChild(this)
        // this.style.transform = `translate3d(0, 0, 0)`
        // setTimeout(() => {
        //     this.style.transform = '';
        //     setTimeout(() => document.body.removeChild(this), 1000)
        // }, 2000);
    }
}

customElements.define('snack-bar', SnackBar);