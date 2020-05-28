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
import { TouchDragList } from '../../../components/touch-drag-list/touch-drag-list.component.js';
import { EditableQuiz } from './editable-quiz/editable-quiz.component.js';
import { BottomSheet } from '../../components/bottom-sheet/bottom-sheet.component.js';
import { SnackBar } from '../../components/snack-bar/snack-bar.component.js';
import { getServerAuthCode } from '../../auth.js';

export class QuizEditor extends Component {
  constructor(req) {
    super({
      template: '/modules/quiz-editor/quiz-editor.component.html',
      stylesheet: '/modules/quiz-editor/quiz-editor.component.css',
    });
    this.elLoaded = this.initElement(req);
  }

  async initElement(req) {
    this.container.classList.add('mainBody');
    if (!req.params.quizID) {
      this.getQuestionnaireList();
    } else {
      this.getQuestionnaire(req.params.quizID, req.params.mode);
    }
    await this.loaded;
    this.appBar = $(this, 'app-bar');
    await this.appBar.loaded;
    $(this.appBar, '#editorHome').addEventListener('click', () => {
      $clear($(this, '#editor'));
      $clear($(this, '#quizsContainer'));
      history.pushState(history.state, '', '/quizeditor');
      document.title = 'Quiz Editor';
      this.getQuestionnaireList();
    });

    const newQuizBtn = $(this, '#newQuizBtn');
    const newQuizSheet = new BottomSheet({
      template: '/modules/quiz-editor/new-quiz-dialog.html',
      stylesheet: '/modules/quiz-editor/quiz-editor.component.css',
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
    const res = await fetch('/api/questionnaires', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'id_token': authCode,
      },
      body: JSON.stringify(quizData),
    });
    const quiz = await res.json();
    if (this.questionnaires.length > 0) {
      $(this, '#noQuizes').classList.add('hide');
    }
    routerInstance.navigate(`/quizeditor/${quiz.id}`);
  }

  async getQuestionnaireList() {
    const response = await fetch('/api/questionnaires');
    this.questionnaires = await response.json();
    const container = $(this, '#quizsContainer');
    const deleteSheet = new BottomSheet({
      template: '/modules/quiz-editor/delete-quiz-sheet.html',
      stylesheet: '/modules/quiz-editor/quiz-editor.component.css',
    });
    if (this.questionnaires.length === 0) {
      $(this, '#noQuizes').classList.remove('hide');
    }
    for (const element of this.questionnaires) {
      const quizItem = new Card({
        stylesheet: '/modules/quiz-editor/quiz-editor.component.css',
        template: '/modules/quiz-editor/quiz-item.html',
      });
      await quizItem.loaded;
      $(quizItem, 'p').append(`ID: ${element.uid}`);
      $(quizItem, 'h3').append(element.name);
      container.appendChild(quizItem);
      quizItem.addEventListener('click', () => {
        $clear($(this, '#quizsContainer'));
        history.pushState(history.state, '', `/quizeditor/${element.uid}`);
        this.getQuestionnaire(element.uid);
      });
      $(quizItem, '#deleteBtn').addEventListener('click', e => {
        e.stopPropagation();
        $(deleteSheet, 'p').textContent = `Are you sure you want to delete ${element.name}`;
        deleteSheet.open();
        deleteSheet.afterClose(e => {
          if (e) {
            this.deleteQuiz(element.uid);
          }
        });
      });
    }
    container.classList.remove('hide');
    $(this, '#quizList').classList.remove('hide');
    $(this, '#editor').classList.add('hide');
    $(this, 'progress-spinner').classList.add('hide');
    this.appBar.closeExpanded();
  }

  async getQuestionnaire(uid) {
    const request = await fetch(`/api/questionnaires/${uid}`);
    const quesitonnaire = await request.json();
    const authCode = await getServerAuthCode();
    const req = await fetch(`/api/questionnaires/${uid}/responses`, {
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

  async deleteQuiz(uid) {
    const authCode = await getServerAuthCode();
    const res = await fetch(`/api/questionnaires/${uid}`, {
      method: 'DELETE',
      headers: {
        id_token: authCode,
      },
    });
    const deletedSnack = new SnackBar();
    if (res.ok) {
      deletedSnack.addTitle('Successfully deleted quiz');
      let index;
      this.questionnaires.some((element, i) => {
        if (element.uid === uid) {
          return (index = i);
        }
      });
      this.questionnaires.splice(index, 1);
      $(this, '#quizsContainer').children[index].remove();
      if (this.questionnaires.length === 0) {
        $(this, '#noQuizes').classList.remove('hide');
      }
    } else {
      deletedSnack.addTitle('Error deleting quiz');
    }
    deletedSnack.show(4000);
  }
}

window.customElements.define('quiz-editor', QuizEditor);
