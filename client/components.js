"use strict";


class Component extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({mode: 'open'});
        this._shadowRoot.innerHTML = `<link rel="stylesheet" href="styles.css">`;
        this._container = document.createElement("div");
        this._shadowRoot.appendChild(this._container);
    }
}


class Input extends Component {
    constructor(type) {
        super();
        const input = document.createElement("input");
        input.id = "response";
        if(type==="number") {
            input.setAttribute("type", "number");
        }
        this._container.appendChild(input);
    }
}


class Selector extends Component {
    constructor(options, type) {
        super();
        options.forEach(opt => {
            const container = document.createElement("div");
            const option = document.createElement("input");
            option.setAttribute("type", type);
            option.setAttribute("name", "name");
            option.setAttribute("value", opt);
            option.setAttribute("id", opt);
            const label = document.createElement("label");
            label.setAttribute("for", opt)
            label.textContent = opt
            container.appendChild(option);
            container.appendChild(label);
            
            this._container.appendChild(container);
        });
    }
}


class Question extends Component {
    constructor(question) {
        super();
        this._container.classList.add("card");
        this.initElement(question);
        this.createTitle(question.text);
        this.createInput(question);     
    }

    initElement(question) {
        this._container.id = question.id;
        this._id = question.id;
    }

    createTitle(name) {
        const title = document.createElement("h3");
        const titleContent = document.createTextNode(name);
        title.appendChild(titleContent);
        this._container.appendChild(title);
    }

    createInput(question) {
        let input;

        switch(question.type) {
            case "text":
                input = this.createTextInput()
                input.id = question.id;
                break;
            case "number":
                input = this.createNumberInput();
                break;
            case "single-select":
                input = this.createSingleSelectInput(question.options);
                break;
            case "multi-select":
                input = this.createMultiSelectInput(question.options);
                break;
        }
    
        this._container.appendChild(input);
    }
    createTextInput() {
        const form = new Input("text");
        return form;
    }
    createNumberInput() {
        const form = new Input("number");
        return form;
    }
    createMultiSelectInput(options) {
        const inputElement = new Selector(options, "checkbox");
        return inputElement;
    }
    createSingleSelectInput(options) {
        const inputElement = new Selector(options, "radio");
        return inputElement;
    }
}

class Questionnaire extends Component {
    constructor(questionnaireData, uid) {
        super();
        this.initElement(questionnaireData, uid);
    }

    initElement(questionnaireData, uid) {
        this._uid = uid;
        this._response = { "questions": [] };
        this._currentQ = 0;
        this._questions = new Array;
        this.createTitle(questionnaireData.name);
        if(questionnaireData) {
            questionnaireData.questions.forEach(item => {
                const q = new Question(item);
                this._questions.push(q);
            });
        }
        this._container.appendChild(this._questions[0]);
        const btn = document.createElement("button");
        btn.append("Next");
        this._container.appendChild(btn);
        btn.onclick = (evt => {
            console.log(this._questions[this._currentQ])
            this._response.questions[this._currentQ] = {
                "id": this._questions[this._currentQ]._id,
                "answer": this._questions[this._currentQ]._shadowRoot.children[1]._shadowRoot.children[0].value
            }
            this._currentQ++;
            this._container.children[1].remove();
            this._container.insertBefore(this._questions[this._currentQ], btn);
            if(this._currentQ === this._questions.length-1) {
                btn.disabled = true;
                this.showSubmitButton();
            }
        });
    }

    createTitle(name) {
        const title = document.createElement("h4");
        title.append(name);
        this._container.appendChild(title);
    }

    showSubmitButton() {
        const submit = document.createElement("button");
        submit.append("Submit");
        submit.onclick = (evt => submitResponse(this._uid, this._response));
        this._container.appendChild(submit);
    }
}

class QuestionnairePreview extends Component {
    constructor(questionnaires) {
        super();
        this.initElement(questionnaires);
    }
    initElement(questionnaires) {
        this._questionnaires = new Array;

        questionnaires.forEach(item => {
            const q = new QuestionnairePreviewItem(item);
            this._questionnaires.push(q);
            this._container.appendChild(q);
        });
    }
}


class QuestionnairePreviewItem extends Component {
    constructor(item) {

        super();

        this._container.classList.add("card");

        this._uid = item.uid;

        this.createTitle(item.name);

    }

    createTitle(title) {
        const titleElmnt = document.createElement("h4");
        titleElmnt.append(title);
        this._container.appendChild(titleElmnt);
    }
}


