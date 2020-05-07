'use strict';

import { Component } from "../../components/component.js";

export class LoginPage extends Component {
    constructor() {
        super({
            template: '/views/login-page/login-page.component.html',
            stylesheet: '/views/login-page/login-page.component.css'
        });
    }
}

customElements.define('login-page', LoginPage);