export class Component extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.head = document.createElement("head");
        this.addStyleSheet("/styles.css");
        this.shadowRoot.appendChild(this.head);
        this.container = document.createElement("body");
        this.shadowRoot.appendChild(this.container);
    }
    addStyleSheet(path) {
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", path);
        this.head.appendChild(linkElem);
    }
    async addTemplate(path) {
        let res = await fetch(path);
        this.container.innerHTML = await res.text();
    }
}