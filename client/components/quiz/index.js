"use strict";

import { Component } from '../component.js';
import { Card } from '../card/index.js';
import { Input } from '../input/index.js';
import { Selector } from '../selector/index.js';
import { ProgressIndicator } from '../progress-indicator/index.js';
import { $ } from '../../app.js';

export class Questionnaire extends Component {
    constructor(questionnaireData, uid) {
        super({
            template: '/components/quiz/index.html'
        });
        this.templatePromise.then(() => {
            this.initElement(questionnaireData, uid);
        });
    }

    initElement(questionnaireData, uid) {
        $(this, '#quizContent').style.display = 'none';

        this.titleContainer = new Card();
        $(this, '#titleCard').appendChild(this.titleContainer);
        this.titleContainer.addTemplate('/components/quiz/quiz-title.html')
            .then(() => {
                $(this.titleContainer, '#title').append(questionnaireData.name);
                $(this.titleContainer, '#numQ').append(`${questionnaireData.questions.length} Questions`);
                $(this.titleContainer, '#startBtn').onclick = () => {
                    $(this, '#quizContent').style.display = 'block';
                    this.titleContainer.style.display = 'none';
                }
            });
        
        const finishCard = new Card();
        finishCard.addTemplate('/components/quiz/quiz-finish.html')
            .then(() => {
                $(finishCard, '#submitBtn').onclick = () => {
                    this.submitResponse(this.uid, this.response);
                }
            });

        this.questionContainer = this.shadowRoot.querySelector('#question');
        this.uid = uid;
        this.response = { "questions": [] };
        this.currentQ = 0;
        
        this.questions = new Array;
        if(questionnaireData) {
            questionnaireData.questions.forEach(item => {
                const q = this.createQuestion(item);
                this.questions.push(q);
            });
        }

        this.questionContainer.appendChild(this.questions[0]);
        const btn = this.shadowRoot.querySelector('#nextBtn');
        const progressIndicator = this.shadowRoot.querySelector('progress-indicator');
        progressIndicator.steps = this.questions.length;
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
                // this.showSubmitButton();
                this.container.appendChild(finishCard);
            }
            progressIndicator.increment();
        }

        











        // this.questionContainer.appendChild(this.questions[0]);
        // const btn = this.shadowRoot.querySelector('#nextBtn');
        // this.ProgIndic = this.shadowRoot.querySelector('progress-indicator');
        // this.ProgIndic.incrementor = this.questions.length;
        // btn.onclick = () => {

        //     console.log(this.questions[this.currentQ])
        //     console.log(questionnaireData.questions[this.currentQ].type)
        //     const qType = questionnaireData.questions[this.currentQ].type;
        //     this.response.questions[this.currentQ] = {
        //         "id": this.questions[this.currentQ].id,
        //         "answer": this.questions[this.currentQ].shadowRoot.querySelector(qType === 'text' || qType === 'number' ? 'input-elmnt' : 'selector-elmnt').getInput()
        //     }
        //     this.currentQ++;
        //     this.ProgIndic.increment();
        //     this.container.children[1].remove();
        //     this.container.insertBefore(this.questions[this.currentQ], btn);
        //     if(this.currentQ === this.questions.length-1) {
        //         btn.disabled = true;
        //         this.showSubmitButton();
        //     }
        // };
        // this.container.appendChild(this.ProgIndic);
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