'use strict';

import { Component } from "../component.js";
import { $, $r } from "../../app.js";
import { Card } from "../card/card.component.js";
import { ModalCard } from "../modal-card/modal-card.component.js";
import { SnackBar } from "../snack-bar/snack-bar.component.js";
import { initDrive } from "../../drive.js";

export class EditableQuiz extends Component {
    constructor(uid, quizData, responseData, appBar) {
        super({
            template: '/components/editable-quiz/editable-quiz.component.html',
            stylesheet: '/components/editable-quiz/editable-quiz.component.css'
        });
        this.initElement(uid, quizData, responseData, appBar);
    }

    async initElement(uid, quizData, responseData, appBar) {
        await this.templatePromise;
        this.appBar = appBar;
        this.id = uid;
        this.data = quizData;
        this.responses = responseData;
        this.appBar.expand();
        $(this.appBar, 'text-input').setValue(quizData.name);
        $(this.appBar, 'text-input').setOnChange(e => {
            this.data.name = e.target.value;
            this.save();
        })
        $(this.appBar, '#responsesBtn').addEventListener('click', () => this.responsesTab());
        $(this.appBar, '#questionsBtn').addEventListener('click', () => this.questionsTab());
        $(this.appBar, '#previewBtn').addEventListener('click', () => this.preview());
        this.initSaveStatus(quizData.saveTime);
        this.questionsContainer = $(this, '#questionsContainer');
        for(const [i, question] of quizData.questions.entries()) {
            await this.createQuestion(i, question);
        }
        $(this, '#editableQuestionsContainer').classList.remove('hide');
        $(this, 'progress-spinner').remove();
        this.initShareDialog();
        this.initSettingsDialog();
        this.initResponsesTab();
    }

    preview() {
        const w = window.open(window.location.host, '_blank');
        w.location.assign(`/quiz/${this.id}`);
    }

    initSaveStatus(saveTime) {
        const lastSavedTime = $(this.appBar, '#saveStatus');
        const lastSaved = new Date(saveTime);
        const currentTime = Date.now();
        const time = currentTime - saveTime;
        if(time < 60000) {
            lastSavedTime.textContent = 'Last saved less than a minute ago';
        } else if(time < 3600000) {
            lastSavedTime.textContent = `Last saved ${Math.ceil(time/60000)} minutes ago`;
        } else {
            lastSavedTime.textContent = `Last saved ${lastSaved.getDay()}/${lastSaved.getMonth()}/${lastSaved.getFullYear()} ${lastSaved.getHours()}:${lastSaved.getMinutes()}`;
        }
    }

