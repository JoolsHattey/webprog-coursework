"use strict";

import { Component } from '../../components/component.js';
import { Quiz } from '../../components/quiz/quiz.component.js';
import { TextInput } from '../../components/text-input/text-input.component.js';

export class QuizPage extends Component {
    constructor(req) {
        super({
            stylesheet: '/views/quiz-page/styles.css'
        });
        this.container.classList.add("page");
        if(!req.params.quizID) {
            this.createQuestionnaire();
        } else {
            this.getQuestionnaire(req.params.quizID, req.params.mode);
        }
    }

    async getQuestionnaire(quizID, editMode) {
        const request = await fetch(`/api/questionnaire/${quizID}`);
        const quizData = await(request.json());
        const q = new Quiz(quizID, quizData);
        this.container.appendChild(q);
    }
}

customElements.define('quiz-screen', QuizPage);