class EditableQuestionnairePreview extends HTMLElement {
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
        this._items = new Array;
        questionnaires.forEach(item => {
            const qTtem = new EditableQuestionnairePreviewItem(item);
            this._items.push(qTtem);
            this._container.appendChild(qTtem);
        });
    }
}

customElements.define('editable-quiz-preview', EditableQuestionnairePreview);