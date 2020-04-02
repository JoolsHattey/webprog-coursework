import { Component } from '../../components/component.js';
import { Questionnaire } from '../../components/quiz/index.js';
import { EditableQuestionnaire } from '../../components/editable-quiz/index.js';

export class QuizPage extends Component {
    constructor(req) {
        super();
        //this.clearScreen();
        
        this.initElement(req.param1, req.param2);
    }

    initElement(quizID, editMode) {
        this.container.classList.add("page");
        this.getQuestionnaire(quizID, editMode);
    }

    clearScreen() {
        this.container.innerHTML=""
        console.log(this.container.children[1])
    }


    async getQuestionnaire(uid, editMode) {
        console.log(uid)
        console.log(editMode);
        const request = await fetch(`/api/questionnaire/${uid}`);
    
        const quesitonnaire = await(request.json());

        console.log(quesitonnaire)

        let q;

        console.log(editMode);


        if(editMode === "edit") {
            console.log("edit")
            q = new EditableQuestionnaire(quesitonnaire, uid);
        } else {
            console.log("view")
            q = new Questionnaire(quesitonnaire, uid);
        }
    
        

        this.clearScreen();

        this.container.appendChild(q);
    }
}

customElements.define('quiz-screen', QuizPage);