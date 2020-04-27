"use strict";

import { Component } from '../component.js';
import { Card } from '../card/index.js';
import { routerInstance, $ } from '../../app.js';

export class AppBar extends Component {
    constructor() {
        super();
        this.initElement();
    }

    initElement() {
        this.addStyleSheet("/components/app-bar/styles.css");
        this.container.classList.add("appBar");
        this.addTemplate("/components/app-bar/index.html").then(() => {
            this.homeBtn = $(this, '#home');
            this.adminBtn = $(this, '#admin');
            this.profileBtn = $(this, '#profile');

            this.homeBtn.onclick = () => routerInstance.navigate('/home');
            this.adminBtn.onclick = () => routerInstance.navigate('/admin');
            this.createProfileCard();
        });
    }

    createProfileCard() {

        this.profileCard = new Card({
            template: '/components/app-bar/profile-card.html',
            styles: '/components/app-bar/styles.css'
        });
        this.profileCard.classList.add('profileCard')
        this.profileCard.templatePromise.then(() => {
            this.profileImg = $(this.profileCard, '#profileImg');
            this.profileName = $(this.profileCard, '#profileName');
            this.profileEmail = $(this.profileCard, '#profileEmail');
            this.profileType = $(this.profileCard, '#profileType');
        })
        this.profileCard.visible = false;
        this.profileBtn.onclick = () => this.profileCard.triggerVisible()
        

        this.container.appendChild(this.profileCard);

        // this.userProfile = document.createElement("div");
        // this.profileImage = document.createElement("img");
        // this.userProfile.appendChild(this.profileImage);
        // this.container.appendChild(this.userProfile);

        // this.profileCard = new Card();
        // this.profileCard.setVisible(false);
        // this.profileCard.container.classList.add("profileCard")

        // this.shadowRoot.appendChild(this.profileCard);
        // this.profileCardVisible = false;
        // this.userProfile.onclick = evt => {
        //     if(this.profileCardVisible) {
        //         this.profileCard.setVisible(false);
        //         this.profileCardVisible = false;
        //     } else {
        //         this.profileCard.setVisible(true);
        //         this.profileCardVisible = true;
        //     }
        // }
        // this.displayName = document.createElement("h4");
        // this.email = document.createElement("h5");
        // this.profileCard.createTitle(this.displayName);
        // this.profileCard.createContent(this.email);
        // this.logOutButton = document.createElement("button");
        // this.logOutButton.append("Sign Out");
        // this.logOutButton.onclick = evt => logout();
        // this.profileCard.appendChild(this.logOutButton);
    }
    /**
     * 
     * @param {firebase.User} newValue 
     */
    setUser(newValue) {
        this.profileName.append(newValue.displayName);
        this.profileEmail.append(newValue.email);
    }
    clearUser() {
        this.displayName.innerHTML="";
        this.email.innerHTML="";
        this.logOutButton.innerHTML="Sign In";
    }
}

customElements.define('app-bar', AppBar);