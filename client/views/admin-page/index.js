"use strict";

import { Component } from '../../components/component.js';
import { Card } from '../../components/card/card.component.js';
import { routerInstance, $ } from '../../app.js';
import { ModalCard } from '../../components/modal-card/modal-card.component.js';

export class AdminPage extends Component {
    constructor() {
        super({
            template: '/views/admin-page/index.html',
            stylesheet: '/views/admin-page/styles.css'
        });
        this.initElement();
    }

    async initElement() {
        await this.templatePromise;
        this.container.classList.add("page");
        this.qContainer = this.shadowRoot.querySelector('#quizsContainer');
        this.getEditableQuestionnaires();
        const newQuizBtn = this.shadowRoot.querySelector('#newQuizBtn');
        const newQuizModal = new ModalCard({
            template: '/views/admin-page/new-quiz-dialog.html'
        }, {});
        this.container.appendChild(newQuizModal)
        await newQuizModal.templatePromise;
        $(newQuizModal, 'json-file-upload').addEventListener('upload', (e) => {
            newQuizModal.dialogData.file = e.detail;
        });
        newQuizBtn.onclick = () => {
            newQuizModal.open();
            newQuizModal.resultsObservable.subscribe({next: x => {
                if(x.file) {
                    this.createNewQuiz(x.file);
                } else {
                    console.log("yes")
                    this.createNewQuiz({
                        name: 'Untitled Quiz',
                        questions: []
                    })
                }
            }});
        }
    }

    async createNewQuiz(quizData) {
        const res = await fetch('/api/createquestionnaire', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quizData),
        });
        const quiz = await res.json();
        console.log(quiz.id)
        routerInstance.navigate(`/quiz/${quiz.id}/edit`);

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
        this.qContainer.classList.remove('hide');
        $(this, 'progress-spinner').classList.add('hide');
    }
}

customElements.define('admin-screen', AdminPage);