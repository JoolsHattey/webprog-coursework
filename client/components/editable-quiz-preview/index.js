class EditableQuestionnairePreview extends Component {
    constructor(questionnaires) {
        super();
        this.initElement(questionnaires);
    }

    initElement(questionnaires) {
        this.items = new Array;
        questionnaires.forEach(item => {
            const qTtem = new EditableQuestionnairePreviewItem(item);
            this.items.push(qTtem);
            this.container.appendChild(qTtem);
        });
    }
}

customElements.define('editable-quiz-preview', EditableQuestionnairePreview);