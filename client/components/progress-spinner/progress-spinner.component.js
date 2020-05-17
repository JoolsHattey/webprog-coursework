'use strict';

import { Component } from "../component.js";

export class ProgressSpinner extends Component {
    constructor() {
        super({
            stylesheet: '/components/progress-spinner/progress-spinner.component.css',
            template: '/components/progress-spinner/progress-spinner.component.html'
        });
    }
}

window.customElements.define('progress-spinner', ProgressSpinner);