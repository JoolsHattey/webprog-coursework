'use strict';

import { Component } from '../../../components/component.js';
import { $, $r, html } from '../../../app.js';
import { Card } from '../../../components/card/card.component.js';
import { SnackBar } from '../../../components/snack-bar/snack-bar.component.js';
import { PieChart } from '../../../components/chart/pie-chart.component.js';
import { BarChart } from '../../../components/chart/bar-chart.component.js';
import { BottomSheet } from '../../../components/bottom-sheet/bottom-sheet.component.js';
import { getGoogleDriveAuth, getServerAuthCode } from '../../../auth.js';

export class EditableQuiz extends Component {
  constructor(uid, quizData, responseData, appBar) {
    super({
      template: '/modules/quiz-editor/editable-quiz/editable-quiz.component.html',
      stylesheet: '/modules/quiz-editor/editable-quiz/editable-quiz.component.css',
    });
    this.initElement(uid, quizData, responseData, appBar);
  }

  async initElement(uid, quizData, responseData, appBar) {
    document.title = `${quizData.name} - Quiz Editor`;
    await this.templatePromise;
    this.appBar = appBar;
    this.id = uid;
    /** @type {Questionnaire} */
    this.data = quizData;
    /** @type {Response[]} */
    this.responses = responseData;
    this.appBar.expand();
    $(this.appBar, 'text-input').setValue(quizData.name);
    $(this.appBar, 'text-input').setOnChange(e => {
      this.data.name = e.target.value;
      this.unsavedChanges();
    });
    $(this.appBar, '#responsesBtn').addEventListener('click', () => this.responsesTab());
    $(this.appBar, '#questionsBtn').addEventListener('click', () => this.questionsTab());
    $(this.appBar, '#previewBtn').addEventListener('click', () => this.preview());
    $(this.appBar, '#saveBtn').addEventListener('click', () => this.save());
    const questionsContainer = $(this, '#editableQuestionsContainer');
    $(questionsContainer, '#newQ').addEventListener('click', () => this.createQuestion());
    this.initSaveStatus(quizData.saveTime);
    this.questionTouchList = $(this, 'touch-drag-list');
    this.questionTouchList.container.classList.add('questionList');
    this.questionTouchList.addEventListener('reorder', e => this.moveQuestion(e.detail.oldIndex, e.detail.newIndex));
    this.qCards = [];
    this.touchLists = [];
    this.questionTouchList.init('card-el', true);
    for (const [i, question] of quizData.questions.entries()) {
      await this.createQuestion(i, question);
    }
    questionsContainer.classList.remove('hide');
    $(this, 'progress-spinner').remove();
    this.initShareDialog();
    this.initResponsesTab();
  }

  moveQuestion(oldIndex, newIndex) {
    if (newIndex >= this.data.questions.length) {
      let k = newIndex - this.data.questions.length + 1;
      while (k--) {
        this.data.questions.push(undefined);
      }
    }
    this.data.questions.splice(newIndex, 0, this.data.questions.splice(oldIndex, 1)[0]);
    console.log(this.data.questions);
    this.unsavedChanges();
  }

  preview() {
    const link = html('a');
    link.href = `/quiz/${this.id}`;
    link.target = '_blank';
    link.click();
  }

  initSaveStatus(saveTime) {
    const lastSavedTime = $(this.appBar, '#saveStatus');
    const lastSaved = new Date(saveTime);
    const currentTime = Date.now();
    const time = currentTime - saveTime;
    if (time < 60000) {
      lastSavedTime.textContent = 'Last saved less than a minute ago';
    } else if (time < 3600000) {
      lastSavedTime.textContent = `Last saved ${Math.ceil(time / 60000)} minutes ago`;
    } else {
      lastSavedTime.textContent = `Last saved ${lastSaved.getDate()}/${lastSaved.getMonth() + 1}/${lastSaved.getFullYear()} ${lastSaved.getHours()}:${lastSaved.getMinutes() < 10 ? '0' + lastSaved.getMinutes() : lastSaved.getMinutes()}`;
    }
  }

  unsavedChanges() {
    $(this.appBar, '#saveBtn').disabled = false;
  }

