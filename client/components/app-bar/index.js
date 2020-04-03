"use strict";

import { Component } from '../component.js';
import { Card } from '../card/index.js';
import { routerInstance } from '../../app.js';

export class AppBar extends Component {
    constructor() {
        super();
        this.initElement();
    }

    initElement() {
        this.addStyleSheet("/components/app-bar/styles.css");
        this.container.classList.add("appBar");
        this.addHTMLFile("/components/app-bar/index.html").then(() => {
            this.homeBtn = this.shadowRoot.querySelector('#home');
            this.adminBtn = this.shadowRoot.querySelector('#admin');
            this.homeBtn.onclick = () => routerInstance.navigate('/home');
            this.adminBtn.onclick = () => routerInstance.navigate('/admin');
        });
    }

    createProfileCard() {
        this.userProfile = document.createElement("div");
        this.profileImage = document.createElement("img");
        this.userProfile.appendChild(this.profileImage);
        this.container.appendChild(this.userProfile);

        this.profileCard = new Card();
        this.profileCard.setVisible(false);
        this.profileCard.container.classList.add("profileCard")

        this.shadowRoot.appendChild(this.profileCard);
        this.profileCardVisible = false;
        this.userProfile.onclick = evt => {
            if(this.profileCardVisible) {
                this.profileCard.setVisible(false);
                this.profileCardVisible = false;
            } else {
                this.profileCard.setVisible(true);
                this.profileCardVisible = true;
            }
        }
        this.displayName = document.createElement("h4");
        this.email = document.createElement("h5");
        this.profileCard.createTitle(this.displayName);
        this.profileCard.createContent(this.email);
        this.logOutButton = document.createElement("button");
        this.logOutButton.append("Sign Out");
        this.logOutButton.onclick = evt => logout();
        this.profileCard.appendChild(this.logOutButton);
    }
    setUser(newValue) {
        this.displayName.append(newValue.displayName);
        this.email.append(newValue.email);
    }
    clearUser() {
        this.displayName.innerHTML="";
        this.email.innerHTML="";
        this.logOutButton.innerHTML="Sign In";
    }
}

customElements.define('app-bar', AppBar);