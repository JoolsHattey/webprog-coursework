import { $ } from "../app.js";


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
    async connectedCallback() {
        if(this.hasAttribute('draggable')) {
            await this.templatePromise;
            const dragHandle = $(this, '#dragHandle');
            dragHandle.addEventListener('touchstart', e => this.touchStart(e));
            dragHandle.addEventListener('touchmove', e => this.touchMove(e));
            dragHandle.addEventListener('touchend', e => this.touchEnd(e))
            dragHandle.addEventListener('dragstart', e => this.drag(e));
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
        this.style.transition = '0s';
        this.touchStartPos = e.changedTouches[0].clientY;
    }
    touchMove(e) {
        this.style.transform = `translate3d(0, ${e.changedTouches[0].clientY-this.touchStartPos}px, 0)`;
        e.preventDefault();
    }
    touchEnd(e) {
        this.style.transition = '0.3s';
        this.style.transform = 'translate3d(0, 0, 0)';
    }
    drag(e) {console.log(e)}
}