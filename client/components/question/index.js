class Question extends Component {
    constructor(question) {
        super();
        this.initElement(question);
        this.createTitle(question.text);
        this.createInput(question);
    }

    initElement(question) {
        this.container.classList.add("card");
        this.container.id = question.id;
        this.id = question.id;
    }

    createTitle(name) {
        const title = document.createElement("h3");
        const titleContent = document.createTextNode(name);
        title.appendChild(titleContent);
        this.container.appendChild(title);
    }

    createInput(question) {
        switch(question.type) {
            case "text":
                this.input = new Input("text");
                this.input.id = question.id;
                break;
            case "number":
                this.input = new Input("number");
                break;
            case "single-select":
                this.input = new Selector(question.options, "radio");
                break;
            case "multi-select":
                this.input = new Selector(question.options, "checkbox");
                break;
        }
    
        this.container.appendChild(this.input);
    }

    getAnswer() {
        if(this.input === Input) {
            return this.input.getInput();
        }
        
    }
}

customElements.define("quiz-question", Question);