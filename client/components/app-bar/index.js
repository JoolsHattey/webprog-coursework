class AppBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "styles.css")
        this.shadowRoot.appendChild(linkElem);
        this._container = document.createElement("div");
        this.shadowRoot.appendChild(this._container);
        
        this._btn = document.createElement("button");
        this._btn.classList.add("homeBtn");

        this._container.appendChild(this._btn);
        this._container.append("Questionnaire App");
        this._container.classList.add("appBar");

        this._adminbtn = document.createElement("button");
        this._adminbtn.append("Admin");
        this._container.appendChild(this._adminbtn);
    }
}

customElements.define('app-bar', AppBar);