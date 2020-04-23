"use strict";

import { Component } from '../../components/component.js';
import { Card } from '../../components/card/index.js';
import { routerInstance } from '../../app.js';

export class HomePage extends Component {
    constructor() {
        super({
            template: '/views/home-page/index.html'
        });
        this.container.classList.add("page");
        this.templatePromise.then(() => {
            const btn = this.shadowRoot.querySelector('#showQuizBtn');
            btn.onclick = () => this.getQuestionnaires();
        });
    }

    async getQuestionnaires() {
        const response = await fetch("/api/questionnaires")
    
        response.json().then(data => {

            console.log(data);
            
            const quuizes = document.createElement("div");

            data.forEach(item => {
                const q = new Card();
                q.createTitle(item.name);
                q.setOnClick(evt => {
                    console.log(item.uid)
                    routerInstance.navigate(`/quiz/${item.uid}/view`)
                });

                quuizes.appendChild(q);
                this.container.appendChild(quuizes);
            });
        });
    }
}

customElements.define('home-screen', HomePage);