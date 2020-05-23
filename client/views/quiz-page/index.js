'use strict';

import { Component } from '../../components/component.js';
import { Quiz } from '../../components/quiz/quiz.component.js';

export class QuizPage extends Component {
  constructor(req) {
    super({
      stylesheet: '/views/quiz-page/styles.css',
    });
    this.elLoaded = this.initElement(req);
  }

  async initElement(req) {
    this.container.classList.add('page');
    const request = await fetch(`/api/questionnaires/${req.params.quizID}`);
    const quizData = await request.json();
    const q = new Quiz(req.params.quizID, quizData);
    this.container.appendChild(q);
    document.title = quizData.name;
  }
}

window.customElements.define('quiz-screen', QuizPage);
