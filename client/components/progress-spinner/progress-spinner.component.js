'use strict';

import { Component } from "../component.js";

export class ProgressSpinner extends Component {
    constructor() {
        super({
            styles: '/components/progress-spinner/progress-spinner.component.css',
            template: '/components/progress-spinner/progress-spinner.component.html'
        });
    }
}

customElements.define('progress-spinner', ProgressSpinner);