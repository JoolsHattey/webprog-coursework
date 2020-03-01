class EditableQuestionnaire extends Component {
    constructor(questionnaireData, uid) {
        super();
        this.initElement(questionnaireData, uid);
    }

    initElement(questionnaireData, uid) {
        if(questionnaireData) {
            this.uid = uid;
            this.questions = questionnaireData;
        } else {
            this.questions = {
                "name": "",
                "questions": []
            };
        }
        this.createTitle();
        this.createButtons(questionnaireData);
        this.elements = new Array;
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

        saveButton.onclick = (evt => this.questions.name = title.value);

        titleContainer.appendChild(title);
        titleContainer.appendChild(saveButton);

        this.container.appendChild(titleContainer);
    }

    createButtons(questionnaireData) {
        const newQButton = document.createElement("button");
        newQButton.append("Add Question");
        newQButton.id="newq";
        this.container.appendChild(newQButton);
        this.container.querySelector("#newq").onclick = (evt => {
            this.createNewQuestion();
        });

        const saveButton = document.createElement("button");
        saveButton.onclick = (evt => {

            this.questions.questions = [];

            this.elements.forEach(x => {
                this.questions.questions.push(x.question);
            });
            console.log(this.questions);

            if(questionnaireData) {
                updateQuestionnaire(this.uid, this.questions);
            } else {
                sendQuestionnaire(this.questions).then(data => {
                    this.uid = data.id;
                    console.log(this.uid);
                });    
            } 
        });

        saveButton.append("Save");
        this.container.appendChild(saveButton);
    }

    createNewQuestion(questionData) {
        const q = new EditableQuestion(questionData);
        this.elements.push(q);
        this.container.appendChild(q);
        q.shadowRoot.querySelector(".deletebtn").addEventListener("click", evt => {
            const result = this.elements.filter(word => word.length > 6);
            this.elements = this.elements.filter(item => {
                return item !== q
            });
            console.log(q);
            console.log(this.elements);
            this.container.removeChild(q);

        });
    }
    changeTitle(title) {
        this.container.children[0].children[0].value = title;
    }
}

customElements.define('editable-quiz', EditableQuestionnaire);