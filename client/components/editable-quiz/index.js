"use strict";

import { Component } from '../component.js';
import { Card } from '../card/card.component.js';
import { Input } from '../input/index.js';
import { Dropdown } from '../dropdown/dropdown.component.js';
import { $, $r } from '../../app.js';
import { ModalCard } from '../modal-card/modal-card.component.js';
import { TextInput } from '../text-input/text-input.component.js';
import { Toggle } from '../toggle/toggle.component.js';

export class EditableQuestionnaire extends Component {
    constructor(uid, questionnaireData, responsesData, appBar) {
        super({
            template: '/components/editable-quiz/index.html',
            stylesheet: '/components/editable-quiz/styles.css'
        });
        console.log("CREAETD")
        this.appBar = appBar;
        this.elLoaded = this.initElement(questionnaireData, responsesData, uid, appBar);
    }

    connectedCallback() {
        console.log("ININTTEEDS")
    }

    disconnectedCallback() {
        console.log("GOODBYE")
    }

    async initElement(questionnaireData, responsesData, uid, appBar) {

        console.log(responsesData)

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
        this.questionsContainer = $(this, '#questionsContainer');
        this.questionsContainer.addEventListener('dragover', (e) => {
            e.preventDefault()
            console.log(e)
        })
        this.questionsContainer.addEventListener('dragenter', (e) => {
            console.log(e)
        })
        this.questionsContainer.addEventListener('drop', (e) => {
            console.log(e)
        })

        this.quizEditorContainer = $(this, '#editableQuestionsContainer');
        this.responsesContainer = $(this, '#responsesContainer');

        const questionsBtn = $(appBar, '#questionsBtn');
        const responsesBtn = $(appBar, '#responsesBtn');

        responsesBtn.addEventListener('click', () => {
            responsesBtn.classList.add('selected');
            questionsBtn.classList.remove('selected');
            this.quizEditorContainer.classList.add('hide');
            this.responsesContainer.classList.remove('hide');
        })
        questionsBtn.addEventListener('click', () => {
            questionsBtn.classList.add('selected');
            responsesBtn.classList.remove('selected');
            this.responsesContainer.classList.add('hide');
            this.quizEditorContainer.classList.remove('hide');
        })

        const responsesTitleCard = new Card({
            template: '/components/editable-quiz/quiz-responses-title-card.html',
            styles: '/components/editable-quiz/styles.css'
        });
        this.responsesContainer.append(responsesTitleCard);
        await responsesTitleCard.templatePromise;
        $(responsesTitleCard, '#title').textContent = `${responsesData.length} ${responsesData.length === 1 ? 'Response' : 'Responses'}`;


    
        // this.createTitle();
        

        const exandedContent = $(appBar, '#expandedContent');
        appBar.expand()
        
        this.createButtons(questionnaireData, exandedContent);

        this.elements = new Array;
        if(questionnaireData) {
            this.changeTitle(questionnaireData.name);
            for(const [i, q] of questionnaireData.questions.entries()) {
                await this.createNewQuestion(i, q);
            };
            Array.from(this.questionsContainer.children).forEach(element => {
                element.visible = true;
            })
            this.quizEditorContainer.classList.remove('hide')
            $(this, 'progress-spinner').classList.add('hide');
        }
    }

