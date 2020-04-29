"use strict";

import { Component } from '../component.js';
import { Card } from '../card/card.component.js';
import { Input } from '../input/index.js';
import { Dropdown } from '../dropdown/dropdown.component.js';
import { $, $r } from '../../app.js';
import { ModalCard } from '../modal-card/modal-card.component.js';

export class EditableQuestionnaire extends Component {
    constructor(questionnaireData, uid) {
        super({
            template: '/components/editable-quiz/index.html',
            styles: '/components/editable-quiz/styles.css'
        });
        this.initElement(questionnaireData, uid);
    }

    async initElement(questionnaireData, uid) {

        await this.templatePromise;

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
            for(const q of questionnaireData.questions) {
                await this.createNewQuestion(q);
            };
            this.questionsContainer.classList.remove('hide')
            $(this, 'progress-spinner').classList.add('hide');
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

    async createNewQuestion(questionData) {

        const q = new Card({
            styles: '/components/editable-quiz/styles.css'
        });

        await q.addTemplate('/components/editable-quiz/quiz-item.html');
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

        drop.setOption(questionData.type)

        const deleteBtn = this.shadowRoot.querySelector('#deleteBtn');

        this.questionsContainer.appendChild(q);

        drop.setOnChange(event => {
            console.log(event.target.value)
            if(event.target.value === 'single-select' || event.target.value === 'multi-select') {
                qAnswersContainer.classList.remove('hide');
            } else {
                qAnswersContainer.classList.add('hide');
            }
        })

        const qAnswersContainer = $(q, '#questionAnswers');
        if(questionData.type === 'single-select' || questionData.type === 'multi-select') {
            for(const item of questionData.options) {

                const el = await $r('div', '/components/editable-quiz/quiz-answer-option.html');
                qAnswersContainer.children[0].appendChild(el);
                $(el, 'input-elmnt').setInput(item)

                // const qAnswer = document.createElement('div');
                // qAnswer.classList.add('qAnswerItem');

                // const input = new Input('text');
                // input.setInput(item);
                // qAnswer.appendChild(input);

                // qAnswersContainer.children[0].appendChild(qAnswer);
            }
            qAnswersContainer.classList.remove('hide');
        }
    }

    changeTitle(title) {
        this.shadowRoot.querySelector('input-elmnt').setInput(title);
    }
}

customElements.define('editable-quiz', EditableQuestionnaire);