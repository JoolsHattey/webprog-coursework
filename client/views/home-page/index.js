"use strict";

import { Component } from '../../components/component.js';
import { Card } from '../../components/card/card.component.js';
import { routerInstance, $ } from '../../app.js';
import { Checkbox } from '../../components/checkbox/checkbox.component.js';

export class HomePage extends Component {
    constructor() {
        super({
            template: '/views/home-page/index.html'
        });
        this.initElement();
    }

    async initElement() {
        this.container.classList.add("page");
        await this.templatePromise;
        const btn = this.shadowRoot.querySelector('#showQuizBtn');
        btn.onclick = () => this.getQuestionnaires();
        $(this, 'toggle-el').setOnChange((e) => console.log(e.target.checked))
    }

    async getQuestionnaires() {
        const response = await fetch("/api/questionnaires")

        const data = await response.json();

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
    }
}

customElements.define('home-screen', HomePage);