"use strict";

import { Component } from '../../components/component.js';
import { Card } from '../../components/card/index.js';
import { routerInstance } from '../../app.js';

export class AdminPage extends Component {
    constructor() {
        super({
            template: '/views/admin-page/index.html'
        });
        this.container.classList.add("page");
        this.templatePromise.then(() => {
            this.qContainer = this.shadowRoot.querySelector('#quizsContainer');
            this.getEditableQuestionnaires();
            const newQuizBtn = this.shadowRoot.querySelector('#newQuizBtn');
            newQuizBtn.onclick = () => routerInstance.navigate('/quiz');
        })
        // this.createUploadButton();
    }

    async getEditableQuestionnaires() {
        const response = await fetch("/api/questionnaires")

        // const quizes = document.createElement("div");

        response.json().then(data => {
            data.forEach(item => {
                const q = new Card();
                q.createTitle(item.name);
                q.setOnClick(evt => routerInstance.navigate(`/quiz/${item.uid}/edit`));
                this.qContainer.appendChild(q);
            });
        });
        // this.container.appendChild(quizes);
    }
}

customElements.define('admin-screen', AdminPage);