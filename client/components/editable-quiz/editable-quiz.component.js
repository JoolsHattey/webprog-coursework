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
        this.qCards = [];
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
            snackBar.show(5000);
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
        this.qCards.push(q);
        q.index = index;
        await q.templatePromise;
        if(index < this.questionsContainer.children.length) {
            this.questionsContainer.insertBefore(q, this.questionsContainer.children[index-1].nextSibling)
        } else {
            this.questionsContainer.appendChild(q);
        }
        $(q, 'text-input').setValue(questionData.text);

        const answerOptionsContainer = $(q, '#questionAnswers');
        const newAnswerOptionBtn = $(answerOptionsContainer, '#newOptionBtn');
        console.log(answerOptionsContainer)
        if(questionData.type === 'single-select' || questionData.type === 'multi-select') {
            for(const [i, opt] of questionData.options.entries()) {
                await this.createAnswerOption(answerOptionsContainer, opt, questionData.type, false, i, index);
            }
            if(this.data.questions[index].type === "single-select") {
                newAnswerOptionBtn.children[0].textContent = 'radio'
            } else if(this.data.questions[index].type === "multi-select") {
                newAnswerOptionBtn.children[0].textContent = 'check_box'
            }
            newAnswerOptionBtn.children[0].initElement();
            answerOptionsContainer.classList.remove('hide');
        }
        newAnswerOptionBtn.addEventListener('click', () => {
            this.createAnswerOption(answerOptionsContainer, null, this.data.questions[index].type, true, this.data.questions[index].options.length-1, index);
        });
        
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
        dropDown.setValue(questionData.type);
        dropDown.setOnChange((e) => {
            this.data.questions[index].type = e.target.value;
            if(e.target.value === "single-select") {
                newAnswerOptionBtn.children[0].textContent = 'radio'
            } else if(e.target.value === "single-select") {
                newAnswerOptionBtn.children[0].textContent = 'check_box'
            }
            newAnswerOptionBtn.children[0].initElement();
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
        if(name === null) {
            name = `Option ${index+1}`
        }
        $(el, 'text-input').setValue(name);
        el.index = index;
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
            this.data.questions[qIndex].options[index] = name
        }
        $(el, 'button').onclick = () => {
            answerContainer.children[0].removeChild(el);
            this.data.questions[qIndex].options.splice(index, 1);
        }
        let touchStartPos;
        let elements;
        let tempNewIndex;
        el.addEventListener('touchstart', e => {
            el.style.transition = '0s';
            touchStartPos = e.changedTouches[0].clientY;
        });
        el.addEventListener('touchmove', e => {
            e.preventDefault();
            el.style.transform = `translate3d(0,${e.changedTouches[0].clientY-touchStartPos}px,0)`;
            (this.qCards[qIndex].shadowRoot.elementsFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY)).some(item => {
                if(item.classList.contains('qAnswerItem') && item.index !== el.index) {
                    tempNewIndex = item.index;
                    if(e.changedTouches[0].clientY<touchStartPos) {
                        console.log('up')
                        Array.from(answerContainer.children[0].children).forEach(opt => {
                            if(parseInt(opt.index) >= parseInt(item.index) && !(opt.index === el.index)) {
                                opt.style.transition = '0.3s'
                                opt.style.transform = 'translate3d(0,100%,0)';
                            } else if(parseInt(opt.index) < parseInt(item.index)) {
                                opt.style.transform = 'translate3d(0,0,0)';
                            }
                        })
                    } else {
                        console.log('down')
                        Array.from(answerContainer.children[0].children).forEach(opt => {
                            if(parseInt(opt.index) <= parseInt(item.index) && !(opt.index === el.index)) {
                                opt.style.transition = '0.3s'
                                opt.style.transform = 'translate3d(0,-100%,0)';
                            }
                            if(parseInt(opt.index) > parseInt(item.index) && !(opt.index === el.index)) {
                                opt.style.transform = 'translate3d(0,0,0)';
                            }
                        })
                    }
                    
                    return true;
                }
            });
        });
        el.addEventListener('touchend', e => {
            el.style.transition = '0.3s';
            el.style.transform = `translate3d(0,0,0)`;
            this.moveOption(qIndex, el.index, tempNewIndex, el, answerContainer);
        });
    }

    moveOption(qIndex, oldIndex, newIndex, el, answerContainer) {
        this.data.questions[qIndex].options;
        if (newIndex >= this.data.questions[qIndex].options.length) {
            let k = newIndex - this.data.questions[qIndex].options.length + 1;
            while (k--) {
                this.data.questions[qIndex].options.push(undefined);
            }
        }
        
        this.data.questions[qIndex].options.splice(newIndex, 0, this.data.questions[qIndex].options.splice(oldIndex, 1)[0]);

        const currentEl = answerContainer.children[0].removeChild(el);
        console.log(currentEl.innerHTML)
        answerContainer.children[0].insertBefore(currentEl, answerContainer.children[0].children[newIndex]);
        Array.from(answerContainer.children[0].children).forEach(item => {
            item.style.transition = '0s';
            item.style.transform = 'translate3d(0,0,0)';
        });
        currentEl.index = newIndex;
        if(newIndex < oldIndex ) {
            for(let i=newIndex+1; i<oldIndex; i++) {
                answerContainer.children[0].children[i].index++;
            }
        } else {
            for(let i=newIndex; i>=oldIndex; i--) {
                answerContainer.children[0].children[i].index--;
            }
        }
    }
}
customElements.define('editable-quiz', EditableQuiz);