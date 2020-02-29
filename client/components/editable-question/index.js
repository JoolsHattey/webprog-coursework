class EditableQuestion extends HTMLElement {
    constructor(questionData) { 
        super();
        this._shadowRoot = this.attachShadow({mode: 'open'});
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "/styles.css")
        this._shadowRoot.appendChild(linkElem);
        this._container = document.createElement("div");
        this._shadowRoot.appendChild(this._container);
        this._container.classList.add("card");
        this.initElement(questionData);
    }

    initElement(questionData) {
        if(questionData) {
            this._question = questionData;
        } else {
            this._question = {
                "id": "",
                "text": "",
                "type": "text"
            };    
        }

        this.createTitle();

        this.createInputSelector();

        if(questionData) {
            this.changeTitle(questionData.text);
            this.changeSelectedInput(questionData.type);
        }

        this.createDeleteButton();
    }

    createTitle() {
        const titleContainer = document.createElement("div");

        const title = document.createElement("input");
        const saveButton = document.createElement("button");
        saveButton.append("Save");
        saveButton.onclick = (evt => {
            this._question.text = saveButton.parentElement.children[0].value;

            console.log(this._question)
        
        });

        titleContainer.appendChild(title);
        titleContainer.appendChild(saveButton);

        this._container.appendChild(titleContainer);
    }

    createInputSelector() {
        const inputSelector = document.createElement("select");

        const option1 = document.createElement("option");
        option1.value="text";
        option1.append("Text Input");

        const option2 = document.createElement("option");
        option2.value="number";
        option2.append("Number Input");

        const option3 = document.createElement("option");
        option3.value="single-select";
        option3.append("Single-select Input");

        const option4 = document.createElement("option");
        option4.value="multi-select";
        option4.append("Multi-select Input");

        inputSelector.appendChild(option1);
        inputSelector.appendChild(option2);
        inputSelector.appendChild(option3);
        inputSelector.appendChild(option4);

        inputSelector.onchange = (evt => {
            this._question.type = inputSelector.value;

            console.log(this._question);
        })

        this._container.appendChild(inputSelector);
    }

    changeTitle(title) {
        this._container.children[0].children[0].value = title;
    }
    changeSelectedInput(input) {
        this._container.children[1].value = input;
    }
    createDeleteButton() {
        const btn = document.createElement("button");
        btn.classList.add("deletebtn");
        btn.append("Delete")
        this._container.appendChild(btn);
    }
}

customElements.define('editable-question', EditableQuestion);