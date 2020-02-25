class Input extends HTMLElement {
    constructor(type) {
        super();
        this._shadowRoot = this.attachShadow({mode: 'open'});
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "styles.css")
        this._shadowRoot.appendChild(linkElem);
        this._container = document.createElement("div");
        this._shadowRoot.appendChild(this._container);
        const input = document.createElement("input");
        input.id = "response";
        if(type==="number") {
            input.setAttribute("type", "number");
        }
        this._container.appendChild(input);
    }
}

customElements.define('input-elmnt', Input);