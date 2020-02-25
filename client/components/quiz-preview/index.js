class QuestionnairePreview extends HTMLElement {
    constructor(questionnaires) {
        super();
        this._shadowRoot = this.attachShadow({mode: 'open'});
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "styles.css")
        this._shadowRoot.appendChild(linkElem);
        this._container = document.createElement("div");
        this._shadowRoot.appendChild(this._container);
        this.initElement(questionnaires);
    }
    initElement(questionnaires) {
        this._questionnaires = new Array;

        questionnaires.forEach(item => {
            const q = new QuestionnairePreviewItem(item);
            this._questionnaires.push(q);
            this._container.appendChild(q);
        });
    }
}

customElements.define('quiz-preview', QuestionnairePreview);