"use strict";

import { Component } from '/components/component.js';

export class RouterOutlet extends Component {
    constructor() {
        super();
    }
    routeComponent(component, req) {
        this.container.innerHTML = '';
        this.container.appendChild(new component(req));
    }
}

customElements.define('router-outlet', RouterOutlet);