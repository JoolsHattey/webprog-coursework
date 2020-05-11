'use strict';

import { Component } from "../../components/component.js";
import { Card } from "../../components/card/card.component.js";
import { initUI, getAdminStatus } from "../../auth.js";
import { $, routerInstance } from "../../app.js";

export class LoginPage extends Component {
    constructor() {
        super({
            stylesheet: '/views/login-page/login-page.component.css'
        });
        this.initElement();
    }
    async initElement() {
        const loginCard = new Card({
            template: '/views/login-page/login-card.html',
            stylesheet: '/views/login-page/login-page.component.css'
        });
        loginCard.classList.add('hide')
        getAdminStatus().then(auth => {
            if(auth) {
                loginCard.classList.add('hide');
                routerInstance.navigate('/quizeditor');
            } else {
                loginCard.classList.remove('hide');
            }
        })

        await this.templatePromise;
        
        await loginCard.templatePromise;
        loginCard.container.classList.add('loginCard');
        this.container.appendChild(loginCard);
        loginCard.id = 'loginCard';
        loginCard.addStyleSheet("https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.css")
        initUI($(loginCard, '#loginBtns'));
    }
}

customElements.define('login-page', LoginPage);