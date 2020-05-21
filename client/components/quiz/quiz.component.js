'use strict';

import { Component } from '../component.js';
import { Card } from '../card/card.component.js';
import { TextInput } from '../text-input/text-input.component.js';
import { CheckboxGroup } from '../checkbox/checkbox-group.component.js';
import { RadioGroup } from '../radio-selector/radio-selector.component.js';
import { $ } from '../../app.js';
import { SnackBar } from '../snack-bar/snack-bar.component.js';
import { CardStack } from '../../components/card-stack/card-stack.component.js';

export class Quiz extends Component {
  constructor(quizID, quizData) {
    super({
      template: '/components/quiz/quiz.component.html',
      stylesheet: '/components/quiz/styles.css',
    });
    this.initElement(quizID, quizData);
  }

  async initElement(quizID, quizData) {
    await this.templatePromise;
    this.quizID = quizID;
    this.questions = quizData.questions;
    this.currentQ = 0;
    this.inputs = [];
    this.response = { questions: [], time: null };
    this.createTitleCard(quizData);
    this.createQuestionCards(quizData.questions);
  }

  createQuestionCards(questions) {
    const qCards = [];
    questions.forEach(element => {
      const question = new Card();
      question.id = element.id;
      const newInput = this.createInput(element);
      question.container.appendChild(newInput);
      qCards.push(question);
    });

    this.finishCard = new Card({
      template: '/components/quiz/quiz-finish.html',
    });
    qCards.push(this.finishCard);

    this.stack = new CardStack();
    $(this, '#cardStackContainer').appendChild(this.stack);
    this.stack.init(qCards);

    this.stack.addEventListener('lockrejected', e => {
      this.inputs[e.detail.currentCard].getValue();
    });

    for (const [i, input] of this.inputs.entries()) {
      if (questions[i].required) {
        input.addEventListener('validinput', e => {
          this.stack.lockNext = !e.detail.valid;
        });
      }
    }

    this.progress = $(this, 'progress');

    let stackVisible = false;
    this.nextBtnEvent = () => {
      this.stack.next();
      if (!stackVisible) {
        stackVisible = true;
        if (questions[0].required) this.stack.lockNext = true;
      }
    };
    this.submitBtnEvent = () => this.submitResponse();

    $(this, '#nextBtn').addEventListener('click', this.nextBtnEvent);
    $(this, '#backBtn').addEventListener('click', () => this.stack.prev());
    $(this, '#backBtn').disabled = true;

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes') {
          if (mutation.target.currentCard > this.currentQ) {
            if (questions[this.currentQ + 1]) {
              if (questions[this.currentQ + 1].required) {
                this.stack.lockNext = true;
              }
            }
            this.nextQuestion();
          } else if (mutation.target.currentCard < this.currentQ) {
            this.previousQuestion();
          } else {
            $(this, '#nextBtn').textContent = 'Next';
            this.progress.setAttribute('value', ((1 / this.questions.length) * 100));
          }
        }
      });
    });

    observer.observe(this.stack, {
      attributes: true,
    });
  }

  async createTitleCard(quizData) {
    const titleCard = new Card({
      template: '/components/quiz/quiz-title.html',
      stylesheet: '/components/quiz/styles.css',
    });
    await titleCard.templatePromise;
    $(titleCard, '#title').append(quizData.name);
    $(titleCard, '#numQ').append(`${quizData.questions.length} Questions`);
    $(this, '#titleCard').appendChild(titleCard);
    // const infoDialog = new ModalCard({
    //     template: '/components/quiz/quiz-tutorial-dialog.html',
    //     stylesheet: '/components/quiz/styles.css'
    // }, null, '70%', '60%');
    // $(titleCard, '#infoBtn').addEventListener('click', () => infoDialog.open())
  }

  createInput(questionData) {
    let input;
    switch (questionData.type) {
      case 'text':
        input = new TextInput();
        input.size = 'singleline';
        input.id = questionData.id;
        input.setLabel(questionData.text);
        break;
      case 'number':
        input = new TextInput();
        input.size = 'singleline';
        break;
      case 'single-select':
        input = new RadioGroup(questionData.options);
        break;
      case 'multi-select':
        input = new CheckboxGroup(questionData.options);
        break;
    }
    input.required = questionData.required;
    // Input elements are stored in array which can be easily accessed with question counter
    this.inputs.push(input);
    return input;
  }

  nextQuestion() {
    // Check if next input is already filled to prevent stack from locking
    // E.g. if user is reviewing quetions
    if (this.currentQ < this.questions.length - 1) {
      if (this.inputs[this.currentQ + 1].validInput) {
        this.stack.lockNext = false;
      }
    }
    if (this.currentQ >= 0) {
      const inputValue = this.inputs[this.currentQ].getValue();
      this.response.questions[this.currentQ] = {
        id: this.questions[this.currentQ].id,
        answer: inputValue,
      };
    }
    this.currentQ++;
    this.progress.setAttribute('value', (((this.currentQ + 1) / this.questions.length) * 100));
    // Change buttons based on question number
    if (this.currentQ === this.questions.length - 1) {
      $(this, '#nextBtn').textContent = 'Review';
    } else if (this.currentQ === this.questions.length) {
      $(this, '#nextBtn').textContent = 'Submit';
      $(this, '#nextBtn').removeEventListener('click', this.nextBtnEvent);
      $(this, '#nextBtn').addEventListener('click', this.submitBtnEvent);
    } else if (this.currentQ === 1) {
      $(this, '#backBtn').disabled = false;
    }
  }

  previousQuestion() {
    this.currentQ--;
    this.progress.setAttribute('value', (((this.currentQ + 1) / this.questions.length) * 100));
    if (this.currentQ === this.questions.length - 1) {
      $(this, '#nextBtn').textContent = 'Review';
      $(this, '#nextBtn').removeEventListener('click', this.submitBtnEvent);
      $(this, '#nextBtn').addEventListener('click', this.nextBtnEvent);
    } else if (this.currentQ === this.questions.length - 2) {
      $(this, '#nextBtn').textContent = 'Next';
    } else if (this.currentQ === -1) {
      $(this, '#backBtn').disabled = true;
    }
  }

  async submitResponse() {
    $(this.finishCard, '#afterSubmit').classList.remove('hide');
    $(this.finishCard, '#beforeSubmit').classList.add('hide');

    this.response.time = Date.now();

    console.log(this.quizID, this.response);


    $(this, '#nextBtn').disabled = true;
    $(this, '#backBtn').disabled = true;

    const res = await fetch(`/api/submitresponse/${this.quizID}`, {
      method: 'POST',
      body: JSON.stringify(this.response),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.ok) {
      const completeSnack = new SnackBar();
      completeSnack.addTitle('Quiz submitted');
      completeSnack.show(5000);
    } else {
      const errorSnack = new SnackBar();
      errorSnack.addTitle('Error Submitting Quiz');
      errorSnack.show(5000);
      $(this, '#nextBtn').disabled = false;
    }
  }
}

window.customElements.define('quiz-item', Quiz);
