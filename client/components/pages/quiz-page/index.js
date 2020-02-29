class QuizPage extends HTMLElement {
    constructor(quizid) {
        super();
        //this.clearScreen();
        
        this.attachShadow({mode: 'open'});
        this.initElement(quizid);
    }

    initElement(quizid) {
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "/styles.css")
        this.shadowRoot.appendChild(linkElem);
        this._container = document.createElement("div");
        this.shadowRoot.appendChild(this._container);
        this._container.classList.add("page");
        this.getQuestionnaire(quizid);
    }

    clearScreen() {
        this._container.innerHTML=""
        console.log(this._container.children[1])
    }


    async getQuestionnaire(uid) {
        console.log(uid)
        const request = await fetch(`/api/questionnaire/${uid}`);
    
        const quesitonnaire = await(request.json());

        console.log(quesitonnaire)
    
        const q = new Questionnaire(quesitonnaire, uid);

        this.clearScreen();

        this._container.appendChild(q);
    }
}

customElements.define('quiz-screen', QuizPage);