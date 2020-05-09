'use strict';

import { Component } from "../component.js";
import { $, Observable } from "../../app.js";
import { Card } from "../card/card.component.js";

export class ModalCard extends Card {
    /**
     * 
     * @param {Object} componentStructure 
     * @param {string} componentStructure.template HTML template to define component structure
     * @param {string} componentStructure.stylesheet CSS stylesheet for component styling
     * @param {*} options 
     * @param {string} width Either px or %
     * @param {string} height 
     */
    constructor(componentStructure, options, width, height) {
        super(componentStructure);
        this.addStyleSheet("/components/modal-card/modal-card.component.css");
        this.container.classList.add("modal");
        this.dialogData = options;
        this.style.setProperty('--modal-width', width);
        this.style.setProperty('--modal-height', height);
        this.initElement();
    }
    async initElement() {
        this.overlay = document.createElement('div');
        this.overlay.classList.add('overlay');
        this.shadowRoot.appendChild(this.overlay);
        await this.templatePromise;
        const saveBtn = $(this, '#saveBtn');
        const cancelBtn = $(this, '#cancelBtn');
        console.log(cancelBtn);
        this.resultsObservable = new Observable(observer => {
            if(saveBtn) {
                saveBtn.onclick = () => {
                    console.log(this.dialogData)
                    for(const option in this.dialogData) {
                        if(option !== 'file') {
                            this.dialogData[option] = $(this, `#${option}`).getValue();
                        }
                    }
                    observer.next(this.dialogData);
                    this.close();
                }    
            }
            if(cancelBtn) {
                cancelBtn.onclick = () => {
                    observer.next();
                    this.close();
                }    
            }
        });
    }
    open() {
        document.body.append(this)
        for(const option in this.dialogData) {
            $(this, `#${option}`).setValue(this.dialogData[option]);
        }
        this.container.classList.add('opened');
        this.overlay.classList.add('show');
    }

    close() {
        document.body.removeChild(this);
        this.container.classList.remove('opened');
        this.overlay.classList.remove('show');
    }
}

customElements.define('modal-card', ModalCard);