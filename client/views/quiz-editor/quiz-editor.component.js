'use strict';

import { Component } from "../../components/component.js";
import { EditableQuestionnaire } from "../../components/editable-quiz/index.js";
import { $, routerInstance, $clear } from "../../app.js";
import { Card } from "../../components/card/card.component.js";

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
            history.pushState({}, "", `/quizeditor`)
            this.getQuestionnaireList()
        });
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