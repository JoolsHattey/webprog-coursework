class EditableQuestionnaire extends HTMLElement {
    constructor(questionnaireData, uid) {
        super();
        this._shadowRoot = this.attachShadow({mode: 'open'});
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "styles.css")
        this._shadowRoot.appendChild(linkElem);
        this._container = document.createElement("div");
        this._shadowRoot.appendChild(this._container);
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

customElements.define('editable-quiz', EditableQuestionnaire);