class Questionnaire extends HTMLElement {
    constructor(questionnaireData, uid) {
        super();
        this._shadowRoot = this.attachShadow({mode: 'open'});
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "styles.css")
        this._shadowRoot.appendChild(linkElem);
        this._container = document.createElement("div");
        this._shadowRoot.appendChild(this._container);
        this.initElement(questionnaireData, uid);
    }

    initElement(questionnaireData, uid) {
        this._uid = uid;
        this._response = { "questions": [] };
        this._currentQ = 0;
        this._questions = new Array;
        this.createTitle(questionnaireData.name);
        if(questionnaireData) {
            questionnaireData.questions.forEach(item => {
                const q = new Question(item);
                this._questions.push(q);
            });
        }
        this._container.appendChild(this._questions[0]);
        const btn = document.createElement("button");
        btn.append("Next");
        this._container.appendChild(btn);
        this._ProgIndic = new ProgressIndicator(this._questions.length);
        btn.onclick = (evt => {
            console.log(this._questions[this._currentQ])
            this._response.questions[this._currentQ] = {
                "id": this._questions[this._currentQ]._id,
                "answer": this._questions[this._currentQ].getAnswer()

            }
            this._currentQ++;
            this._ProgIndic.setProgress(this._currentQ);
            this._container.children[1].remove();
            this._container.insertBefore(this._questions[this._currentQ], btn);
            if(this._currentQ === this._questions.length-1) {
                btn.disabled = true;
                this.showSubmitButton();
            }
        });
        
        this._container.appendChild(this._ProgIndic);
    }

    createTitle(name) {
        const title = document.createElement("h4");
        title.append(name);
        this._container.appendChild(title);
    }

    showSubmitButton() {
        const submit = document.createElement("button");
        submit.append("Submit");
        submit.onclick = (evt => submitResponse(this._uid, this._response));
        this._container.appendChild(submit);
    }
}

customElements.define("quiz-item", Questionnaire);