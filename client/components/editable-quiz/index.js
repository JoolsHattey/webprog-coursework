"use strict";

import { Component } from '../component.js';
import { Card } from '../card/index.js';
import { Input } from '../input/index.js';
import { Dropdown } from '../dropdown/index.js';

export class EditableQuestionnaire extends Component {
    constructor(questionnaireData, uid) {
        super({
            template: '/components/editable-quiz/index.html',
            styles: '/components/editable-quiz/styles.css'
        });
        this.templatePromise.then(() => {
            this.initElement(questionnaireData, uid);
        });
    }

    initElement(questionnaireData, uid) {

        if(questionnaireData) {
            this.uid = uid;
            this.questions = questionnaireData;
        } else {
            this.questions = {
                "name": "",
                "questions": []
            };
        }
        this.questionsContainer = this.shadowRoot.querySelector("#questionsContainer");

    
        this.createTitle();
        this.createButtons(questionnaireData);

        this.elements = new Array;
        if(questionnaireData) {
            this.changeTitle(questionnaireData.name);
            questionnaireData.questions.forEach(q => {
                this.createNewQuestion(q);
            });
        }
    }

    createTitle() {
        this.shadowRoot.querySelector("#saveBtn")
            .onclick = () => this.questions.name = title.value;
    }

    createButtons(questionnaireData) {
        this.container.querySelector("#newQ")
            .onclick = () => this.createNewQuestion();

        const saveButton = document.createElement("button");
        saveButton.onclick = (evt => {

            this.questions.questions = [];

            this.elements.forEach(x => {
                this.questions.questions.push(x.question);
            });
            console.log(this.questions);

            if(questionnaireData) {
                updateQuestionnaire(this.uid, this.questions);
            } else {
                sendQuestionnaire(this.questions).then(data => {
                    this.uid = data.id;
                    console.log(this.uid);
                });    
            } 
        });

        saveButton.append("Save");
        this.questionsContainer.appendChild(saveButton);
    }

    // createResponses

    createNewQuestion(questionData) {

        const q = new Card();

        q.addTemplate('/components/editable-quiz/quiz-item.html').then(() => {
            const i = q.shadowRoot.querySelector('input-elmnt')
            
            if(questionData) {
                q.id = questionData.id;
                i.setInput(questionData.text);
            }

            const options = [
                {"value": "text",
                "text": "Text Input"},
                {"value": "number",
                "text": "Number Input"},
                {"value": "single-select",
                "text": "Single-select Input"},
                {"value": "multi-select",
                "text": "Multi-select Input"}
            ]
            const drop = q.shadowRoot.querySelector('dropdown-el');
            drop.setOptions(options);

            const deleteBtn = this.shadowRoot.querySelector('#deleteBtn');

            this.questionsContainer.appendChild(q);
        });
    }

    changeTitle(title) {
        this.shadowRoot.querySelector('input-elmnt').setInput(title);
    }
}

customElements.define('editable-quiz', EditableQuestionnaire);