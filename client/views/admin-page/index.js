"use strict";

import { Component } from '../../components/component.js';
import { Card } from '../../components/card/index.js';
import { routerInstance } from '../../app.js';
import { ModalCard } from '../../components/modal-card/index.js';

export class AdminPage extends Component {
    constructor() {
        super({
            template: '/views/admin-page/index.html'
        });
        this.initElement();
    }

    async initElement() {
        await this.templatePromise;
        this.container.classList.add("page");
        this.qContainer = this.shadowRoot.querySelector('#quizsContainer');
        this.getEditableQuestionnaires();
        const newQuizBtn = this.shadowRoot.querySelector('#newQuizBtn');
        newQuizBtn.onclick = () => {
            const newQuizModal = new ModalCard();
            newQuizModal.addTemplate('/views/admin-page/new-quiz-dialog.html');
            newQuizModal.open();
            newQuizModal.resultsObservable.subscribe({next: x => {
                routerInstance.navigate('/quiz');
            }});
        }
    }

    async getEditableQuestionnaires() {
        const response = await fetch("/api/questionnaires")
        const data = await response.json();
        data.forEach(item => {
            const q = new Card();
            q.createTitle(item.name);
            q.setOnClick(() => routerInstance.navigate(`/quiz/${item.uid}/edit`));
            this.qContainer.appendChild(q);
        });
    }
}

customElements.define('admin-screen', AdminPage);