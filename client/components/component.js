class Component extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "/styles.css");
        this.shadowRoot.appendChild(linkElem);
        this.container = document.createElement("div");
        this.shadowRoot.appendChild(this.container);
    }
    addStyleSheet(path) {
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", path);
        this.shadowRoot.appendChild(linkElem);
    }
}