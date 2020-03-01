class QuestionnairePreview extends Component {
    constructor(questionnaires) {
        super();
        this.initElement(questionnaires);
    }
    initElement(questionnaires) {
        this.questionnaires = new Array;

        questionnaires.forEach(item => {
            const q = new QuestionnairePreviewItem(item);
            this.questionnaires.push(q);
            this.container.appendChild(q);
        });
    }
}

customElements.define('quiz-preview', QuestionnairePreview);