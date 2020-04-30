"use strict";

import { Component } from '../component.js';
import { Card } from '../card/card.component.js';
import { Input } from '../input/index.js';
import { Selector } from '../selector/selector.component.js';
import { $ } from '../../app.js';
import { SnackBar } from "../snack-bar/snack-bar.component.js";

export class Questionnaire extends Component {
    constructor(questionnaireData, uid) {
        super({
            template: '/components/quiz/index.html',
            stylesheet: '/components/quiz/styles.css'
        });
        this.templatePromise.then(() => {
            this.initElement(questionnaireData, uid);
        });
    }

    initElement(questionnaireData, uid) {
        this.uid = uid;
        $(this, '#quizContent').style.display = 'none';
        this.initTitleCard(questionnaireData);
        this.initQuestionCards(questionnaireData);
        this.initFinishCard();
        this.completeSnack = new SnackBar();
        this.completeSnack.addTitle('Quiz submitted');
        this.container.appendChild(this.completeSnack);
    }

    initTitleCard(questionnaireData) {
        this.titleContainer = new Card();
        $(this, '#titleCard').appendChild(this.titleContainer);
        this.titleContainer.addTemplate('/components/quiz/quiz-title.html')
            .then(() => {
                $(this.titleContainer, '#title').append(questionnaireData.name);
                $(this.titleContainer, '#numQ').append(`${questionnaireData.questions.length} Questions`);
                console.log("yiss")
                $(this.titleContainer, '#startBtn').onclick = () => {
                    $(this, '#quizContent').style.display = 'block';
                    this.titleContainer.style.display = 'none';
                }
                firebase.auth().onAuthStateChanged(user => {
                    if(user) {

                    } else {
                        if(questionnaireData.options.requireLogin) {
                            $(this.titleContainer, '#startBtn').disabled = true;
                            $(this.titleContainer, '#requireLoginLabel').classList.remove("hide");
                        }
                    }
                })
                
            });
    }

    initQuestionCards(questionnaireData) {
        this.questionContainer = this.shadowRoot.querySelector('#question');
        
        this.response = { "questions": [] };
        this.currentQ = 0;
        
        this.questions = new Array;
        questionnaireData.questions.forEach(item => {
            const q = this.createQuestion(item);
            this.questions.push(q);
        });

        this.questionContainer.appendChild(this.questions[0]);
        const btn = $(this, '#nextBtn');

        const progress = $(this, 'progress');
        progress.setAttribute('value', (1 / this.questions.length)*100);
        


        // const progressIndicator = this.shadowRoot.querySelector('progress-indicator');
        // progressIndicator.steps = this.questions.length;
        btn.onclick = () => {
            const qType = questionnaireData.questions[this.currentQ].type;
            this.response.questions[this.currentQ] = {
                "id": this.questions[this.currentQ].id,
                "answer": this.questions[this.currentQ].shadowRoot.querySelector(qType === 'text' || qType === 'number' ? 'input-elmnt' : 'selector-elmnt').getInput()
            }
            this.currentQ++;
            this.questionContainer.removeChild(this.questions[this.currentQ-1]);
            if(this.currentQ < this.questions.length) {
                this.questionContainer.appendChild(this.questions[this.currentQ]);
            } else {
                $(this, '#quizContent').style.display = 'none';
                this.container.appendChild(this.finishCard);
            }
            console.log((this.currentQ / this.questions.length) * 100)
            console.log(this.currentQ, this.questions.length);
            progress.setAttribute('value', (((this.currentQ+1) / this.questions.length) * 100));
            // progressIndicator.increment();
        }
    }

    initFinishCard() {
        this.finishCard = new Card();
        this.finishCard.addTemplate('/components/quiz/quiz-finish.html')
            .then(() => {
                $(this.finishCard, '#submitBtn').onclick = () => {
                    this.submitResponse(this.uid, this.response);
                }
            });
    }

    changeTitle(name) {
        const title = this.shadowRoot.querySelector('#title')
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
                input = new Input("text");
                input.id = questionData.id;
                break;
            case "number":
                input = new Input("number");
                break;
            case "single-select":
                input = new Selector(questionData.options, "radio");
                break;
            case "multi-select":
                input = new Selector(questionData.options, "checkbox");
                break;
        }
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

    getAnswer() {
        if(this.input === Input) {
            return this.input.getInput();
        }
        
    }
}

customElements.define("quiz-item", Questionnaire);