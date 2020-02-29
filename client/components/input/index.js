class Input extends HTMLElement {
    constructor(type) {
        super();
        this.attachShadow({mode: 'open'});
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "/components/input/styles.css")
        this.shadowRoot.appendChild(linkElem);
        this.container = document.createElement("div");
        this.container.classList.add("textinput");
        this.shadowRoot.appendChild(this.container);

        const input = document.createElement("input");
        input.classList.add("text");

        const selectedArea = document.createElement("span");
        selectedArea.classList.add("highlight");

        const bottomBar = document.createElement("span");
        bottomBar.classList.add("bar");

        const title = document.createElement("label");

        input.id = "response";
        if(type==="number") {
            input.setAttribute("type", "number");
        }
        this.container.appendChild(input);
        this.container.appendChild(selectedArea);
        this.container.appendChild(bottomBar);
        this.container.appendChild(title);
    }

    getInput() {
        return this.container.querySelector("input").value;
    }
}

customElements.define('input-elmnt', Input);