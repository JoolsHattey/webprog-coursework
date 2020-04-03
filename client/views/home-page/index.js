"use strict";

import { Component } from '../../components/component.js';
import { Card } from '../../components/card/index.js';
import { routerInstance } from '../../app.js';

export class HomePage extends Component {
    constructor() {
        super();
        this.initElement();
    }

    initElement() {
        this.container.classList.add("page");
        const btn = document.createElement("button");
        btn.classList.add("md-button");
        btn.append("See Questionnaires");
        this.container.appendChild(btn);
        btn.onclick = evt => this.getQuestionnaires();
    }

    clearScreen() {
        this.container.innerHTML=""
        console.log(this.container.children[1])
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
                    routerInstance.navigate(`/quiz/${item.uid}`)
                });

                quuizes.appendChild(q);
                this.container.appendChild(quuizes);
            });
        });
    }
}

customElements.define('home-screen', HomePage);