  async save() {
    $(this.appBar, '#saveStatus').textContent = 'Saving...';
    const saveTime = Date.now();
    this.data.saveTime = saveTime;
    const authCode = await getServerAuthCode();
    await fetch(`/api/questionnaires/${this.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'id_token': authCode,
      },
      body: JSON.stringify(this.data),
    });
    $(this.appBar, '#saveBtn').disabled = true;
    this.initSaveStatus(saveTime);
  }

  initShareDialog() {
    const quizURL = `${window.location.host}/quiz/${this.id}`;
    const shareModal = new BottomSheet({
      template: '/modules/quiz-editor/editable-quiz/quiz-share-dialog.html',
      stylesheet: '/modules/quiz-editor/editable-quiz/editable-quiz.component.css',
    });

    $(this.appBar, '#shareBtn').addEventListener('click', () => {
      shareModal.open();
      $(shareModal, 'text-input').setValue(quizURL);
      $(shareModal, '#clipboardBtn').addEventListener('click', () => {
        navigator.clipboard.writeText(quizURL);
        const snackBar = new SnackBar();
        snackBar.addTitle('Link copied to clipboard');
        snackBar.show(5000);
      });
    });
  }

  questionsTab() {
    $(this.appBar, '#questionsBtn').classList.add('selected');
    $(this.appBar, '#responsesBtn').classList.remove('selected');
    $(this, '#responsesContainer').classList.add('hide');
    $(this, '#editableQuestionsContainer').classList.remove('hide');
  }

  responsesTab() {
    $(this.appBar, '#responsesBtn').classList.add('selected');
    $(this.appBar, '#questionsBtn').classList.remove('selected');
    $(this, '#editableQuestionsContainer').classList.add('hide');
    $(this, '#responsesContainer').classList.remove('hide');
  }

  async exportToGoogleDrive() {
    const snack = new SnackBar();
    snack.setAttribute('loading', 'true');
    snack.addTitle('Creating Google Sheet');
    snack.show();
    const authCode = await getGoogleDriveAuth();
    const serverAuthCode = await getServerAuthCode();
    const res = await fetch(`/api/questionnaires/${this.id}/responses/export/drive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'id_token': serverAuthCode,
      },
      body: JSON.stringify({ apiToken: authCode }),
    });
    if (res.ok) {
      snack.hide();
      const successSnack = new SnackBar();
      successSnack.addTitle('Successfully created Google Sheet');
      successSnack.addLink('Open', (await res.json()).url);
      successSnack.show();
    } else {
      snack.hide();
      const errorSnack = new SnackBar();
      errorSnack.addTitle('Error creating Google Sheet');
      errorSnack.show(4000);
    }
  }

  async exportResponses() {
    const serverAuthCode = await getServerAuthCode();
    const res = await fetch(`/api/questionnaires/${this.id}/responses/export/csv`, {
      headers: {
        id_token: serverAuthCode,
      },
    });
    if (res.ok) {
      const data = await res.text();
      const link = document.createElement('a');
      link.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(data)}`);
      link.setAttribute('download', `${this.data.name} - Responses.csv`);
      link.click();
    } else {
      const errorSnack = new SnackBar();
      errorSnack.addTitle('Error exporting responses');
      errorSnack.show(4000);
    }
  }

  async initResponsesTab() {
    const responsesCard = new Card({
      template: '/modules/quiz-editor/editable-quiz/quiz-responses-title-card.html',
      stylesheet: '/modules/quiz-editor/editable-quiz/editable-quiz.component.css',
    });
    await responsesCard.templatePromise;
    $(this, '#responsesContainer').appendChild(responsesCard);
    const numResponses = this.responses.length;
    $(responsesCard, '#title').append(`${numResponses} ${numResponses === 1 ? 'Response' : 'Responses'}`);
    if (numResponses === 0) {
      $(responsesCard, '#exportLocalBtn').disabled = true;
      $(responsesCard, '#exportDriveBtn').disabled = true;
    }
    $(responsesCard, '#exportLocalBtn').addEventListener('click', () => this.exportResponses());
    $(responsesCard, '#exportDriveBtn').addEventListener('click', () => this.exportToGoogleDrive());
    if (numResponses > 0) {
      for (const [i, question] of this.data.questions.entries()) {
        const questionResponseCard = new Card({
          template: '/modules/quiz-editor/editable-quiz/quiz-responses-question-card.html',
          stylesheet: '/modules/quiz-editor/editable-quiz/editable-quiz.component.css',
        });
        await questionResponseCard.templatePromise;
        $(this, '#responsesContainer').append(questionResponseCard);
        $(questionResponseCard, '#title').append(question.text);
        const questionResponses = [];
        this.responses.forEach(response => {
          questionResponses.push(response.questions[i].answer);
        });
        const chartContainer = $(questionResponseCard, '#questionResponses');

        switch (question.type) {
          case 'single-select':
            const chart = new PieChart(this.sortRadioSelectorResponses(questionResponses)[1], this.sortRadioSelectorResponses(questionResponses)[0]);
            chartContainer.append(chart);
            break;
          case 'multi-select':
            chartContainer.append(new BarChart(this.sortCheckBoxResponses(questionResponses, question.options)));
            break;
          default:
            questionResponses.forEach(item => {
              if (item) {
                const thing = document.createElement('div');
                thing.append(item);
                chartContainer.classList.add('textResponses');
                chartContainer.append(thing);
              }
            });
            break;
        }
      }
    } else {
      const noResponses = new Card();
      noResponses.createTitle('Waiting for responses');
      $(this, '#responsesContainer').append(noResponses);
    }
  }

  sortRadioSelectorResponses(arr) {
    const a = []; const b = []; let prev;

    arr.sort();
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== prev) {
        a.push(arr[i]);
        b.push(1);
      } else {
        b[b.length - 1]++;
      }
      prev = arr[i];
    }
    return [a, b];
  }

  sortCheckBoxResponses(arr, options) {
    const result = {};
    options.forEach(element => {
      result[element] = 0;
    });
    arr.forEach(innerArr => {
      innerArr.forEach(item => {
        if (result[item]) {
          result[item]++;
        } else {
          result[item] = 1;
        }
      });
    });
    return result;
  }

  initAnswerOptionList(q, index) {
    const answerOptionsContainer = $(q, '#questionAnswers');
    const newAnswerOptionBtn = $(answerOptionsContainer, '#newOptionBtn');

    newAnswerOptionBtn.children[0].initElement();
    answerOptionsContainer.classList.remove('hide');
    const touchList = $(q, 'touch-drag-list');
    touchList.addStyleSheet('/modules/quiz-editor/editable-quiz/editable-quiz.component.css');
    touchList.init('qAnswerItem');
    touchList.addEventListener('reorder', e => {
      this.moveOption(index, e.detail.oldIndex, e.detail.newIndex);
    });
    this.touchLists[index] = touchList;
    newAnswerOptionBtn.onclick = () => {
      console.log(this.data.questions[index].options);
      this.createAnswerOption(answerOptionsContainer, null, this.data.questions[index].type, true, this.data.questions[index].options.length, index);
    };
  }

  /**
   * Creates quiz card and appends to container
   * @param {number} index
   * @param {Questionnaire} questionData
   */
  async createQuestion(index, questionData) {
    if (index === undefined) index = this.data.questions.length;
    if (!questionData) {
      questionData = {
        id: `id${this.data.questions.length}`,
        text: 'Question',
        type: 'text',
      };
      this.data.questions.push(questionData);
      this.unsavedChanges();
    }
    const q = new Card({
      template: '/modules/quiz-editor/editable-quiz/question.html',
      stylesheet: '/modules/quiz-editor/editable-quiz/editable-quiz.component.css',
    });

    q.index = index;
    await q.templatePromise;
    this.questionTouchList.addItem(q, '#dragHandle');
    const questionIDInput = $(q, '#questionID');
    questionIDInput.setValue(questionData.id);
    questionIDInput.setOnChange(e => {
      this.data.questions[index].id = e.target.value;
      this.unsavedChanges();
    });
    const questionTitleInput = $(q, '#questionTitle');
    questionTitleInput.setValue(questionData.text);
    questionTitleInput.setOnChange(e => {
      this.data.questions[index].text = e.target.value;
      this.unsavedChanges();
    });
    const answerOptionsContainer = $(q, '#questionAnswers');
    const newAnswerOptionBtn = $(answerOptionsContainer, '#newOptionBtn');
    if (questionData.type === 'single-select' || questionData.type === 'multi-select') {
      if (this.data.questions[index].type === 'single-select') {
        newAnswerOptionBtn.children[0].textContent = 'radio';
      } else if (this.data.questions[index].type === 'multi-select') {
        newAnswerOptionBtn.children[0].textContent = 'check_box';
      }
      this.initAnswerOptionList(q, index);
      for (const [i, opt] of questionData.options.entries()) {
        await this.createAnswerOption(answerOptionsContainer, opt, questionData.type, false, i, index);
      }
    } else {
      this.touchLists.push(null);
    }
    const dropDown = $(q, 'dropdown-el');
    dropDown.setOptions([
      { value: 'text',
        text: 'Text input' },
      { value: 'number',
        text: 'Number input' },
      { value: 'single-select',
        text: 'Multiple choice' },
      { value: 'multi-select',
        text: 'Checkboxes' },
    ]);
    dropDown.setValue(questionData.type);
    dropDown.setOnChange((e) => {
      if (e.target.value === 'single-select') {
        if (this.data.questions[index].type === 'multi-select') {
          this.touchLists[index].removeAllItems();
        }
        if (!this.data.questions[index].options || this.data.questions[index].type === 'multi-select') {
          this.initAnswerOptionList(q, index);
          this.createAnswerOption(answerOptionsContainer, null, e.target.value, true, 0, index);
        }
        answerOptionsContainer.classList.remove('hide');
        newAnswerOptionBtn.children[0].textContent = 'radio';
      } else if (e.target.value === 'multi-select') {
        if (this.data.questions[index].type === 'single-select') {
          this.touchLists[index].removeAllItems();
        }
        if (!this.data.questions[index].options || this.data.questions[index].type === 'single-select') {
          this.initAnswerOptionList(q, index);
          this.createAnswerOption(answerOptionsContainer, null, e.target.value, true, 0, index);
        }
        answerOptionsContainer.classList.remove('hide');
        newAnswerOptionBtn.children[0].textContent = 'check_box';
      } else {
        answerOptionsContainer.classList.add('hide');
        this.touchLists[index].removeAllItems();
        this.data.questions[index].options = null;
      }
      this.data.questions[index].type = e.target.value;
      newAnswerOptionBtn.children[0].initElement();
      this.unsavedChanges();
    });

    const requiredToggle = $(q, 'toggle-el');
    requiredToggle.setValue(questionData.required);
    requiredToggle.setOnChange((e) => {
      this.data.questions[index].required = e.target.checked;
      this.unsavedChanges();
    });
    $(q, '#deleteBtn').addEventListener('click', () => this.deleteQuestion(index));
    $(q, '#duplicateBtn').addEventListener('click', () => this.duplicateQuestion(index));

    this.qCards.push(q);
  }

  deleteQuestion(index) {
    this.questionTouchList.removeItem(this.qCards[index]);
    this.data.questions.splice(index, 1);
    console.log(this.data.questions);
    this.unsavedChanges();
  }

  duplicateQuestion(index) {
    this.createQuestion(index + 1, this.data.questions[index]);
    this.data.questions.splice(index + 1, 0, this.data.questions[index]);
    Array.from(this.questionsContainer.children).forEach(element => {
      if (element.index > index) {
        element.index++;
      }
    });
    this.unsavedChanges();
  }

  async createAnswerOption(answerContainer, name, type, newItem, optionIndex, questionIndex) {
    const el = await $r('div', '/modules/quiz-editor/editable-quiz/quiz-answer-option.html');
    el.classList.add('qAnswerItem');
    const textInput = $(el, 'text-input');
    if (name === null) {
      name = `Option ${optionIndex + 1}`;
    }
    this.touchLists[questionIndex].addItem(el, '.answerOptionDragHandle');
    textInput.setValue(name);
    el.index = optionIndex;
    const answerTypeIcon = $(el, '.answerTypeIcon');
    if (type === 'single-select') {
      answerTypeIcon.append('radio');
    } else {
      answerTypeIcon.append('check_box');
    }
    if (newItem) {
      await textInput.sizeNotInit;
      textInput.inputEl.focus();
      if (this.data.questions[questionIndex].options) {
        this.data.questions[questionIndex].options[optionIndex] = name;
      } else {
        this.data.questions[questionIndex].options = [];
        this.data.questions[questionIndex].options[optionIndex] = name;
      }
    }
    textInput.setOnChange(e => {
      this.data.questions[questionIndex].options[optionIndex] = e.target.value;
    });
    $(el, 'button').onclick = () => {
      // answerContainer.children[0].removeChild(el);
      this.touchLists[questionIndex].removeItem(el, optionIndex);
      this.data.questions[questionIndex].options.splice(optionIndex, 1);
    };
    this.unsavedChanges();
  }

  moveOption(qIndex, oldIndex, newIndex) {
    if (newIndex >= this.data.questions[qIndex].options.length) {
      let k = newIndex - this.data.questions[qIndex].options.length + 1;
      while (k--) {
        this.data.questions[qIndex].options.push(undefined);
      }
    }
    this.data.questions[qIndex].options.splice(newIndex, 0, this.data.questions[qIndex].options.splice(oldIndex, 1)[0]);
    this.unsavedChanges();
  }
}
window.customElements.define('editable-quiz', EditableQuiz);

/**
 * @typedef {Object} Questionnaire
 * @property {string} name
 * @property {Question[]} questions
 * @property {number} saveTime
 */

/**
 * @typedef {Object} Question
 * @property {string} id
 * @property {string} text
 * @property {string} type
 * @property {string[]} [options]
 * @property {boolean} required
 */

/**
 * @typedef {Object} Response
 * @property {Object[]} questions
 */
