'use strict';

import { Component } from "../component.js";
import { Card } from "../card/card.component.js";
import { TextInput } from "../text-input/text-input.component.js";
import { CheckboxGroup } from "../checkbox/checkbox-group.component.js";
import { RadioGroup } from "../radio-selector/radio-selector.component.js";
import { $ } from "../../app.js";
import { SnackBar } from "../snack-bar/snack-bar.component.js";
import { CardStack } from '../../components/card-stack/card-stack.component.js'

export class Quiz extends Component {
    constructor(quizID, quizData) {
        super({
            template: '/components/quiz/quiz.component.html',
            stylesheet: '/components/quiz/styles.css'
        });
        this.initElement(quizID, quizData);
    }

    async initElement(quizID, quizData) {
        await this.templatePromise;
        this.quizID = quizID;
        this.questions = quizData.questions;
        this.currentQ = 0;
        this.answerArray = new Array;
        this.response = { questions: [], time: null };
        this.createTitleCard(quizData);
        this.createQuestionCards(quizData.questions);
        this.completeSnack = new SnackBar();
        this.completeSnack.addTitle('Quiz submitted');
    }

    async createQuestionCards(questions) {
        const qCards = new Array;
        questions.forEach(element => {
            const question = new Card();
            const qLabel = document.createElement('label');
            qLabel.for = element.id;
            qLabel.append(element.text)
            question.container.appendChild(qLabel)
            question.id = element.id;
            question.container.appendChild(this.createInput(element));
            qCards.push(question);
        });

        const finishCard = new Card({
            template: '/components/quiz/quiz-finish.html'
        });
        qCards.push(finishCard);

        this.stack = new CardStack();
        $(this, '#cardStackContainer').appendChild(this.stack);
        this.stack.init(qCards);

        this.progress = $(this, 'progress');

        this.nextBtnEvent = () => this.stack.next();
        this.submitBtnEvent = () => this.submitResponse();

        $(this, '#nextBtn').addEventListener('click', this.nextBtnEvent);
        $(this, '#backBtn').addEventListener('click', () => this.stack.prev());
        $(this, '#backBtn').disabled = true;

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if(mutation.type == "attributes") {
                    if(mutation.target.currentCard > this.currentQ) {
                        this.nextQuestion();
                    } else if(mutation.target.currentCard < this.currentQ) {
                        this.previousQuestion();
                    } else {
                        $(this, '#nextBtn').textContent = 'Next';
                        this.progress.setAttribute('value', ((1 / this.questions.length) * 100));
                    }
                }
            })
        })

        observer.observe(this.stack, {
            attributes: true
        });
    }

    async createTitleCard(quizData) {
        const titleCard = new Card({
            template: '/components/quiz/quiz-title.html',
            stylesheet: '/components/quiz/styles.css'
        });
        await titleCard.templatePromise;
        $(titleCard, '#title').append(quizData.name);
        $(titleCard, '#numQ').append(`${quizData.questions.length} Questions`)
        $(this, '#titleCard').appendChild(titleCard)
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
        this.answerArray.push(input);
        return input;
    }

    nextQuestion() {
        if(this.currentQ >= 0) {
            const inputValue = this.answerArray[this.currentQ].getValue();
            this.response.questions[this.currentQ] = {
                id: this.questions[this.currentQ].id,
                answer: inputValue
            }
        }
        this.currentQ++;
        this.progress.setAttribute('value', (((this.currentQ+1) / this.questions.length) * 100));
        if(this.currentQ === this.questions.length-1) {
            $(this, '#nextBtn').textContent = 'Review';
        } else if(this.currentQ === this.questions.length) {
            $(this, '#nextBtn').textContent = 'Submit';
            $(this, '#nextBtn').removeEventListener('click', this.nextBtnEvent);
            $(this, '#nextBtn').addEventListener('click', this.submitBtnEvent);
        } else if(this.currentQ === 1) {
            $(this, '#backBtn').disabled = false;
        }
    }

    previousQuestion() {
        this.currentQ--;
        this.progress.setAttribute('value', (((this.currentQ+1) / this.questions.length) * 100))
        if(this.currentQ === this.questions.length-1) {
            $(this, '#nextBtn').textContent = 'Review';
            $(this, '#nextBtn').removeEventListener('click', this.submitBtnEvent);
            $(this, '#nextBtn').addEventListener('click', this.nextBtnEvent);
        } else if(this.currentQ === this.questions.length-2) {
            $(this, '#nextBtn').textContent = 'Next';
        } else if(this.currentQ === -1) {
            $(this, '#backBtn').disabled = true;
        }
    }

    async submitResponse() {

        this.response.time = Date.now();

        console.log(this.quizID, this.response);

        this.completeSnack.show(5000);

        $(this, '#nextBtn').disabled = true;
        $(this, '#backBtn').disabled = true;

        await fetch(`/api/submitresponse/${this.quizID}`, {
            method: 'POST',
            body: JSON.stringify(this.response),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

}

customElements.define('quiz-item', Quiz);