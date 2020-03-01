class EditableQuestionnairePreviewItem extends Component {
    constructor(item) {
        super();
        this.container.classList.add("card");
        this.initElement(item);
    }

    initElement(item) {
        this.uid = item.uid;
        console.log(this._uid);
        this.createUID(item.uid);
        this.createTitle(item.name);
        this.createDeleteButton();
        this.container.onclick = (evt => editQuestionnaire(this.uid));
    }

    createTitle(title) {
        const titleElement = document.createElement("h4");
        titleElement.append(title);
        this.container.appendChild(titleElement);
    }
    createUID(uid) {
        const uidElement = document.createElement("h5");
        uidElement.append(uid);
        this.container.appendChild(uidElement);
    }
    createDeleteButton() {
        const deleteButton = document.createElement("button");
        deleteButton.append("delete");
        this.container.appendChild(deleteButton);
    }
}

customElements.define('editable-quiz-preview-item', EditableQuestionnairePreviewItem);