"use strict";

import { Component } from '../../components/component.js';
import { Questionnaire } from '../../components/quiz/index.js';
import { EditableQuestionnaire } from '../../components/editable-quiz/index.js';

export class QuizPage extends Component {
    constructor(req) {
        super();
        this.container.classList.add("page");
        // this.addTemplate('/views/quiz-page/index.html').then(() => {
            
        // });
        if(!req.params.quizID) {
            this.createQuestionnaire();
        } else {
            this.getQuestionnaire(req.params.quizID, req.params.mode);
        }
        
    }

    async getQuestionnaire(uid, editMode) {

        const request = await fetch(`/api/questionnaire/${uid}`);
        const quesitonnaire = await(request.json());

        let q;
        if(editMode === "edit") {
            q = new EditableQuestionnaire(quesitonnaire, uid);
        } else {
            q = new Questionnaire(quesitonnaire, uid);
        }
        this.container.appendChild(q);
    }

    async createQuestionnaire() {

        const request = await fetch('/api/createquestionnaire', {
            method: 'POST'
        });
        const questionnaire = await(request.json());

        console.log(questionnaire)

        const q = new EditableQuestionnaire({ name: "", questions: [] }, questionnaire.id);

        this.container.appendChild(q);
    }
}

customElements.define('quiz-screen', QuizPage);