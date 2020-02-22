class Question {

    constructor(question) {
        this.initElement(question);
        this.createTitle(question.text);
        this.createInput(question);      
    }

    initElement(question) {
        this._element = document.createElement("div");
        this._element.classList.add("question");
        this._element.id = question.id;
        this._id = question.id;
    }

    createTitle(name) {
        const title = document.createElement("h3");
        const titleContent = document.createTextNode(name);
        title.appendChild(titleContent);
        this._element.appendChild(title);
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
    
        this._element.appendChild(input);
    }
    createTextInput() {
        const form = document.createElement("form")
        const input = document.createElement("input");
        input.id = "response";
        form.appendChild(input);
        
        return form;
    }
    createNumberInput() {
        const form = document.createElement("form")
        const inputElement = document.createElement("input");
        inputElement.id="response";
        inputElement.setAttribute("type", "number");
    
        form.appendChild(inputElement);
        return form;
    }
    createMultiSelectInput(options) {
        const inputElement = document.createElement("div");
        options.forEach(opt => {
            const optionContainer = document.createElement("div");
            const option = document.createElement("input");
            option.setAttribute("type", "checkbox");
            option.setAttribute("name", "name");
            option.setAttribute("id", opt);
    
            const label = document.createElement("label");
            label.setAttribute("for", opt)
            label.textContent = opt
            optionContainer.appendChild(option);
            optionContainer.appendChild(label);
            inputElement.appendChild(optionContainer);
        });
        return inputElement;
    }
    createSingleSelectInput(options) {
        const inputElement = document.createElement("div");
        options.forEach(opt => {
            const optionContainer = document.createElement("div");
            const option = document.createElement("input");
            option.setAttribute("type", "radio");
            option.setAttribute("name", "name");
            option.setAttribute("value", opt);
            option.setAttribute("id", opt);
    
            const label = document.createElement("label");
            label.setAttribute("for", opt);
            label.textContent = opt;
            optionContainer.appendChild(option);
            optionContainer.appendChild(label);
            inputElement.appendChild(optionContainer);
        });
        return inputElement;
    }
}

class Questionnaire {

    constructor(questionnaireData, uid) {

        this._uid = uid;

        this._response = { "questions": [] };

        this._currentQ = 0;

        this._element = document.createElement("div");

        this._elements = new Array;

        this._questions = new Array;

        this.createTitle(questionnaireData.name);
        
        if(questionnaireData) {
            questionnaireData.questions.forEach(item => {
                const q = new Question(item);
                this._elements.push(q._element);
                this._questions.push(q);
            });
        }
        this._element.appendChild(this._questions[0]._element);

        const btn = document.createElement("button");
        btn.append("Next");

        this._element.appendChild(btn);
        btn.onclick = (evt => {

            this._response.questions[this._currentQ] = {
                "id": this._questions[this._currentQ]._id,
                "answer": this._elements[this._currentQ].children[1].children[0].value
            }
            console.log(this._response);

            this._currentQ++;
            this._element.children[1].remove();
            this._element.insertBefore(this._elements[this._currentQ], btn);
            if(this._currentQ === this._elements.length-1) {
                btn.disabled = true;
                this.showSubmitButton();
            }
        });

        //document.querySelector("#questionContainer").appendChild(this._element);
    }

    createTitle(name) {
        const title = document.createElement("h4");
        title.append(name);
        this._element.appendChild(title);
    }

    showSubmitButton() {
        const submit = document.createElement("button");
        submit.append("Submit");
        submit.onclick = (evt => submitResponse(this._uid, this._response));
        this._element.appendChild(submit);
    }
}

class QuestionnairePreview {

    constructor(questionnaires) {
        this._element = document.createElement("div");
        this._queationnaires = new Array;

        questionnaires.forEach(item => {
            const q = new QuestionnairePreviewItem(item);
            this._queationnaires.push(q);
            //console.log(super());
            //q._element.onclick = evt => super.getQuestionnaire(q._uid);

            this._element.appendChild(q._element);
        });
        //document.querySelector("#questionContainer").appendChild(this._element);
    }
}

class QuestionnairePreviewItem {

    constructor(item) {

        this._uid = item.uid;

        this._element = document.createElement("div");
        this.createTitle(item.name);

    }

    createTitle(title) {
        const titleElmnt = document.createElement("h4");
        titleElmnt.append(title);
        this._element.appendChild(titleElmnt);
    }
}


class EditableQuestion {

    constructor(questionData) {    
        
        if(questionData) {
            this._question = questionData;
        } else {
            this._question = {
                "id": "",
                "text": "",
                "type": "text"
            };    
        }

        
        this._element = document.createElement("div");

        this._element.classList.add("question");

        this.createTitle();

        this.createInputSelector();

        if(questionData) {
            this.changeTitle(questionData.text);
            this.changeSelectedInput(questionData.type);
        }
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

        this._element.appendChild(titleContainer);
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

        this._element.appendChild(inputSelector);
    }

