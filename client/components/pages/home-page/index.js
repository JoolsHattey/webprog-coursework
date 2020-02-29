class HomePage extends HTMLElement {
    constructor() {
        super();
        //this.clearScreen();
        this.attachShadow({mode: 'open'});
        this.initElement();
    }

    initElement() {
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "/styles.css")
        this.shadowRoot.appendChild(linkElem);
        this._container = document.createElement("div");
        this.shadowRoot.appendChild(this._container);
        this._container.classList.add("page");
        const btn = document.createElement("button");
        btn.append("See Questionnaires");
        this._container.appendChild(btn);
        btn.onclick = evt => this.getQuestionnaires();
    }

    clearScreen() {
        this._container.innerHTML=""
        console.log(this._container.children[1])
    }

    

    async getQuestionnaires() {
        const response = await fetch("/api/questionnaires")
    
        response.json().then(item => {
            const questionnairePreview = new QuestionnairePreview(item);
            this._container.appendChild(questionnairePreview);
            questionnairePreview._questionnaires.forEach(item => {
                item.onclick = evt => router.navigate(`/quiz/${item._uid}`);
            });
        });
    }
}

customElements.define('home-screen', HomePage);