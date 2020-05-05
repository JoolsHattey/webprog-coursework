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

    
        // this.createTitle();
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

    async createNewQuestion(index, questionData) {

        const q = new Card({
            stylesheet: '/components/editable-quiz/styles.css'
        });

        await q.addTemplate('/components/editable-quiz/quiz-item.html');
        const i = q.shadowRoot.querySelector('text-input')
        
        if(questionData) {
            q.id = questionData.id;
            i.setValue(questionData.text);
        }

        const options = [
            {"value": "text",
            "text": "Text input"},
            {"value": "number",
            "text": "Number input"},
            {"value": "single-select",
            "text": "Multiple choice"},
            {"value": "multi-select",
            "text": "Checkboxes"}
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

        const qAnswersContainer = $(q, '#questionAnswers');
        const newOptionBtn = $(q, '#newOptionBtn');

        if(questionData.type === 'single-select' || questionData.type === 'multi-select') {
            for(const [i, v] of questionData.options.entries()) {
                this.createAnswerOption(qAnswersContainer, v, questionData.type, false, i, index);
            }
            qAnswersContainer.classList.remove('hide');
            if(questionData.type === 'single-select') {
                newOptionBtn.children[0].append('radio');
            } else {
                newOptionBtn.children[0].append('check_box');
            }
            newOptionBtn.children[0].initElement();
        }

        newOptionBtn.onclick = () => {
            console.log(this.quiz.questions[index])
            this.createAnswerOption(qAnswersContainer, '', questionData.type, true, this.quiz.questions[index].options.length, index);
        }
        

        drop.setOnChange(event => {
            if(event.target.value === 'single-select' || event.target.value === 'multi-select') {
                if(event.target.value === 'single-select') {
                    answerTypeIcon.append('radio');
                } else {
                    answerTypeIcon.append('check_box');
                }
                qAnswersContainer.classList.remove('hide');
            } else {
                qAnswersContainer.classList.add('hide');
            }
        })
    }

    async createAnswerOption(answerContainer, name, type, newItem, index, qIndex) {
        console.log(index)
        const el = await $r('div', '/components/editable-quiz/quiz-answer-option.html');
        answerContainer.children[0].appendChild(el);
        if(name === "") {
            name = `Option ${index+1}`
        }
        $(el, 'text-input').setValue(name);
        const answerTypeIcon = $(el, '.answerTypeIcon');
        if(type === 'single-select') {
            answerTypeIcon.append('radio');
        } else {
            answerTypeIcon.append('check_box');
        }
        if(newItem) {
            await $(el, 'text-input').sizeNotInit;
            $(el, 'text-input').inputEl.focus();
            console.log(qIndex)
            this.quiz.questions[qIndex].options[index] = name
        }
        $(el, 'button').onclick = () => {
            answerContainer.children[0].removeChild(el);
            this.quiz.questions[qIndex].options.splice(index, 1);
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