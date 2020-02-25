class AdminPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.initElement();
        this._container.classList.add("page");
        //this.clearScreen();
        //this.initElement();
        //this.createUploadButton();
        this.createUploadButton();
        this.showQuestionnaires();
    }

    initElement() {
        
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "styles.css")
        this.shadowRoot.appendChild(linkElem);
        this._container = document.createElement("div");
        this.shadowRoot.appendChild(this._container);
        //this.clearScreen();
    }

    clearScreen() {
        this._container.innerHTML=""
        console.log(this._container.children[1])
    }

    createUploadButton() {
        const button = document.createElement("input");
        button.type = "file";
        button.append("upload");

        button.onchange = uploadJSONQuestionnaire;

        this._container.appendChild(button);
    }

    showQuestionnaires() {
        this.getEditableQuestionnaires();
    }

    async getEditableQuestionnaires() {
        const response = await fetch("/questionnaires")
    
        response.json().then(item => {
            const questionnairePreview = new EditableQuestionnairePreview(item);
            this._container.appendChild(questionnairePreview);
            questionnairePreview._items.forEach(item => {
                item.onclick = evt => this.editQuestionnaire(item._uid);
            });
        });
    }

    async editQuestionnaire(uid) {

        console.log(uid);
    
        const request = await fetch(`/questionnaire/${uid}`);
    
        const quesitonnaire = await(request.json());
    
        const q = new EditableQuestionnaire(quesitonnaire, uid);

        this.clearScreen();

        this.shadowRoot.children[0].remove();

        this._container.appendChild(q);
    }
}

customElements.define('admin-screen', AdminPage);