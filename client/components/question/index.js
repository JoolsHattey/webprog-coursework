class Question extends HTMLElement {
    constructor(question) {
        super();
        this.initElement(question);
        this.createTitle(question.text);
        this.createInput(question);
    }

    initElement(question) {
        this._shadowRoot = this.attachShadow({mode: 'open'});
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "/styles.css")
        this._shadowRoot.appendChild(linkElem);
        this._container = document.createElement("div");
        this._shadowRoot.appendChild(this._container);
        this._container.classList.add("card");
        this._container.id = question.id;
        this._id = question.id;
    }

    createTitle(name) {
        const title = document.createElement("h3");
        const titleContent = document.createTextNode(name);
        title.appendChild(titleContent);
        this._container.appendChild(title);
    }

    createInput(question) {
        let input;

        switch(question.type) {
            case "text":
                input = new Input("text");
                input.id = question.id;
                break;
            case "number":
                input = new Input("number");
                break;
            case "single-select":
                input = new Selector(question.options, "radio");
                break;
            case "multi-select":
                input = new Selector(question.options, "checkbox");
                break;
        }
    
        this._container.appendChild(input);
    }
}

customElements.define("quiz-question", Question);