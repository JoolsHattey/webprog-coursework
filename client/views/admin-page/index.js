import { Component } from '../../components/component.js';
import { Card } from '../../components/card/index.js';
import { routerInstance } from '../../index.js';

export class AdminPage extends Component {
    constructor() {
        super();
        this.initElement();
        this.container.classList.add("page");
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

        // button.onchange = uploadJSONQuestionnaire;

        this.container.appendChild(button);
    }

    showQuestionnaires() {
        this.getEditableQuestionnaires();
    }


    async getEditableQuestionnaires() {
        const response = await fetch("/api/questionnaires")

        const quizes = document.createElement("div");

        response.json().then(data => {
            data.forEach(item => {
                const q = new Card();
                q.createTitle(item.name);
                q.setOnClick(evt => routerInstance.navigate(`/quiz/${item.uid}/edit`));
                quizes.appendChild(q);
            });
        });
        this.container.appendChild(quizes);
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