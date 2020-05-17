'use strict';

import { Component } from "../component.js";
import { $, $r } from "../../app.js";
import { Card } from "../card/card.component.js";
import { ModalCard } from "../modal-card/modal-card.component.js";
import { SnackBar } from "../snack-bar/snack-bar.component.js";
import { initDrive } from "../../drive.js";
import { TouchDragList } from "../touch-drag-list/touch-drag-list.component.js";
import { PieChart } from "../chart/pie-chart.component.js";
import { BarChart } from "../chart/bar-chart.component.js";
import { BottomSheet } from "../bottom-sheet/bottom-sheet.component.js";

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
            this.unsavedChanges();
        })
        $(this.appBar, '#responsesBtn').addEventListener('click', () => this.responsesTab());
        $(this.appBar, '#questionsBtn').addEventListener('click', () => this.questionsTab());
        $(this.appBar, '#previewBtn').addEventListener('click', () => this.preview());
        $(this.appBar, '#saveBtn').addEventListener('click', () => this.save());
        this.initSaveStatus(quizData.saveTime);
        this.questionTouchList = $(this, 'touch-drag-list');
        this.qCards = [];
        this.touchLists = [];
        this.questionTouchList.init('card-el', true);
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
            lastSavedTime.textContent = `Last saved ${lastSaved.getDay()}/${lastSaved.getMonth()}/${lastSaved.getFullYear()} ${lastSaved.getHours()}:${lastSaved.getMinutes() < 10 ? '0'+lastSaved.getMinutes() : lastSaved.getMinutes()}`;
        }
    }

    unsavedChanges() {
        $(this.appBar, '#saveBtn').disabled = false;
    }

    async save() {
        $(this.appBar, '#saveStatus').textContent = 'Saving...';
        const saveTime = Date.now();
        this.data.saveTime = saveTime;
        await fetch(`/api/editquestionnaire/${this.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.data)
        })
        $(this.appBar, '#saveBtn').disabled = true;
        this.initSaveStatus(saveTime);
    }

    async initShareDialog() {
        const quizURL = `${window.location.host}/quiz/${this.id}`;
        // const shareModal = new ModalCard({
        //     template: '/components/editable-quiz/quiz-share-dialog.html',
        //     stylesheet: '/components/editable-quiz/editable-quiz.component.css'
        // }, null, '70%', '20%');
        // await shareModal.templatePromise;
        // $(shareModal, '#closeBtn').addEventListener('click', () => shareModal.close());
        
        // $(shareModal, '#clipboardBtn').addEventListener('click', () => {
        //     navigator.clipboard.writeText(quizURL);
        //     const snackBar = new SnackBar();
        //     snackBar.addTitle('Link copied to clipboard');
        //     snackBar.show(5000);
        // });
        const shareModal = new BottomSheet({
            template: '/components/editable-quiz/quiz-share-dialog.html',
            stylesheet: '/components/editable-quiz/editable-quiz.component.css'
        })

        $(this.appBar, '#shareBtn').addEventListener('click', () => {
            shareModal.open();
            $(shareModal, 'text-input').setValue(quizURL);
        });
    }

    async initSettingsDialog() {
        const settingsDialog = new ModalCard({
            template: '/components/editable-quiz/quiz-config-dialog.html',
            stylesheet: '/components/editable-quiz/editable-quiz.component.css'
        }, this.data.options, '70%', '30%');
        $(this.appBar, '#settingsBtn').addEventListener('click', () => {
            settingsDialog.open();
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
        for(const [i, question] of this.data.questions.entries()) {
            const questionResponseCard = new Card({
                template: '/components/editable-quiz/quiz-responses-question-card.html',
                stylesheet: '/components/editable-quiz/editable-quiz.component.css'
            });
            await questionResponseCard.templatePromise;
            $(this, '#responsesContainer').append(questionResponseCard)
            $(questionResponseCard, '#title').append(question.text)
            const questionResponses = [question.options?.length];
            this.responses.forEach(response => {
                questionResponses.push(response.questions[i].answer)
            })
            const chartContainer = $(questionResponseCard, '#questionResponses');
            function foo(arr) {
                var a = [], b = [], prev;
            
                arr.sort();
                for ( var i = 0; i < arr.length; i++ ) {
                    if ( arr[i] !== prev ) {
                        a.push(arr[i]);
                        b.push(1);
                    } else {
                        b[b.length-1]++;
                    }
                    prev = arr[i];
                }
            
                return [a, b];
            }
            switch (question.type) {
                case 'single-select':
                    const chart = new PieChart(foo(questionResponses)[1]);
                    console.log(chart)
                    chartContainer.append(chart);
                    break;
                case 'multi-select':
                    chartContainer.append(new BarChart());
                    break;
                default:
                    console.log(questionResponses)
                    questionResponses.forEach(item => {
                        if(item) {
                            const thing = document.createElement('div');
                            thing.append(item);
                            chartContainer.classList.add('textResponses');
                            chartContainer.append(thing)
                        }
                    })
                    break;
            }
            
        }
    }

    initAnswerOptionList(q, index) {
        const answerOptionsContainer = $(q, '#questionAnswers');
        const newAnswerOptionBtn = $(answerOptionsContainer, '#newOptionBtn');

        newAnswerOptionBtn.children[0].initElement();
        answerOptionsContainer.classList.remove('hide');
        const touchList = $(q, 'touch-drag-list');
        touchList.addStyleSheet('/components/editable-quiz/editable-quiz.component.css')
        touchList.init('qAnswerItem');
        touchList.addEventListener('reorder', e => {
            this.moveOption(index, e.detail.oldIndex, e.detail.newIndex);
        });
        this.touchLists[index] = touchList;
        newAnswerOptionBtn.addEventListener('click', () => {
            console.log(this.data.questions[index].options)
            this.createAnswerOption(answerOptionsContainer, null, this.data.questions[index].type, true, this.data.questions[index].options.length, index);
        });
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
        this.questionTouchList.addItem(q, '#dragHandle');
        $(q, 'text-input').setValue(questionData.text);

        const answerOptionsContainer = $(q, '#questionAnswers');
        const newAnswerOptionBtn = $(answerOptionsContainer, '#newOptionBtn');
        if(questionData.type === 'single-select' || questionData.type === 'multi-select') {
            if(this.data.questions[index].type === "single-select") {
                newAnswerOptionBtn.children[0].textContent = 'radio'
            } else if(this.data.questions[index].type === "multi-select") {
                newAnswerOptionBtn.children[0].textContent = 'check_box'
            }
            this.initAnswerOptionList(q, index);
            for(const [i, opt] of questionData.options.entries()) {
                await this.createAnswerOption(answerOptionsContainer, opt, questionData.type, false, i, index);
            }
        } else {
            this.touchLists.push(null);
        }
        
        // newAnswerOptionBtn.addEventListener('click', () => {
        //     this.createAnswerOption(answerOptionsContainer, null, this.data.questions[index].type, true, this.data.questions[index].options.length-1, index);
        // });
        
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
                if(!this.data.questions[index].options) {
                    this.initAnswerOptionList(q, index)
                    this.createAnswerOption(answerOptionsContainer, null, e.target.value, true, 0, index);
                }
                answerOptionsContainer.classList.remove('hide');
                newAnswerOptionBtn.children[0].textContent = 'radio';
            } else if(e.target.value === "multi-select") {
                if(!this.data.questions[index].options) {
                    this.initAnswerOptionList(q, index)
                    this.createAnswerOption(answerOptionsContainer, null, e.target.value, true, 0, index);
                }
                answerOptionsContainer.classList.remove('hide');
                newAnswerOptionBtn.children[0].textContent = 'check_box'
            } else {
                answerOptionsContainer.classList.add('hide');
                this.touchLists[index].removeAllItems();
                this.data.questions[index].options = null;
            }
            newAnswerOptionBtn.children[0].initElement();
        });

        const requiredToggle = $(q, 'toggle-el');
        requiredToggle.setValue(questionData.required);
        requiredToggle.setOnChange((e) => {
            this.data.questions[index].required = e.target.checked;
            this.unsavedChanges();
        });
        $(q, '#deleteBtn').addEventListener('click', () => this.deleteQuestion(index));
        $(q, '#duplicateBtn').addEventListener('click', () => this.duplicateQuestion(index));
        
        this.qCards.push(q);
        
    }

    deleteQuestion(index) {
        this.questionTouchList.removeItem(index);
        this.data.questions.splice(index, 1);
        console.log(this.data.questions);
        this.unsavedChanges();
    }

    duplicateQuestion(index) {
        this.createQuestion(index + 1, this.data.questions[index]);
        this.data.questions.splice(index + 1, 0, this.data.questions[index])
        Array.from(this.questionsContainer.children).forEach(element => {
            if(element.index > index) {
                element.index++;
            }
        });
        this.unsavedChanges();
    }

    async createAnswerOption(answerContainer, name, type, newItem, index, qIndex) {
        const el = await $r('div', '/components/editable-quiz/quiz-answer-option.html');
        el.classList.add('qAnswerItem');
        // answerContainer.children[0].appendChild(el);
        if(name === null) {
            name = `Option ${index+1}`;
        }
        this.touchLists[qIndex].addItem(el, '.answerOptionDragHandle');
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
            if(this.data.questions[qIndex].options) {
                this.data.questions[qIndex].options[index] = name;
            } else {
                this.data.questions[qIndex].options = [];
                this.data.questions[qIndex].options[index] = name;
            }
            
        }
        $(el, 'button').onclick = () => {
            answerContainer.children[0].removeChild(el);
            this.data.questions[qIndex].options.splice(index, 1);
        }
        
    }

    moveOption(qIndex, oldIndex, newIndex) {
        this.data.questions[qIndex].options;
        if (newIndex >= this.data.questions[qIndex].options.length) {
            let k = newIndex - this.data.questions[qIndex].options.length + 1;
            while (k--) {
                this.data.questions[qIndex].options.push(undefined);
            }
        }
        this.data.questions[qIndex].options.splice(newIndex, 0, this.data.questions[qIndex].options.splice(oldIndex, 1)[0]);
        console.log(this.data.questions[qIndex].options);
        this.unsavedChanges();
    }
}
window.customElements.define('editable-quiz', EditableQuiz);