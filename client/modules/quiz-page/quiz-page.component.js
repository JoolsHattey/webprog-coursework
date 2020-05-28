'use strict';

import { Component } from '../../components/component.js';
import { Quiz } from './quiz/quiz.component.js';
import { Card } from '../../components/card/card.component.js';

export class QuizPage extends Component {
  constructor(req) {
    super({
      stylesheet: '/modules/quiz-page/quiz-page.component.css',
    });
    this.elLoaded = this.initElement(req);
  }

  async initElement(req) {
    this.container.classList.add('page');
    const res = await fetch(`/api/questionnaires/${req.params.quizID}`);
    if (res.ok) {
      const quizData = await res.json();
      const q = new Quiz(req.params.quizID, quizData);
      this.container.appendChild(q);
      document.title = quizData.name;
    } else {
      document.title = 'Error - Quiz not found';
      const quizNotFoundCard = new Card();
      quizNotFoundCard.classList.add('quizNotFoundCard');
      quizNotFoundCard.createTitle('Quiz not found');
      this.container.append(quizNotFoundCard);
    }
  }
}

window.customElements.define('quiz-screen', QuizPage);
