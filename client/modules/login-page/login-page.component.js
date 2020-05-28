/* eslint-disable no-undef */
'use strict';

import { Component } from '../../components/component.js';
import { Card } from '../../components/card/card.component.js';
import { getAdminStatus, login, logout } from '../../auth.js';
import { routerInstance } from '../../app.js';
import { BottomSheet } from '../../components/bottom-sheet/bottom-sheet.component.js';
import { $ } from '../../utils.js';

export class LoginPage extends Component {
  constructor() {
    super({
      stylesheet: '/modules/login-page/login-page.component.css',
    });
    document.title = 'Login - Quiz Editor';
    this.initElement();
  }

  async initElement() {
    const loginCard = new Card({
      template: '/modules/login-page/login-card.html',
      stylesheet: '/modules/login-page/login-page.component.css',
    });
    loginCard.classList.add('hide');
    loginCard.classList.remove('hide');
    const notAdminSheet = new BottomSheet({ template: '/modules/login-page/not-admin-sheet.html', stylesheet: '/modules/login-page/login-page.component.css' });
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        getAdminStatus().then(auth => {
          if (auth) {
            loginCard.classList.add('hide');
            routerInstance.navigate('/quizeditor');
          } else {
            notAdminSheet.open();
            logout();
          }
        });
      } else {
        loginCard.classList.remove('hide');
      }
    });
    await this.loaded;
    await loginCard.loaded;
    loginCard.container.classList.add('loginCard');
    this.container.appendChild(loginCard);
    loginCard.id = 'loginCard';
    $(loginCard, '#loginBtn').addEventListener('click', () => login());
  }
}

window.customElements.define('login-page', LoginPage);
