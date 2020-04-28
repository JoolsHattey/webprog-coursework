"use strict";

import { Component } from '../component.js';
import { Card } from '../card/index.js';
import { Input } from '../input/index.js';
import { Dropdown } from '../dropdown/index.js';
import { $ } from '../../app.js';
import { ModalCard } from '../modal-card/index.js';

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
            this.quiz = questionnaireData;
        } else {
            this.quiz = {
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
            .onclick = () => this.quiz.name = title.value;
    }

    createButtons(questionnaireData) {
        this.container.querySelector("#newQ")
            .onclick = () => this.createNewQuestion();

        const saveButton = document.createElement("button");
        saveButton.onclick = (evt => {

            this.quiz.questions = [];

            this.elements.forEach(x => {
                this.quiz.questions.push(x.question);
            });
            console.log(this.quiz);

            if(questionnaireData) {
                updateQuestionnaire(this.uid, this.quiz);
            } else {
                sendQuestionnaire(this.quiz).then(data => {
                    this.uid = data.id;
                    console.log(this.uid);
                });    
            } 
        });

        saveButton.append("Save");
        this.questionsContainer.appendChild(saveButton);
        const modalOptions = this.quiz.options;
        const modal = new ModalCard({
            template: '/components/editable-quiz/quiz-config-dialog.html',
            styles: '/components/editable-quiz/styles.css'
        }, modalOptions);
        this.container.appendChild(modal);
        $(this, '#settingsBtn').onclick = () => {

            modal.open();
            modal.templatePromise.then(() => {

                modal.resultsObservable.subscribe({next: data => {
                    console.log(data);
                    if(data !== undefined) {
                        console.log("set data")
                        this.quiz.options = data
                    }
                    console.log(this.quiz);
                }});
            });
            
        }
    }

    testFunction() {console.log("test")}

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