class EditableQuestion extends Component {
    constructor(questionData) { 
        super();
        this._container.classList.add("card");
        this.initElement(questionData);
    }

    initElement(questionData) {
        if(questionData) {
            this._question = questionData;
        } else {
            this._question = {
                "id": "",
                "text": "",
                "type": "text"
            };    
        }

        this.createTitle();

        this.createInputSelector();

        if(questionData) {
            this.changeTitle(questionData.text);
            this.changeSelectedInput(questionData.type);
        }

        this.createDeleteButton();
    }

    createTitle() {
        const titleContainer = document.createElement("div");

        const title = document.createElement("input");
        const saveButton = document.createElement("button");
        saveButton.append("Save");
        saveButton.onclick = (evt => {
            this._question.text = saveButton.parentElement.children[0].value;

            console.log(this._question)
        
        });

        titleContainer.appendChild(title);
        titleContainer.appendChild(saveButton);

        this._container.appendChild(titleContainer);
    }

    createInputSelector() {
        const inputSelector = document.createElement("select");

        const option1 = document.createElement("option");
        option1.value="text";
        option1.append("Text Input");

        const option2 = document.createElement("option");
        option2.value="number";
        option2.append("Number Input");

        const option3 = document.createElement("option");
        option3.value="single-select";
        option3.append("Single-select Input");

        const option4 = document.createElement("option");
        option4.value="multi-select";
        option4.append("Multi-select Input");

        inputSelector.appendChild(option1);
        inputSelector.appendChild(option2);
        inputSelector.appendChild(option3);
        inputSelector.appendChild(option4);

        inputSelector.onchange = (evt => {
            this._question.type = inputSelector.value;

            console.log(this._question);
        })

        this._container.appendChild(inputSelector);
    }

    changeTitle(title) {
        this._container.children[0].children[0].value = title;
    }
    changeSelectedInput(input) {
        this._container.children[1].value = input;
    }
    createDeleteButton() {
        const btn = document.createElement("button");
        btn.classList.add("deletebtn");
        btn.append("Delete")
        this._container.appendChild(btn);
    }
}

class EditableQuestionnairePreview extends Component {
    constructor(questionnaires) {
        super();
        this.initElement(questionnaires);
    }

    initElement(questionnaires) {
        this._items = new Array;
        questionnaires.forEach(item => {
            const qTtem = new EditableQuestionnairePreviewItem(item);
            this._items.push(qTtem);
            this._container.appendChild(qTtem);
        });
    }
}

class EditableQuestionnairePreviewItem extends Component {
    constructor(item) {
        super();
        this._container.classList.add("card");
        this.initElement(item);
    }

    initElement(item) {
        this._uid = item.uid;
        console.log(this._uid);
        this.createUID(item.uid);
        this.createTitle(item.name);
        this.createDeleteButton();
        this._container.onclick = (evt => editQuestionnaire(this._uid));
    }

    createTitle(title) {
        const titleElement = document.createElement("h4");
        titleElement.append(title);
        this._container.appendChild(titleElement);
    }
    createUID(uid) {
        const uidElement = document.createElement("h5");
        uidElement.append(uid);
        this._container.appendChild(uidElement);
    }
    createDeleteButton() {
        const deleteButton = document.createElement("button");
        deleteButton.append("delete");
        this._container.appendChild(deleteButton);
    }
}

class EditableQuestionnaire extends Component {
    constructor(questionnaireData, uid) {
        super();
        this.initElement(questionnaireData, uid);
    }

    initElement(questionnaireData, uid) {
        if(questionnaireData) {
            this._uid = uid;
            this._questions = questionnaireData;
        } else {
            this._questions = {
                "name": "",
                "questions": []
            };
        }        
        this.createTitle();
        this.createButtons(questionnaireData);
        this._elements = new Array;
        if(questionnaireData) {
            this.changeTitle(questionnaireData.name);
            questionnaireData.questions.forEach(q => {
                this.createNewQuestion(q);
            });
            
        }
    }

    createTitle() {
        const titleContainer = document.createElement("div");
        const title = document.createElement("input");
        const saveButton = document.createElement("button");
        saveButton.append("Save");

        saveButton.onclick = (evt => this._questions.name = title.value);

        titleContainer.appendChild(title);
        titleContainer.appendChild(saveButton);

        this._container.appendChild(titleContainer);
    }

