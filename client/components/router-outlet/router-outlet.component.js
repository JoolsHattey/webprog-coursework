'use strict';

import { ProgressSpinner } from '../progress-spinner/progress-spinner.component.js';
import { Component } from '../component.js';

export class RouterOutlet extends Component {
  constructor() {
    super({
      stylesheet: '/components/router-outlet/router-outlet.component.css',
    });
    this.container.append(new ProgressSpinner());
  }

  /**
   * Remove current component and append new one passing in the route params as arguments
   * @param {Component} Component
   * @param {*} req
   */
  routeComponent(Component, req) {
    const newComponent = new Component(req);
    this.container.children[0].remove();
    this.container.appendChild(newComponent);
  }
}

window.customElements.define('router-outlet', RouterOutlet);
