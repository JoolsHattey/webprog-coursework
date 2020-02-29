class QuizPage extends HTMLElement {
    constructor(quizID, editMode) {
        super();
        //this.clearScreen();
        
        this.attachShadow({mode: 'open'});
        //this.initElement(quizID, editMode);
    }

    initElement(quizID, editMode) {
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "/styles.css")
        this.shadowRoot.appendChild(linkElem);
        this._container = document.createElement("div");
        this.shadowRoot.appendChild(this._container);
        this._container.classList.add("page");
        this.getQuestionnaire(quizID, editMode);
    }

    clearScreen() {
        this._container.innerHTML=""
        console.log(this._container.children[1])
    }


    async getQuestionnaire(uid, editMode) {
        console.log(uid)
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

        this._container.appendChild(q);
    }
}

customElements.define('quiz-screen', QuizPage);