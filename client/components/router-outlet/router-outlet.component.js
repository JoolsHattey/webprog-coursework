"use strict";

import { ProgressSpinner } from '../progress-spinner/progress-spinner.component.js';
import { Component } from '../component.js';

export class RouterOutlet extends Component {
    constructor() {
        super({
            stylesheet: '/components/router-outlet/router-outlet.component.css'
        });
        this.container.append(new ProgressSpinner());
        console.log(location)
    }
    /**
     * Remove current component and append new one passing in the route params as arguments
     * @param {Component} component 
     * @param {*} req 
     */
    async routeComponent(component, req) {
        const newComponent = new component(req);
        await newComponent.templatePromise;
        this.container.children[0].remove();
        this.container.appendChild(newComponent);
    }
}

customElements.define('router-outlet', RouterOutlet);