    createButtons(questionnaireData) {
        const newQButton = document.createElement("button");
        newQButton.append("Add Question");
        newQButton.id="newq";
        this._container.appendChild(newQButton);
        this._container.querySelector("#newq").onclick = (evt => {
            this.createNewQuestion();
        });

        const saveButton = document.createElement("button");
        saveButton.onclick = (evt => {

            this._questions.questions = [];

            this._elements.forEach(x => {
                this._questions.questions.push(x._question);
            });
            console.log(this._questions);

            if(questionnaireData) {
                updateQuestionnaire(this._uid, this._questions);
            } else {
                sendQuestionnaire(this._questions).then(data => {
                    this._uid = data.id;
                    console.log(this._uid);
                });    
            } 
        });

        saveButton.append("Save");
        this._container.appendChild(saveButton);
    }

    createNewQuestion(questionData) {
        const q = new EditableQuestion(questionData);
        this._elements.push(q);
        this._container.appendChild(q);
        q._shadowRoot.querySelector(".deletebtn").addEventListener("click", evt => {
            const result = this._elements.filter(word => word.length > 6);
            this._elements = this._elements.filter(item => {
                return item !== q
            });
            console.log(q);
            console.log(this._elements);
            this._container.removeChild(q);

        });
    }
    changeTitle(title) {
        this._container.children[0].children[0].value = title;
    }
}

/************************************************************
 * Screen Components
 * ******************************************************** */

class Screen extends Component {
    constructor() {
        super();
        if(document.querySelector("main").children[0]) {
            document.querySelector("main").children[0].remove()
        }
    }
    clearScreen() {
        this._container.innerHTML=""
        console.log(this._container.children[1])
    }
}


class HomeScreen extends Screen {
    constructor() {
        super();
        //this.clearScreen();
        this.initElement();
    }

    initElement() {
        const btn = document.createElement("button");
        btn.append("See Questionnaires");
        this._container.appendChild(btn);
        btn.onclick = evt => this.getQuestionnaires();
    }

    

    async getQuestionnaires() {
        const response = await fetch("/questionnaires")
    
        response.json().then(item => {
            const questionnairePreview = new QuestionnairePreview(item);
            this._container.appendChild(questionnairePreview);
            questionnairePreview._questionnaires.forEach(item => {
                item.onclick = evt => this.getQuestionnaire(item._uid);
            })
        });
    }

    async getQuestionnaire(uid) {
        console.log(uid)
        const request = await fetch(`/questionnaire/${uid}`);
    
        const quesitonnaire = await(request.json());
    
        const q = new Questionnaire(quesitonnaire, uid);

        this.clearScreen();

        this._container.appendChild(q);
    }
}

class AdminScreen extends Screen {
    constructor() {
        super();
        //this.clearScreen();
        //this.initElement();
        //this.createUploadButton();
        this.createUploadButton();
        this.showQuestionnaires();
    }

    initElement() {
        this.clearScreen();
    }

    createUploadButton() {
        const button = document.createElement("input");
        button.type = "file";
        button.append("upload");

        button.onchange = uploadJSONQuestionnaire;

        this._container.appendChild(button);
    }

    showQuestionnaires() {
        this.getEditableQuestionnaires();
    }

    async getEditableQuestionnaires() {
        const response = await fetch("/questionnaires")
    
        response.json().then(item => {
            const questionnairePreview = new EditableQuestionnairePreview(item);
            this._container.appendChild(questionnairePreview);
            questionnairePreview._items.forEach(item => {
                item.onclick = evt => this.editQuestionnaire(item._uid);
            });
        });
    }

    async editQuestionnaire(uid) {

        console.log(uid);
    
        const request = await fetch(`/questionnaire/${uid}`);
    
        const quesitonnaire = await(request.json());
    
        const q = new EditableQuestionnaire(quesitonnaire, uid);

        this.clearScreen();

        this._shadowRoot.children[0].remove();

        this._container.appendChild(q);
    }
}
customElements.define('quiz-preview', QuestionnairePreview);
customElements.define('quiz-question', Question);
customElements.define('quiz-item', Questionnaire);
customElements.define('quiz-preview-item', QuestionnairePreviewItem);
customElements.define('editable-question', EditableQuestion);
customElements.define('editable-quiz-preview', EditableQuestionnairePreview);
customElements.define('editable-quiz', EditableQuestionnaire);
customElements.define('editable-quiz-preview-item', EditableQuestionnairePreviewItem);
customElements.define('home-screen', HomeScreen);
customElements.define('admin-screen', AdminScreen);
customElements.define('selector-elmnt', Selector);
customElements.define('input-elmnt', Input);