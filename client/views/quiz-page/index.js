"use strict";

import { Component } from '../../components/component.js';
import { Questionnaire } from '../../components/quiz/index.js';
import { EditableQuestionnaire } from '../../components/editable-quiz/index.js';

export class QuizPage extends Component {
    constructor(req) {
        super();
        this.container.classList.add("page");
        this.addTemplate('/views/home-page/index.html').then(() => {
            const btn = this.shadowRoot.querySelector('#showQuizBtn');
            btn.onclick = () => this.getQuestionnaires();
        });
        this.getQuestionnaire(req.params[0], req.params[1]);
    }

    async getQuestionnaire(uid, editMode) {

        const request = await fetch(`/api/questionnaire/${uid}`);
        const quesitonnaire = await(request.json());

        let q;
        if(editMode === "edit") {
            console.log("edit")
            q = new EditableQuestionnaire(quesitonnaire, uid);
        } else {
            console.log("view")
            q = new Questionnaire(quesitonnaire, uid);
        }
        this.container.appendChild(q);
    }
}

customElements.define('quiz-screen', QuizPage);