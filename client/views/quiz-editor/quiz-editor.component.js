/* eslint-disable no-unused-vars */
'use strict';

import { Component } from '../../components/component.js';
import { $, routerInstance, $clear } from '../../app.js';
import { Card } from '../../components/card/card.component.js';
import { Toggle } from '../../components/toggle/toggle.component.js';
import { AppBar } from '../../components/app-bar/app-bar.component.js';
import { TextInput } from '../../components/text-input/text-input.component.js';
import { Dropdown } from '../../components/dropdown/dropdown.component.js';
import { Checkbox } from '../../components/checkbox/checkbox.component.js';
import { EditableQuiz } from '../../components/editable-quiz/editable-quiz.component.js';
import { BottomSheet } from '../../components/bottom-sheet/bottom-sheet.component.js';
import { SnackBar } from '../../components/snack-bar/snack-bar.component.js';
import { getServerAuthCode } from '../../auth.js';

export class QuizEditor extends Component {
  constructor(req) {
    super({
      template: '/views/quiz-editor/quiz-editor.component.html',
      stylesheet: '/views/quiz-editor/quiz-editor.component.css',
    });
    this.elLoaded = this.initElement(req);
  }

  async initElement(req) {
    if (!req.params.quizID) {
      this.getQuestionnaireList();
    } else {
      this.getQuestionnaire(req.params.quizID, req.params.mode);
    }
    await this.templatePromise;
    this.appBar = $(this, 'app-bar');
    await this.appBar.templatePromise;
    $(this.appBar, '#editorHome').addEventListener('click', () => {
      $clear($(this, '#editor'));
      $clear($(this, '#quizsContainer'));
      history.pushState(history.state, '', '/quizeditor');
      this.getQuestionnaireList();
    });

    const newQuizBtn = $(this, '#newQuizBtn');
    const newQuizSheet = new BottomSheet({
      template: '/views/quiz-editor/new-quiz-dialog.html',
      stylesheet: '/views/quiz-editor/quiz-editor.component.css',
    });
    newQuizBtn.addEventListener('click', () => {
      newQuizSheet.open();
      newQuizSheet.afterClose(e => {
        if (e) {
          const file = $(newQuizSheet, 'input').files[0];
          if (file) {
            if (file.type === 'application/json') {
              file.text().then(textFile => {
                this.createNewQuiz(JSON.parse(textFile));
              });
            } else {
              const errorSnack = new SnackBar();
              errorSnack.addTitle('File must be JSON format');
              errorSnack.show(5000);
            }
          } else {
            this.createNewQuiz();
          }
        }
      });
    });
  }

  async createNewQuiz(quizData) {
    if (!quizData) {
      quizData = {
        name: 'Untitled Questionnaire',
        questions: [],
        saveTime: Date.now(),
      };
    } else {
      quizData.saveTime = Date.now();
    }
    const authCode = await getServerAuthCode();
    const res = await fetch('/api/createquestionnaire', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'id_token': authCode,
      },
      body: JSON.stringify(quizData),
    });
    const quiz = await res.json();
    routerInstance.navigate(`/quizeditor/${quiz.id}`);
  }

  async getQuestionnaireList() {
    const response = await fetch('/api/questionnaires');
    const data = await response.json();
    const container = $(this, '#quizsContainer');
    for (const element of data) {
      const quizItem = new Card({
        stylesheet: '/views/quiz-editor/quiz-editor.component.css',
        template: '/views/quiz-editor/quiz-item.html',
      });
      await quizItem.templatePromise;
      $(quizItem, 'p').append(`ID: ${element.uid}`);
      $(quizItem, 'h3').append(element.name);
      container.appendChild(quizItem);
      quizItem.addEventListener('click', () => {
        $clear($(this, '#quizsContainer'));
        history.pushState(history.state, '', `/quizeditor/${element.uid}`);
        this.getQuestionnaire(element.uid);
      });
    }
    container.classList.remove('hide');
    $(this, '#quizList').classList.remove('hide');
    $(this, '#editor').classList.add('hide');
    $(this, 'progress-spinner').classList.add('hide');
    this.appBar.closeExpanded();
  }

  async getQuestionnaire(uid) {
    const request = await fetch(`/api/questionnaire/${uid}`);
    const quesitonnaire = await request.json();
    const authCode = await getServerAuthCode();
    const req = await fetch(`/api/responses/${uid}`, {
      headers: {
        id_token: authCode,
      },
    });
    const responses = await req.json();
    const q = new EditableQuiz(uid, quesitonnaire, responses, this.appBar);
    $(this, '#editor').appendChild(q);
    $(this, '#quizList').classList.add('hide');
    $(this, '#editor').classList.remove('hide');
  }
}

window.customElements.define('quiz-editor', QuizEditor);
