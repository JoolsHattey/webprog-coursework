

export class Component extends HTMLElement {
    /**
     * 
     * @param {Object} options 
     * @param {string} options.template HTML template to define component structure
     * @param {string} options.stylesheet CSS stylesheet for component styling
     */
    constructor(options) {
        super();
        this.attachShadow({mode: 'open'});
        this.head = document.createElement("head");
        this.addStyleSheet("/styles.css");
        this.shadowRoot.appendChild(this.head);
        this.container = document.createElement("body");
        this.shadowRoot.appendChild(this.container);
        if(options) {
            if(options.stylesheet) {
                this.addStyleSheet(options.stylesheet);
            }
            if(options.template) {
                this.templatePromise = this.addTemplate(options.template);
            }
        }
    }
    connectedCallback() {
        if(this.hasAttribute('draggable')) {
            this.addEventListener('touchstart', this.touchStart);
            this.addEventListener('touchmove', this.touchMove);
        }
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
    touchStart(e) {
        this.touchStartPos = e.changedTouches[0].clientY;
    }
    touchMove(e) {
        this.container.style.transform = `translateY(${e.changedTouches[0].clientY-this.touchStartPos}px)`
        e.preventDefault();
    }
}