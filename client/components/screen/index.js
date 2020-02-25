class ScreenComponent extends HTMLElement {
    constructor() {
        super();
        this.initElement();
        this._home = new HomePage();
        const appBar = new AppBar();
        appBar._btn.onclick = evt => this.homePage();
        appBar._adminbtn.onclick = evt => this.adminPage();
        this._container.appendChild(appBar);
        this.homePage();
    }
    initElement() {
        this._shadowRoot = this.attachShadow({mode: 'open'});
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "styles.css")
        this._shadowRoot.appendChild(linkElem);
        this._container = document.createElement("div");
        this._shadowRoot.appendChild(this._container);
    }
    homePage() {
        if(this._container.contains(this._admin)) {
            this._container.removeChild(this._admin);
        }
        this._home.initElement();
        this._container.appendChild(this._home);
    }
    adminPage() {
        if(this._container.contains(this._home)) {
            this._container.removeChild(this._home);
        }
        this._admin = new AdminPage();
        this._admin.initElement();
        this._container.appendChild(this._admin);
    }
}

customElements.define('screen-elmnt', ScreenComponent);