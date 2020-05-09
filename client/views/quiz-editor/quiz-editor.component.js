'use strict';

import { Component } from "../../components/component.js";
import { EditableQuestionnaire } from "../../components/editable-quiz/index.js";
import { $, routerInstance, $clear } from "../../app.js";
import { Card } from "../../components/card/card.component.js";
import { ModalCard } from "../../components/modal-card/modal-card.component.js";

export class QuizEditor extends Component {
    constructor(req) {
        super({
            template: '/views/quiz-editor/quiz-editor.component.html',
            stylesheet: '/views/quiz-editor/quiz-editor.component.css'
        });
        this.initElement(req);
    }

    async initElement(req) {
        if(!req.params.quizID) {
            this.getQuestionnaireList();
        } else {
            this.getQuestionnaire(req.params.quizID, req.params.mode);
        }
        await this.templatePromise
        this.appBar = $(this, 'app-bar');
        await this.appBar.templatePromise;
        $(this.appBar, '#editorHome').addEventListener('click', () => {
            $clear($(this, '#editor'));
            $clear($(this, '#quizsContainer'));
            history.pushState({}, "", `/quizeditor`)
            this.getQuestionnaireList()
        });

        const newQuizBtn = $(this, '#newQuizBtn');
        const newQuizModal = new ModalCard({
            template: '/views/quiz-editor/new-quiz-dialog.html'
        }, {}, '50%', '50%');
        await newQuizModal.templatePromise;
        $(newQuizModal, 'json-file-upload').addEventListener('upload', (e) => {
            newQuizModal.dialogData.file = e.detail;
        });
        newQuizBtn.onclick = () => {
            newQuizModal.open();
            newQuizModal.resultsObservable.subscribe(x => {
                if(x.file) {
                    this.createNewQuiz(x.file);
                } else {
                    console.log("yes")
                    this.createNewQuiz({
                        name: 'Untitled Quiz',
                        questions: []
                    })
                }
            });
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
        routerInstance.navigate(`/quizeditor/${quiz.id}`);
    }

    async getQuestionnaireList() {
        const response = await fetch("/api/questionnaires");
        const data = await response.json();
        const container = $(this, '#quizsContainer');
        data.forEach(element => {
            const quizItem = new Card();
            quizItem.createTitle(element.name);
            container.appendChild(quizItem);
            quizItem.addEventListener('click', () => {
                $clear($(this, '#quizsContainer'));
                history.pushState({}, "", `/quizeditor/${element.uid}`)
                this.getQuestionnaire(element.uid)
            });
        });
        container.classList.remove('hide');
        $(this, '#quizList').classList.remove('hide');
        $(this, '#editor').classList.add('hide');
        $(this, 'progress-spinner').classList.add('hide');
        this.appBar.closeExpanded();
    }

    async getQuestionnaire(uid) {
        const request = await fetch(`/api/questionnaire/${uid}`);
        const quesitonnaire = await(request.json());
        const req = await fetch(`/api/responses/${uid}`);
        const responses = await(req.json());
        const q = new EditableQuestionnaire(uid, quesitonnaire, responses, this.appBar);
        $(this, '#editor').appendChild(q);
        $(this, '#quizList').classList.add('hide');
        $(this, '#editor').classList.remove('hide');
    }
}

customElements.define('quiz-editor', QuizEditor)