    async createButtons(questionnaireData, container) {
        $(this, "#newQ").onclick = () => this.createNewQuestion();

        const modalOptions = this.quiz.options;
        this.configModal = new ModalCard({
            template: '/components/editable-quiz/quiz-config-dialog.html',
            stylesheet: '/components/editable-quiz/styles.css'
        }, modalOptions, '70%', '30%');
        await this.configModal.templatePromise;
        $(this.appBar, '#settingsBtn').onclick = () => this.settings();

        const saveBtn = $(this.appBar, '#saveBtn');
        saveBtn.onclick = () => this.save();

        const quizURL = `${window.location.host}/quiz/${this.uid}`;
        const previewBtn = $(this.appBar, '#previewBtn');
        previewBtn.onclick = () => this.preview();

        // const lastSavedTime = $(this, '#lastSavedTime');
        // const lastSaved = new Date(this.quiz.saveTime);
        // const currentTime = Date.now();
        // const time = currentTime - this.quiz.saveTime;
        // if(time < 60000) {
        //     lastSavedTime.append('less than a minute ago');
        // } else if(time < 3600000) {
        //     lastSavedTime.append(`${Math.ceil(time/60000)} minutes ago`);
        // } else {
        //     lastSavedTime.append(`${lastSaved.getDay()}/${lastSaved.getMonth()}/${lastSaved.getFullYear()}\n${lastSaved.getHours()}:${lastSaved.getMinutes()}`);
        // }

        const shareModal = new ModalCard({
            template: '/components/editable-quiz/quiz-share-dialog.html',
            stylesheet: '/components/editable-quiz/styles.css'
        }, null, '70%', '20%');
        await shareModal.templatePromise;
        $(shareModal, '#closeBtn').onclick = () => shareModal.close();
        $(this.appBar, '#shareBtn').onclick = () => shareModal.open();
        $(shareModal, 'text-input').setValue(quizURL);
        $(shareModal, '#clipboardBtn').onclick = () => navigator.clipboard.writeText(quizURL);
    }

    async createNewQuestion(index, questionData) {

        if(!questionData) {
            questionData = {type: 'text'}
        }

        const q = new Card({
            template: '/components/editable-quiz/quiz-item.html',
            stylesheet: '/components/editable-quiz/styles.css'
        });
        q.triggerVisible();
        q.draggable = true;

        q.index = index;

        await q.templatePromise;
        console.log(q)
        const i = $(q, 'text-input');
        
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
        const drop = $(q, 'dropdown-el');
        drop.setOptions(options);

        drop.setOption(questionData.type)

        const deleteBtn = $(q, '#deleteBtn');
        deleteBtn.onclick = () => {
            this.quiz.questions.splice(q.index, 1);
            this.questionsContainer.removeChild(q);
            Array.from(this.questionsContainer.children).forEach(element => {
                if(element.index > q.index) {
                    element.index--;
                }
            });
        }

        const duplicateBtn = $(q, '#duplicateBtn');
        duplicateBtn.onclick = () => {
            this.createNewQuestion(q.index + 1, this.quiz.questions[q.index]);
            this.quiz.questions.splice(q.index + 1, 0, this.quiz.questions[q.index])
            Array.from(this.questionsContainer.children).forEach(element => {
                if(element.index > q.index) {
                    element.index++;
                }
            });
            console.log(this.quiz.questions)
        }

        const toggle = $(q, 'toggle-el')
        toggle.checked = questionData.required;
        toggle.setOnChange(e => {
            this.quiz.questions[index].required = e.target.checked;
        });

        if(index < this.questionsContainer.children.length) {
            this.questionsContainer.insertBefore(q, this.questionsContainer.children[index-1].nextSibling)
        } else {
            this.questionsContainer.appendChild(q);
        }
        

        const qAnswersContainer = $(q, '#questionAnswers');
        const newOptionBtn = $(q, '#newOptionBtn');

        qAnswersContainer.children[0].addEventListener('dragover', (e) => {
            e.preventDefault();
            console.log(e);
        })

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
        el.classList.add('qAnswerItem')
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
        el.draggable = true;
        el.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/html', e.target.id)
            console.log(e)
        })
    }

    settings() {
        this.configModal.open();
        this.configModal.resultsObservable.subscribe(data => {
            console.log(data);
            if(data !== undefined) {
                console.log("set data")
                this.quiz.options = data
            }
            console.log(this.quiz);
        });
    }
    preview() {
        const w = window.open(window.location.host, '_blank');
        w.location.assign(`/quiz/${this.uid}`);
    }
    send() {

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
        $(this.appBar, 'text-input').setValue(title);
    }
}

customElements.define('editable-quiz', EditableQuestionnaire);