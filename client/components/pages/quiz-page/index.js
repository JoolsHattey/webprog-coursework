class QuizPage extends Component {
    constructor(quizID, editMode) {
        super();
        //this.clearScreen();
        
        //this.initElement(quizID, editMode);
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