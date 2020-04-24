'use strict';

import { Component } from "../component.js";
import { $ } from "../../app.js";

export class ModalCard extends Component {
    constructor(options) {
        super(options);
        this.addStyleSheet("/components/card/styles.css");
        this.addStyleSheet("/components/modal-card/styles.css");
        this.container.classList.add("card");
        this.container.classList.add("modal");
        this.initElement();
    }
    initElement() {
        this.overlay = document.createElement('div');
        this.overlay.classList.add('overlay');
        this.shadowRoot.appendChild(this.overlay);
        this.templatePromise.then(() => {
            this.resultsObservable = {
                subscribe: observer => {
                    $(this, '#saveBtn').onclick = () => {
                        observer.next("yiss");
                        this.close();
                    }
                    $(this, '#cancelBtn').onclick = () => {
                        observer.next();
                        this.close();
                    }
                }
            }
        })
    }
    open() {
        this.container.classList.add('opened');
        this.overlay.classList.add('show');
    }

    close() {
        this.container.classList.remove('opened');
        this.overlay.classList.remove('show');
    }
}

customElements.define('modal-card', ModalCard);