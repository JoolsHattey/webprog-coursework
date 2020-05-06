"use strict";

import { Component } from '/components/component.js';
import { ProgressSpinner } from '../progress-spinner/progress-spinner.component.js';

export class RouterOutlet extends Component {
    constructor() {
        super({
            stylesheet: '/components/router-outlet/router-outlet.component.css'
        });
        this.container.append(new ProgressSpinner());
    }
    async routeComponent(component, req) {
        const newComponent = new component(req);
        await newComponent.templatePromise;
        this.container.innerHTML = '';
        this.container.appendChild(newComponent);
    }
}

customElements.define('router-outlet', RouterOutlet);