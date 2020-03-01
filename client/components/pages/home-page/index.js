class HomePage extends Component {
    constructor() {
        super();
        this.initElement();
    }

    initElement() {
        this.container.classList.add("page");
        const btn = document.createElement("button");
        btn.append("See Questionnaires");
        this.container.appendChild(btn);
        btn.onclick = evt => this.getQuestionnaires();
    }

    clearScreen() {
        this.container.innerHTML=""
        console.log(this.container.children[1])
    }

    

    async getQuestionnaires() {
        const response = await fetch("/api/questionnaires")
    
        response.json().then(item => {
            const questionnairePreview = new QuestionnairePreview(item);
            this.container.appendChild(questionnairePreview);
            questionnairePreview.questionnaires.forEach(item => {
                item.onclick = evt => router.navigate(`/quiz/${item.uid}`);
            });
        });
    }
}

customElements.define('home-screen', HomePage);