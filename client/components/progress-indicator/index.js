class ProgressIndicator extends HTMLElement {
    constructor(numQuestions) {
        super();
        this._shadowRoot = this.attachShadow({mode: 'open'});
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "styles.css");
        this._shadowRoot.appendChild(linkElem);
        this._container = document.createElement("div");
        this._shadowRoot.appendChild(this._container);
        this._container.style="width: 300px; height: 20px; background-color: red";
        this._progress = document.createElement("div");
        this._progress.style="height: 20px; background-color: green"
        this._container.appendChild(this._progress);
        this._incrementor = 300/numQuestions;
    }
    setProgress(num) {
        this._progress.style=`height: 20px; width:${this._incrementor*num}px; background-color: green`;
    }
}

customElements.define('progress-indicator', ProgressIndicator);