'use strict';

import { $ } from "../../app.js";
import { Card } from "../card/card.component.js";

export class ModalCard extends Card {

    /**
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
        this.dialogData = options;
        this.style.setProperty('--modal-width', width);
        this.style.setProperty('--modal-height', height);
        this.initElement();
    }

    async initElement() {
        this.overlay = document.createElement('div');
        this.overlay.classList.add('overlay');
        this.shadowRoot.appendChild(this.overlay);
        this.overlay.addEventListener('click', () => this.close())
        await this.templatePromise;
        this.saveBtn = $(this, '#saveBtn');
        this.cancelBtn = $(this, '#cancelBtn');
    }

    afterClosed(callback) {
        if(this.saveBtn) {
            this.saveBtn.onclick = () => {
                console.log(this.dialogData)
                for(const option in this.dialogData) {
                    if(option !== 'file') {
                        this.dialogData[option] = $(this, `#${option}`).getValue();
                    }
                }
                callback(this.dialogData);
                this.close();
            }    
        }
        if(this.cancelBtn) {
            this.cancelBtn.onclick = () => {
                callback();
                this.close();
            }    
        }
    }

    async open() {
        document.body.append(this);
        console.log(this.shadowRoot)
        await this.templatePromise;
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

window.customElements.define('modal-card', ModalCard);