    changeTitle(title) {
        this._element.children[0].children[0].value = title;
    }
    changeSelectedInput(input) {
        this._element.children[1].value = input;
    }
}

class EditableQuestionnairePreview {
    
    constructor(questionnaires) {
        this.initElement(questionnaires);
    }

    initElement(questionnaires) {
        this._items = new Array;
        this._element = document.createElement("div");
        questionnaires.forEach(item => {
            const qTtem = new EditableQuestionnairePreviewItem(item);
            this._items.push(qTtem);
            this._element.appendChild(qTtem._element);
        });
    }
}

class EditableQuestionnairePreviewItem {

    constructor(item) {
        this._element = document.createElement("div");
        this._uid = item.uid;
        console.log(this._uid);
        this._element.append(item.name);
        this._element.onclick = (evt => editQuestionnaire(this._uid));
    }
}

class EditableQuestionnaire {

    constructor(questionnaireData, uid) {

        this.initElement(questionnaireData, uid);
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

    initElement(questionnaireData, uid) {
        this._element = document.createElement("div");
        if(questionnaireData) {
            this._uid = uid;
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

        this._element.appendChild(titleContainer);
    }

    createButtons(questionnaireData) {
        const newQButton = document.createElement("button");
        newQButton.append("Add Question");
        newQButton.id="newq";
        this._element.appendChild(newQButton);
        this._element.querySelector("#newq").onclick = (evt => {
            this.createNewQuestion();
        });


        this._questions = {
            "name": "",
            "questions": []
        };

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
        this._element.appendChild(saveButton);
    }

    createNewQuestion(questionData) {
        const q = new EditableQuestion(questionData);
        this._elements.push(q);
        this._element.appendChild(q._element);
    }
    changeTitle(title) {
        this._element.children[0].children[0].value = title;
    }
}


class HomeScreen {
    
    constructor() {
        this.initElement();
    }

    initElement() {
        this._element = document.createElement("div");

        const btn = document.createElement("button");
        btn.append("See Questionnaires");
        this._element.appendChild(btn);
        btn.onclick = evt => this.getQuestionnaires();

        this.clearScreen();
        document.querySelector("main").appendChild(this._element);
    }

    clearScreen() {
        if(document.querySelector("main").children[0]) {
            document.querySelector("main").children[0].remove();
        }
    }

    async getQuestionnaires() {
        const response = await fetch("/questionnaires")
    
        response.json().then(item => {
            const questionnairePreview = new QuestionnairePreview(item);
            this._element.appendChild(questionnairePreview._element);
            questionnairePreview._queationnaires.forEach(item => {
                item._element.onclick = evt => this.getQuestionnaire(item._uid);
            })
        });
    }

    async getQuestionnaire(uid) {
        console.log(uid)
        const request = await fetch(`/questionnaire/${uid}`);
    
        const quesitonnaire = await(request.json());
    
        const q = new Questionnaire(quesitonnaire, uid);

        this.clearScreen();

        document.querySelector("main").appendChild(q._element);
    }
}

class AdminScreen {

    constructor() {
        this.initElement();
        //this.createUploadButton();
        this.showQuestionnaires();
    }

    initElement() {
        this._element = document.createElement("div");
        this.clearScreen();
        document.querySelector("main").appendChild(this._element);
    }

    createUploadButton() {
        const button = document.createElement("input");
        button.type = "file";
        button.append("upload");

        button.onchange = uploadJSONQuestionnaire;

        this._element.appendChild(button);
    }

    showQuestionnaires() {
        this.getEditableQuestionnaires();
        //const q = new EditableQuestionnairePreview();
    }

    async getEditableQuestionnaires() {
        const response = await fetch("/questionnaires")
    
        response.json().then(item => {
            const questionnairePreview = new EditableQuestionnairePreview(item);
            this._element.appendChild(questionnairePreview._element);
            questionnairePreview._items.forEach(item => {
                item._element.onclick = evt => this.editQuestionnaire(item._uid);
            });
        });
    }

    async editQuestionnaire(uid) {

        console.log(uid);
    
        const request = await fetch(`/questionnaire/${uid}`);
    
        const quesitonnaire = await(request.json());
    
        const q = new EditableQuestionnaire(quesitonnaire, uid);

        this._element.children[0].remove();

        this._element.appendChild(q._element);
    }
    

    

    clearScreen() {
        if(document.querySelector("main").children[0]) {
            document.querySelector("main").children[0].remove();
        }
    }
}