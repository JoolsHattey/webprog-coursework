class Card extends Component {
    constructor() {
        super();
        this.container.classList.add("card");
        this.addStyleSheet("/components/card/styles.css");
    }
    createTitle(name) {
        const title = document.createElement("div");
        title.append(name);
        this.container.appendChild(title);
    }
    createContent(content) {
        const contentEl = document.createElement("div");
        contentEl.append(content);
    }
    insertElement(el) {
        this.container.appendChild(el);
    }
    setOnClick(callbackFn) {
        this.container.onclick = callbackFn;
    }
    setVisible(value) {
        if(value) {
            this.style = "";
        } else {
            this.style = "display: none;";
        }
        
    }
}

customElements.define("card-el", Card);