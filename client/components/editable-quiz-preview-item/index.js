class EditableQuestionnairePreviewItem extends HTMLElement {
    constructor(item) {
        super();
        this._shadowRoot = this.attachShadow({mode: 'open'});
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "/styles.css")
        this._shadowRoot.appendChild(linkElem);
        this._container = document.createElement("div");
        this._shadowRoot.appendChild(this._container);
        this._container.classList.add("card");
        this.initElement(item);
    }

    initElement(item) {
        this._uid = item.uid;
        console.log(this._uid);
        this.createUID(item.uid);
        this.createTitle(item.name);
        this.createDeleteButton();
        this._container.onclick = (evt => editQuestionnaire(this._uid));
    }

    createTitle(title) {
        const titleElement = document.createElement("h4");
        titleElement.append(title);
        this._container.appendChild(titleElement);
    }
    createUID(uid) {
        const uidElement = document.createElement("h5");
        uidElement.append(uid);
        this._container.appendChild(uidElement);
    }
    createDeleteButton() {
        const deleteButton = document.createElement("button");
        deleteButton.append("delete");
        this._container.appendChild(deleteButton);
    }
}

customElements.define('editable-quiz-preview-item', EditableQuestionnairePreviewItem);