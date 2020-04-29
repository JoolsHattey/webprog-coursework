'use strict';

import { Component } from "../component.js";
import { $ } from "../../app.js";
import { Card } from "../card/card.component.js";

export class ModalCard extends Card {
    constructor(componentStructure, options) {
        super(componentStructure);
        this.addStyleSheet("/components/modal-card/modal-card.component.css");
        this.container.classList.add("modal");
        this.dialogData = options;
        this.initElement();
    }
    async initElement() {
        this.overlay = document.createElement('div');
        this.overlay.classList.add('overlay');
        this.shadowRoot.appendChild(this.overlay);
        await this.templatePromise;
        this.resultsObservable = {
            subscribe: observer => {
                $(this, '#saveBtn').onclick = () => {
                    for(const option in this.dialogData) {
                        this.dialogData[option] = $(this, `#${option}`).getValue();
                    }
                    observer.next(this.dialogData);
                    this.close();
                }
                $(this, '#cancelBtn').onclick = () => {
                    observer.next();
                    this.close();
                }
            }
        }
    }
    open() {
        for(const option in this.dialogData) {
            $(this, `#${option}`).setValue(this.dialogData[option]);
        }
        this.container.classList.add('opened');
        this.overlay.classList.add('show');
    }

    close() {
        this.container.classList.remove('opened');
        this.overlay.classList.remove('show');
    }
}

customElements.define('modal-card', ModalCard);