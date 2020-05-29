'use strict';

import { Component } from '../../../components/component.js';
import { Card } from '../../../components/card/card.component.js';
import { TextInput } from '../../../components/text-input/text-input.component.js';
import { CheckboxGroup } from '../../../components/checkbox/checkbox-group.component.js';
import { RadioGroup } from '../../../components/radio-selector/radio-selector.component.js';
import { routerInstance } from '../../../app.js';
import { SnackBar } from '../../../components/snack-bar/snack-bar.component.js';
import { CardStack } from '../../../components/card-stack/card-stack.component.js';
import { getAdminStatus } from '../../../auth.js';
import { $ } from '../../../utils.js';

export class Quiz extends Component {
  constructor(quizID, quizData) {
    super({
      template: '/modules/quiz-page/quiz/quiz.component.html',
      stylesheet: '/modules/quiz-page/quiz/quiz.component.css',
    });
    this.initElement(quizID, quizData);
  }

  async initElement(quizID, quizData) {
    await this.loaded;
    this.quizID = quizID;
    this.questions = quizData.questions;
    this.currentQ = 0;
    this.inputs = [];
    this.response = { questions: [], time: null };
    this.createTitleCard(quizData);
    this.createQuestionCards(quizData.questions);
    const admin = await getAdminStatus();
    if (admin) {
      $(this, '#editFab').classList.remove('hide');
      $(this, '#editFab').addEventListener('click', () => routerInstance.navigate(`/quizeditor/${this.quizID}`));
    }
  }

  createQuestionCards(questions) {
    const qCards = [];
    questions.forEach(element => {
      const question = new Card();
      question.id = element.id;
      const newInput = this.createInput(element);
      question.container.append(newInput);
      qCards.push(question);
    });

    this.finishCard = new Card({
      template: '/modules/quiz-page/quiz/quiz-finish.html',
      stylesheet: '/modules/quiz-page/quiz/quiz.component.css',
    });
    qCards.push(this.finishCard);

    this.stack = new CardStack();
    this.stack.addStyleSheet('/modules/quiz-page/quiz/quiz.component.css');
    $(this, '#cardStackContainer').append(this.stack);
    this.stack.init(qCards);

    this.stack.addEventListener('lockrejected', e => {
      this.inputs[e.detail.currentCard].getValue();
    });

    this.inputs.forEach((input, i) => {
      if (questions[i].required) {
        input.addEventListener('validinput', e => {
          this.stack.lockNext = !e.detail.valid;
        });
      }
    });

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

    // Observes stack element for changes to current card attribute
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
    this.titleCard = new Card({
      template: '/modules/quiz-page/quiz/quiz-title.html',
      stylesheet: '/modules/quiz-page/quiz/quiz.component.css',
    });
    await this.titleCard.loaded;
    $(this.titleCard, '#title').append(quizData.name);
    $(this.titleCard, '#numQ').append(`${quizData.questions.length} ${quizData.questions.length === 1 ? 'Question' : 'Questions'}`);
    $(this, '#titleCard').append(this.titleCard);
  }

  createInput(questionData) {
    let input;
    switch (questionData.type) {
      case 'text':
        input = new TextInput();
        input.size = 'singleline';
        input.id = questionData.id;
        input.setInputStyle('filled');
        input.setLabel(questionData.text);
        break;
      case 'number':
        input = new TextInput();
        input.size = 'singleline';
        input.inputType = 'number';
        input.setInputStyle('filled');
        input.setLabel(questionData.text);
        break;
      case 'single-select':
        input = new RadioGroup(questionData.options);
        input.setLabel(questionData.text);
        break;
      case 'multi-select':
        input = new CheckboxGroup(questionData.options);
        input.setLabel(questionData.text);
        break;
    }
    input.required = questionData.required;
    // Input elements are stored in array which can be accessed with question counter
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
    }
    if (this.currentQ === this.questions.length) {
      $(this, '#nextBtn').textContent = 'Submit';
      $(this, '#nextBtn').removeEventListener('click', this.nextBtnEvent);
      $(this, '#nextBtn').addEventListener('click', this.submitBtnEvent);
    }
    if (this.currentQ === 1) {
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
    }
    if (this.currentQ === this.questions.length - 2) {
      $(this, '#nextBtn').textContent = 'Next';
    }
    if (this.currentQ === 0) {
      $(this, '#backBtn').disabled = true;
    }
  }

  async submitResponse() {
    $(this.finishCard, '#beforeSubmit').classList.add('hide');

    this.response.time = new Date().toISOString();

    console.log(this.quizID, this.response);


    $(this, '#nextBtn').disabled = true;
    $(this, '#backBtn').disabled = true;

    const res = await fetch(`/api/questionnaires/${this.quizID}/responses`, {
      method: 'POST',
      body: JSON.stringify(this.response),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.ok) {
      this.stack.disable();
      // $clear(this.stack.cards[this.questions.length].container);
      this.stack.cards[this.questions.length].style = '';
      this.stack.cards[this.questions.length].container.classList.add('animateSubmit');
      this.stack.cards[this.questions.length].classList.add('submitCard');
      this.stack.cards[this.questions.length].container.style.backgroundColor = 'transparent';
      // this.stack.disableStack();
      this.titleCard.classList.add('animateSubmitTitle');
      $(this, '#quizNavBtnContainer').classList.add('animateSubmitBottomBar');
      $(this.finishCard, '#afterSubmit').classList.add('drawn');
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
