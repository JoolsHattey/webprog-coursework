import { Component } from '../component.js';
import { Card } from '../card/index.js';
import { Input } from '../input/index.js';
import { Dropdown } from '../dropdown/index.js';

export class EditableQuestionnaire extends Component {
    constructor(questionnaireData, uid) {
        super();
        this.initElement(questionnaireData, uid);
    }

    initElement(questionnaireData, uid) {

        this.getResponses(uid);

        if(questionnaireData) {
            this.uid = uid;
            this.questions = questionnaireData;
        } else {
            this.questions = {
                "name": "",
                "questions": []
            };
        }
        this.questionsContainer = document.createElement("div");
        this.responsesContainer = document.createElement("div");

        

        this.createTitle();
        this.createButtons(questionnaireData);
        
        this.questionsBtn = document.createElement("button");
        this.questionsBtn.append("Questions");
        this.responsesBtn = document.createElement("button");
        this.responsesBtn.append("Responses");

        this.container.appendChild(this.questionsBtn);
        this.container.appendChild(this.responsesBtn);

        this.container.appendChild(this.questionsContainer);
        this.container.appendChild(this.responsesContainer);

        this.elements = new Array;
        if(questionnaireData) {
            this.changeTitle(questionnaireData.name);
            questionnaireData.questions.forEach(q => {
                this.createNewQuestion(q);
            });
        }
        

        

        this.questionsBtn.onclick = evt => {
            this.container.removeChild(this.responsesContainer)
            this.container.appendChild(this.questionsContainer);
        }
        this.responsesBtn.onclick = evt => {

            this.container.removeChild(this.questionsContainer);
            this.container.appendChild(this.responsesContainer);
        }

        


    }

    async getResponses(uid) {
        const response = await fetch(`/api/responses/${uid}`);

        // (await response.json()).forEach(item => {
        //     const q = new Card();
        //     this.responsesContainer.appendChild(q);
        // });

        this.questions.questions.forEach(item => {
            console.log(item)
            const q = new Card();

            this.responsesContainer.appendChild(q);

        })

        

        
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
        this.questionsContainer.appendChild(saveButton);
    }

    dragstart_handler(ev) {
        // Add the target element's id to the data transfer object
        ev.dataTransfer.setData("text/plain", ev.target.id);
      }

    // createResponses

    createNewQuestion(questionData) {

        const q = new Card();
        q.id = questionData.id;
        q.addEventListener("dragstart", evt => this.dragstart_handler(evt));
        q.setAttribute("draggable", "true");
        const i = new Input();
        i.setInput(questionData.text)
        q.insertElement(i);
        const options = [
            {"value": "text",
            "text": "Text Input"},
            {"value": "number",
            "text": "Number Input"},
            {"value": "single-select",
            "text": "Single-select Input"},
            {"value": "multi-select",
            "text": "Multi-select Input"}
        ]
        const drop = new Dropdown(options);
        q.insertElement(drop);

        this.questionsContainer.appendChild(q);
    }
    changeTitle(title) {
        // console.log(this.container.children);
        this.container.children[0].children[0].value = title;
    }
}

customElements.define('editable-quiz', EditableQuestionnaire);