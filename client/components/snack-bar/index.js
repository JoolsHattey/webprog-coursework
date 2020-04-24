'use strict';

import { Component } from "../component.js";
import { $ } from "../../app.js";

export class SnackBar extends Component {
    constructor() {
        super({
            template: '/components/snack-bar/index.html',
            styles: '/components/snack-bar/styles.css'
        });
        this.container.classList.add('hide');
    }
    addTitle(name) {
        this.templatePromise.then(() => {
            $(this, '#content').append(name);
        });
    }
    show() {
        this.container.classList.remove('hide');
        setTimeout(() => this.container.classList.add('hide'), 2000);
    }
}

customElements.define('snack-bar', SnackBar);