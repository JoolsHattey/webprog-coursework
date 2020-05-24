/* eslint-disable no-undef */
'use strict';

import { Component } from '../component.js';
import { Card } from '../card/card.component.js';
import { routerInstance, $ } from '../../app.js';
import { initLogin, logout } from '../../auth.js';

export class AppBar extends Component {
  constructor() {
    super({
      template: '/components/app-bar/app-bar.component.html',
      stylesheet: '/components/app-bar/app-bar.component.css',
    });
    this.initElement();
  }

  async initElement() {
    await this.templatePromise;
    this.container.classList.add('appBar');
    this.homeBtn = $(this, '#home');
    this.profileBtn = $(this, '#profile');
    this.createProfileCard();
  }

  async createProfileCard() {
    const profileCard = new Card({
      template: '/components/app-bar/profile-card.html',
      stylesheet: '/components/app-bar/app-bar.component.css',
    });
    profileCard.classList.add('profileCard');
    await profileCard.templatePromise;
    this.profileImg = $(profileCard, '#profileImg');
    this.profileName = $(profileCard, '#profileName');
    this.profileEmail = $(profileCard, '#profileEmail');
    this.loggedInContent = $(profileCard, '#loggedIn');
    this.loggedOutContent = $(profileCard, '#loggedOut');
    $(profileCard, '#loginBtn').onclick = () => {
      profileCard.triggerVisible();
      initLogin();
    };
    $(profileCard, '#logoutBtn').onclick = () => {
      profileCard.triggerVisible();
      logout();
      routerInstance.navigate('/login');
    };
    profileCard.visible = false;
    this.profileBtn.onclick = () => profileCard.triggerVisible();
    this.container.appendChild(profileCard);

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setUser(user);
      } else {
        this.clearUser();
      }
    });
  }

  expand() {
    this.style.height = '162px';
    $(this, '#expandedContent').classList.add('expanded');
    $(this, '#quizEditorButtons').classList.remove('hide');
  }

  closeExpanded() {
    this.style.height = '56px';
    $(this, '#expandedContent').classList.remove('expanded');
    $(this, '#quizEditorButtons').classList.add('hide');
  }

  /**
   *
   * @param {firebase.User} newValue
   */
  setUser(newValue) {
    this.loggedInContent.classList.remove('hide');
    this.loggedOutContent.classList.add('hide');
    this.profileName.append(newValue.displayName);
    this.profileEmail.append(newValue.email);
    this.profileImg.src = newValue.photoURL;
  }

  clearUser() {
    this.loggedInContent.classList.add('hide');
    this.loggedOutContent.classList.remove('hide');
    this.profileName.innerHTML = '';
    this.profileEmail.innerHTML = '';
  }
}

window.customElements.define('app-bar', AppBar);
