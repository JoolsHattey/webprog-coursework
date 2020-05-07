"use strict";

import { Component } from '../component.js';
import { Card } from '../card/card.component.js';
import { Input } from '../input/index.js';
import { Selector } from '../selector/selector.component.js';
import { $, $r } from '../../app.js';
import { SnackBar } from "../snack-bar/snack-bar.component.js";
import { Checkbox } from '../checkbox/checkbox.component.js';
import { RadioGroup } from '../radio-selector/radio-selector.component.js';
import { CheckboxGroup } from '../checkbox/checkbox-group.component.js';
import { TextInput } from '../text-input/text-input.component.js';
import { ModalCard } from '../modal-card/modal-card.component.js';

export class Questionnaire extends Component {
    constructor(questionnaireData, uid) {
        super({
            template: '/components/quiz/index.html',
            stylesheet: '/components/quiz/styles.css'
        });
        this.initElement(questionnaireData, uid);
    }

    async initElement(questionnaireData, uid) {
        await this.templatePromise;
        this.uid = uid;
        $(this, '#quizContent').style.display = 'none';
        this.initTitleCard(questionnaireData);
        
        this.initMiniTitleCard(questionnaireData);
        this.initQuestionCards(questionnaireData);
        this.initFinishCard();
        this.completeSnack = new SnackBar();
        this.completeSnack.addTitle('Quiz submitted');
        this.container.appendChild(this.completeSnack);
    }

    async initTitleCard(questionnaireData) {
        this.titleContainer = new Card({
            template: '/components/quiz/quiz-title.html'
        });
        $(this, '#titleCard').appendChild(this.titleContainer);
        await this.titleContainer.templatePromise;
        $(this.titleContainer, '#title').append(questionnaireData.name);
        $(this.titleContainer, '#numQ').append(`${questionnaireData.questions.length} Questions`);
        console.log("yiss")
        $(this.titleContainer, '#startBtn').onclick = () => this.startButton();
        firebase.auth().onAuthStateChanged(user => {
            if(user) {

            } else {
                if(questionnaireData.options.requireLogin) {
                    $(this.titleContainer, '#startBtn').disabled = true;
                    $(this.titleContainer, '#requireLoginLabel').classList.remove("hide");
                }
            }
        })
    }

    startButton() {
        $(this, '#quizContent').style.display = 'block';
        this.titleContainer.style.display = 'none';
        $(this, '#miniTitleCard').classList.remove('hide');
        $(this, '#quizNavBtnContainer').classList.remove('hide');
    }

    async initMiniTitleCard(questionnaireData) {
        this.miniTitleCard = new Card({
            template: '/components/quiz/quiz-mini-title-card.html',
            stylesheet: '/components/quiz/styles.css'
        });
        await this.miniTitleCard.templatePromise;
        if(questionnaireData.options?.quizMode) this.initTimer();
        $(this.miniTitleCard, '#title').append(questionnaireData.name);
        $(this, '#miniTitleCard').appendChild(this.miniTitleCard);
    }

    initQuestionCards(questionnaireData) {
        this.questionContainer = $(this, '#question');
        
        this.answerarray = new Array;
        this.response = { "questions": [] };
        this.currentQ = 0;
        
        this.questions = new Array;
        questionnaireData.questions.forEach(item => {
            const q = this.createQuestion(item);
            this.questions.push(q);
        });

        this.questionContainer.appendChild(this.questions[0]);
        const btn = $(this, '#nextBtn');

        this.progress = $(this, 'progress');
        this.progress.setAttribute('value', (1 / this.questions.length)*100);

        btn.onclick = () => {
            this.nextQuestion(questionnaireData.questions[this.currentQ].required);
        }
    }

    async initTimer() {
        this.quizEndDialog = new ModalCard({
            template: '/components/quiz/quiz-time-limit-dialog.html',
            stylesheet: '/components/quiz/styles.css'
        });
        this.container.appendChild(this.quizEndDialog);
        await this.quizEndDialog.templatePromise;
        this.timerEl = $(this.miniTitleCard, '#timer');
        this.timerEl.classList.remove('hide');
    }

    startTimer(options) {
        let timeLeft = options.timeLimit;
        this.timerEl.children[1].textContent = this.millisToMinutesAndSeconds(timeLeft);
        const timerIntervalID = window.setInterval(() => {
            timeLeft-=1000;
            this.timerEl.children[1].textContent = this.millisToMinutesAndSeconds(timeLeft);
        }, 1000);
        const timerTimeoutID = window.setTimeout(() => {
            console.log("the end");
            window.clearInterval(timerIntervalID);
            this.quizEndDialog.open()
            this.quizEndDialog.resultsObservable.subscribe({next: data => {
                $(this, '#quizContent').classList.add('hide');
                $(this, '#miniTitleCard').classList.add('hide')
                this.container.appendChild(this.finishCard);
                console.log(this.response)
            }})
        }, options.timeLimit);
    }

    millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
      }

    nextQuestion(requireAnswer) {
        if(requireAnswer && !this.answerarray[this.currentQ].getValue()) {
            console.log("oof")
        } else {
            this.response.questions[this.currentQ] = {
                "id": this.questions[this.currentQ].id,
                "answer": this.answerarray[this.currentQ].getValue()
            }
            this.currentQ++;
            this.questionContainer.removeChild(this.questions[this.currentQ-1]);
            if(this.currentQ < this.questions.length) {
                this.questionContainer.appendChild(this.questions[this.currentQ]);
            } else {
                $(this, '#quizContent').classList.add('hide');
                $(this, '#miniTitleCard').classList.add('hide')
                this.container.appendChild(this.finishCard);
            }
            this.progress.setAttribute('value', (((this.currentQ+1) / this.questions.length) * 100));            
        }
    }

    async initFinishCard() {
        this.finishCard = new Card({
            template: '/components/quiz/quiz-finish.html'
        });
        await this.finishCard.templatePromise;
        $(this.finishCard, '#submitBtn').onclick = () => {
            this.submitResponse(this.uid, this.response);
        }
    }

    changeTitle(name) {
        const title = $(this, '#title');
        title.append(name);
    }

    showSubmitButton() {
        const submit = document.createElement("button");
        submit.append("Submit");
        submit.onclick = () => this.submitResponse(this.uid, this.response);
        this.container.appendChild(submit);
    }

    createQuestion(questionData) {
        this.question = new Card();
        this.question.createTitle(questionData.text);
        this.question.id = questionData.id;
        this.createInput(questionData);
        return this.question;
    }
    

    createInput(questionData) {
        let input;
        switch(questionData.type) {
            case "text":
                input = new TextInput();
                input.size = 'singleline'
                input.required = questionData.required;
                input.id = questionData.id;
                break;
            case "number":
                input = new TextInput();
                input.size = 'singleline'
                input.required = questionData.required;
                break;
            case "single-select":
                input = new RadioGroup(questionData.options)
                break;
            case "multi-select":
                input = new CheckboxGroup(questionData.options);
                break;
        }
        this.answerarray.push(input);
        console.log(this.answerarray)
        this.question.container.appendChild(input);
    }

    async submitResponse(uid, response) {
        console.log(uid, response)

        this.completeSnack.show();

        await fetch(`/api/submitresponse/${uid}`, {
            method: 'POST',
            body: JSON.stringify(response),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

customElements.define("quiz-item", Questionnaire);