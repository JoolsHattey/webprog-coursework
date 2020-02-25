class Selector extends HTMLElement {
    constructor(options, type) {
        super();
        this._shadowRoot = this.attachShadow({mode: 'open'});
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "styles.css")
        this._shadowRoot.appendChild(linkElem);
        this._container = document.createElement("div");
        this._shadowRoot.appendChild(this._container);
        options.forEach(opt => {
            const container = document.createElement("div");
            const option = document.createElement("input");
            option.setAttribute("type", type);
            option.setAttribute("name", "name");
            option.setAttribute("value", opt);
            option.setAttribute("id", opt);
            const label = document.createElement("label");
            label.setAttribute("for", opt)
            label.textContent = opt
            container.appendChild(option);
            container.appendChild(label);
            
            this._container.appendChild(container);
        });
    }
}

customElements.define('selector-elmnt', Selector);