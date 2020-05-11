"use strict";

import { Component } from '../../components/component.js';
import { Quiz } from '../../components/quiz/quiz.component.js';
import { TextInput } from '../../components/text-input/text-input.component.js';
import { CardStack } from '../../components/card-stack/card-stack.component.js';

export class QuizPage extends Component {
    constructor(req) {
        super({
            stylesheet: '/views/quiz-page/styles.css'
        });
        this.elLoaded = this.initElement(req);
    }

    async initElement(req) {
        this.container.classList.add("page");
        const request = await fetch(`/api/questionnaire/${req.params.quizID}`);
        const quizData = await(request.json());
        const q = new Quiz(req.params.quizID, quizData);
        console.log(q.templatePromise)
        // await q.templatePromise;
        this.container.appendChild(q);
    }
}

customElements.define('quiz-screen', QuizPage);