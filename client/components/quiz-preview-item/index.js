class QuestionnairePreviewItem extends Component {
    constructor(item) {
        super();
        this.container.classList.add("card");
        this.uid = item.uid;
        this.createTitle(item.name);
    }

    createTitle(title) {
        const titleElmnt = document.createElement("h4");
        titleElmnt.append(title);
        this.container.appendChild(titleElmnt);
    }
}

customElements.define('quiz-preview-item', QuestionnairePreviewItem);