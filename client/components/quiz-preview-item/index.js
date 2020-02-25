class QuestionnairePreviewItem extends HTMLElement {
    constructor(item) {

        super();

        this._shadowRoot = this.attachShadow({mode: 'open'});
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "styles.css")
        this._shadowRoot.appendChild(linkElem);
        this._container = document.createElement("div");
        this._shadowRoot.appendChild(this._container);

        this._container.classList.add("card");

        this._uid = item.uid;

        this.createTitle(item.name);

    }

    createTitle(title) {
        const titleElmnt = document.createElement("h4");
        titleElmnt.append(title);
        this._container.appendChild(titleElmnt);
    }
}

customElements.define('quiz-preview-item', QuestionnairePreviewItem);