class AdminPage extends Component {
    constructor() {
        super();
        this.initElement();
        this.container.classList.add("page");
        //this.clearScreen();
        //this.initElement();
        //this.createUploadButton();
        this.createUploadButton();
        this.showQuestionnaires();
    }

    initElement() {
        //this.clearScreen();
    }

    clearScreen() {
        this.container.innerHTML=""
        console.log(this.container.children[1])
    }

    createUploadButton() {
        const button = document.createElement("input");
        button.type = "file";
        button.append("upload");

        button.onchange = uploadJSONQuestionnaire;

        this.container.appendChild(button);
    }

    showQuestionnaires() {
        this.getEditableQuestionnaires();
    }

    async getEditableQuestionnaires() {
        const response = await fetch("/api/questionnaires")
    
        response.json().then(item => {
            const questionnairePreview = new EditableQuestionnairePreview(item);
            this.container.appendChild(questionnairePreview);
            questionnairePreview.items.forEach(item => {
                //item.onclick = evt => window.location.replace(`/quiz/${item._uid}/edit`);
                item.onclick = evt => router.navigate(`/quiz/${item.uid}/edit`);
            });
        });
    }

    async editQuestionnaire(uid) {

        console.log(uid);
    
        const request = await fetch(`/api/questionnaire/${uid}`);
    
        const quesitonnaire = await(request.json());
    
        const q = new EditableQuestionnaire(quesitonnaire, uid);

        this.clearScreen();

        this.shadowRoot.children[0].remove();

        this.container.appendChild(q);
    }
}

customElements.define('admin-screen', AdminPage);