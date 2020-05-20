'use strict';

import { Component } from "../../components/component.js";
import { Card } from "../../components/card/card.component.js";
import { getAdminStatus, login } from "../../auth.js";
import { $, routerInstance } from "../../app.js";

export class LoginPage extends Component {
  constructor() {
  super({
    stylesheet: '/views/login-page/login-page.component.css'
  });
  document.title = 'Login - Quiz Editor';
  this.initElement();
  }
  async initElement() {
  const loginCard = new Card({
    template: '/views/login-page/login-card.html',
    stylesheet: '/views/login-page/login-page.component.css'
  });
  loginCard.classList.add('hide')
  firebase.auth().onAuthStateChanged(user => {
    if(user) {
    getAdminStatus().then(auth => {
      if(auth) {
      loginCard.classList.add('hide');
      routerInstance.navigate('/quizeditor');
      } else {
      loginCard.classList.remove('hide');
      }
    })
    } else {
    loginCard.classList.remove('hide');
    }
  });
  await this.templatePromise;
  
  await loginCard.templatePromise;
  loginCard.container.classList.add('loginCard');
  this.container.appendChild(loginCard);
  loginCard.id = 'loginCard';
  $(loginCard, '#loginBtn').addEventListener('click', () => login())
  }
}

customElements.define('login-page', LoginPage);