    async save() {
        $(this.appBar, '#saveStatus').textContent = 'Saving...';
        await fetch(`/api/editquestionnaire/${this.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.data)
        })
        this.initSaveStatus(Date.now())
    }

    async initShareDialog() {
        const quizURL = `${window.location.host}/quiz/${this.id}`;
        const shareModal = new ModalCard({
            template: '/components/editable-quiz/quiz-share-dialog.html',
            stylesheet: '/components/editable-quiz/editable-quiz.component.css'
        }, null, '70%', '20%');
        await shareModal.templatePromise;
        $(shareModal, '#closeBtn').addEventListener('click', () => shareModal.close());
        $(this.appBar, '#shareBtn').addEventListener('click', () => {
            shareModal.open();
            $(shareModal, 'text-input').setValue(quizURL);
        });
        $(shareModal, '#clipboardBtn').addEventListener('click', () => {
            navigator.clipboard.writeText(quizURL);
            const snackBar = new SnackBar();
            snackBar.addTitle('Link copied to clipboard');
            snackBar.show();
        });
    }

    async initSettingsDialog() {
        const setingsDialog = new ModalCard({
            template: '/components/editable-quiz/quiz-config-dialog.html',
            stylesheet: '/components/editable-quiz/editable-quiz.component.css'
        }, this.data.options, '70%', '30%');
        $(this.appBar, '#settingsBtn').addEventListener('click', () => {
            setingsDialog.open();
        });
    }

    questionsTab() {
        $(this.appBar, '#questionsBtn').classList.add('selected');
        $(this.appBar, '#responsesBtn').classList.remove('selected');
        $(this, '#responsesContainer').classList.add('hide');
        $(this, '#editableQuestionsContainer').classList.remove('hide');
    }

    responsesTab() {
        $(this.appBar, '#responsesBtn').classList.add('selected');
        $(this.appBar, '#questionsBtn').classList.remove('selected');
        $(this, '#editableQuestionsContainer').classList.add('hide');
        $(this, '#responsesContainer').classList.remove('hide');
    }

    async initResponsesTab() {
        const responsesCard = new Card({
            template: '/components/editable-quiz/quiz-responses-title-card.html',
            stylesheet: '/components/editable-quiz/editable-quiz.component.css'
        });
        await responsesCard.templatePromise;
        $(this, '#responsesContainer').appendChild(responsesCard);
        const numResponses = this.responses.length;
        $(responsesCard, '#title').append(`${numResponses} ${numResponses === 1 ? 'Response' : 'Responses'}`);
        $(responsesCard, '#exportDriveBtn').addEventListener('click', () => {
            const snack = new SnackBar();
            snack.setAttribute('loading', 'true');
            snack.addTitle('Creating Google Sheet');
            snack.show();
            initDrive(this.id).then(data => {
                snack.hide();
                window.open(data.url);
            });
        })
    }

    async createQuestion(index, questionData) {
        if(!questionData) {
            questionData = {type: 'text'};
        }
        const q = new Card({
            template: '/components/editable-quiz/question.html',
            stylesheet: '/components/editable-quiz/editable-quiz.component.css'
        });
        q.index = index;
        await q.templatePromise;
        if(index < this.questionsContainer.children.length) {
            this.questionsContainer.insertBefore(q, this.questionsContainer.children[index-1].nextSibling)
        } else {
            this.questionsContainer.appendChild(q);
        }
        $(q, 'text-input').setValue(questionData.text)
        const dropDown = $(q, 'dropdown-el');
        dropDown.setOptions([
            {"value": "text",
            "text": "Text input"},
            {"value": "number",
            "text": "Number input"},
            {"value": "single-select",
            "text": "Multiple choice"},
            {"value": "multi-select",
            "text": "Checkboxes"}
        ]);
        dropDown.setOnChange((e) => {
            this.data.questions[index].type = e.target.value;
        });
        const requiredToggle = $(q, 'toggle-el');
        requiredToggle.setValue(questionData.required);
        requiredToggle.setOnChange((e) => {
            this.data.questions[index].required = e.target.checked;
        });
        $(q, '#deleteBtn').addEventListener('click', () => this.deleteQuestion(index));
        $(q, '#duplicateBtn').addEventListener('click', () => this.duplicateQuestion(index));
    }

    deleteQuestion(index) {
        this.questionsContainer.children[index].remove();
        this.data.questions.splice(index, 1);
        console.log(this.data.questions);
        Array.from(this.questionsContainer.children).forEach(element => {
            if(element.index > index) {
                element.index--;
            }
        });
        this.save();
    }

    duplicateQuestion(index) {
        this.createQuestion(index + 1, this.data.questions[index]);
        this.data.questions.splice(index + 1, 0, this.data.questions[index])
        Array.from(this.questionsContainer.children).forEach(element => {
            if(element.index > index) {
                element.index++;
            }
        });
        this.save();
    }

    async createAnswerOption(answerContainer, name, type, newItem, index, qIndex) {
        console.log(index)
        const el = await $r('div', '/components/editable-quiz/quiz-answer-option.html');
        el.classList.add('qAnswerItem');
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
}
customElements.define('editable-quiz', EditableQuiz);