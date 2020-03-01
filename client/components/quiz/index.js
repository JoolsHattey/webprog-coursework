class Questionnaire extends Component {
    constructor(questionnaireData, uid) {
        super();
        this.initElement(questionnaireData, uid);
    }

    initElement(questionnaireData, uid) {
        this.uid = uid;
        this.response = { "questions": [] };
        this.currentQ = 0;
        this.questions = new Array;
        this.createTitle(questionnaireData.name);
        if(questionnaireData) {
            questionnaireData.questions.forEach(item => {
                const q = new Question(item);
                this.questions.push(q);
            });
        }
        this.container.appendChild(this.questions[0]);
        const btn = document.createElement("button");
        btn.append("Next");
        this.container.appendChild(btn);
        this.ProgIndic = new ProgressIndicator(this.questions.length);
        btn.onclick = (evt => {
            console.log(this.uestions[this.currentQ])
            this.response.questions[this.currentQ] = {
                "id": this.questions[this.currentQ].id,
                "answer": this.questions[this.currentQ].getAnswer()

            }
            this.currentQ++;
            this.ProgIndic.setProgress(this.currentQ);
            this.container.children[1].remove();
            this.container.insertBefore(this.questions[this.currentQ], btn);
            if(this.currentQ === this.questions.length-1) {
                btn.disabled = true;
                this.showSubmitButton();
            }
        });
        
        this.container.appendChild(this.ProgIndic);
    }

    createTitle(name) {
        const title = document.createElement("h4");
        title.append(name);
        this.container.appendChild(title);
    }

    showSubmitButton() {
        const submit = document.createElement("button");
        submit.append("Submit");
        submit.onclick = (evt => submitResponse(this.uid, this.response));
        this.container.appendChild(submit);
    }
}

customElements.define("quiz-item", Questionnaire);