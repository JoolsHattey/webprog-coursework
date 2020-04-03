"use strict";

import { Component } from '../component.js';
import { Card } from '../card/index.js';
import { Input } from '../input/index.js';
import { Selector } from '../selector/index.js';
import { ProgressIndicator } from '../progress-indicator/index.js';

export class Questionnaire extends Component {
    constructor(questionnaireData, uid) {
        super();
        this.initElement(questionnaireData, uid);
    }

    initElement(questionnaireData, uid) {
        this.uid = uid;
        this.response = { "questions": [] };
        this.currentQ = 0;
        this.questions = new Array;
        this.createTitle(questionnaireData.name);
        if(questionnaireData) {
            questionnaireData.questions.forEach(item => {
                const q = this.createQuestion(item);
                this.questions.push(q);
            });
        }
        this.container.appendChild(this.questions[0]);
        const btn = document.createElement("button");
        btn.append("Next");
        this.container.appendChild(btn);
        this.ProgIndic = new ProgressIndicator(this.questions.length);
        btn.onclick = (evt => {
            console.log(this.questions[this.currentQ])
            this.response.questions[this.currentQ] = {
                "id": this.questions[this.currentQ].id,
                "answer": this.questions[this.currentQ].getAnswer()

            }
            this.currentQ++;
            this.ProgIndic.increment();
            this.container.children[1].remove();
            this.container.insertBefore(this.questions[this.currentQ], btn);
            if(this.currentQ === this.questions.length-1) {
                btn.disabled = true;
                this.showSubmitButton();
            }
        });
        
        this.container.appendChild(this.ProgIndic);
    }

    createTitle(name) {
        const title = document.createElement("h4");
        title.append(name);
        this.container.appendChild(title);
    }

    showSubmitButton() {
        const submit = document.createElement("button");
        submit.append("Submit");
        submit.onclick = (evt => submitResponse(this.uid, this.response));
        this.container.appendChild(submit);
    }

    createQuestion(questionData) {
        this.question = new Card();
        this.question.createTitle(questionData.text);
        this.question.id = questionData.id;
        //this.container.classList.add("card");
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

    getAnswer() {
        if(this.input === Input) {
            return this.input.getInput();
        }
        
    }
}

customElements.define("quiz-item", Questionnaire);