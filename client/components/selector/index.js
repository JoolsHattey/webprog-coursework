class Selector extends HTMLElement {
    constructor(options, type) {
        super();
        this.attachShadow({mode: 'open'});
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "/components/selector/styles.css")
        this.shadowRoot.appendChild(linkElem);
        this.container = document.createElement("div");
        this.shadowRoot.appendChild(this.container);
        options.forEach(opt => {
            const container = document.createElement("div");
            const option = document.createElement("input");
            container.classList.add(type);
            container.classList.add(`${type}__input`)
            option.setAttribute("type", type);
            option.setAttribute("name", "name");
            option.setAttribute("value", opt);
            option.setAttribute("id", opt);
            const label = document.createElement("label");
            label.classList.add(`${type}__label`)
            label.setAttribute("for", opt)
            label.textContent = opt
            container.appendChild(option);
            container.appendChild(label);
            
            this.container.appendChild(container);
        });
    }
}

customElements.define('selector-elmnt', Selector);