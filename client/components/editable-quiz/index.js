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
            stylesheet: '/components/editable-quiz/styles.css'
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
            for(const [i, q] of questionnaireData.questions.entries()) {
                await this.createNewQuestion(i, q);
            };
            this.questionsContainer.classList.remove('hide')
            $(this, 'progress-spinner').classList.add('hide');
        }
    }

    createTitle() {
        // this.shadowRoot.querySelector("#saveBtn")
        //     .onclick = () => this.quiz.name = title.value;
    }

    async createButtons(questionnaireData) {
        this.container.querySelector("#newQ")
            .onclick = () => this.createNewQuestion();

        const modalOptions = this.quiz.options;
        const modal = new ModalCard({
            template: '/components/editable-quiz/quiz-config-dialog.html',
            stylesheet: '/components/editable-quiz/styles.css'
        }, modalOptions);
        this.container.appendChild(modal);
        await modal.templatePromise;
        $(this, '#settingsBtn').onclick = () => {
            modal.open();
            modal.resultsObservable.subscribe({next: data => {
                console.log(data);
                if(data !== undefined) {
                    console.log("set data")
                    this.quiz.options = data
                }
                console.log(this.quiz);
            }});
        }

        const saveBtn = $(this, '#saveBtn');
        saveBtn.onclick = () => this.save();

        const lastSavedTime = $(this, '#lastSavedTime');
        const lastSaved = new Date(this.quiz.saveTime);
        const currentTime = Date.now();
        const time = currentTime - this.quiz.saveTime;
        if(time < 60000) {
            lastSavedTime.append('less than a minute ago');
        } else if(time < 3600000) {
            lastSavedTime.append(`${Math.ceil(time/60000)} minutes ago`);
        } else {
            lastSavedTime.append(`${lastSaved.getDay()}/${lastSaved.getMonth()}/${lastSaved.getFullYear()}\n${lastSaved.getHours()}:${lastSaved.getMinutes()}`);
        }



        const shareModal = new ModalCard({
            template: '/components/editable-quiz/quiz-share-dialog.html',
            stylesheet: '/components/editable-quiz/styles.css'
        });
        this.container.appendChild(shareModal);
        await shareModal.templatePromise;
        $(shareModal, '#closeBtn').onclick = () => shareModal.close();
        $(this, '#shareBtn').onclick = () => {
            shareModal.open();
        }
        const quizURL = `${window.location.host}/quiz/${this.uid}/view`;
        $(shareModal, 'input-elmnt').setValue(quizURL);
        $(shareModal, '#clipboardBtn').onclick = () => {
            navigator.clipboard.writeText(quizURL);
        }
    }

    testFunction() {console.log("test")}

    // createResponses

    async createNewQuestion(index, questionData) {

        const q = new Card({
            stylesheet: '/components/editable-quiz/styles.css'
        });

        await q.addTemplate('/components/editable-quiz/quiz-item.html');
        const i = q.shadowRoot.querySelector('input-elmnt')
        
        if(questionData) {
            q.id = questionData.id;
            i.setValue(questionData.text);
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

        const toggle = $(q, 'toggle-el')
        toggle.checked = questionData.required;
        toggle.setOnChange(e => {
            this.quiz.questions[index].required = e.target.checked;
        });

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
                $(el, 'input-elmnt').setValue(item)

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

    async save() {
        console.log(this.quiz);
        this.quiz.saveTime = Date.now();
        const res = await fetch(`/api/editquestionnaire/${this.uid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.quiz)
        });
        console.log(await res.json());
    }

    changeTitle(title) {
        this.shadowRoot.querySelector('input-elmnt').setValue(title);
    }
}

customElements.define('editable-quiz', EditableQuestionnaire);