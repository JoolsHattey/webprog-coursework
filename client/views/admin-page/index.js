"use strict";

import { Component } from '../../components/component.js';
import { Card } from '../../components/card/index.js';
import { routerInstance } from '../../app.js';

export class AdminPage extends Component {
    constructor() {
        super();
        this.container.classList.add("page");
        this.addTemplate("/views/admin-page/index.html").then(() => {
            this.qContainer = this.shadowRoot.querySelector('#quizsContainer');
            this.getEditableQuestionnaires();
        })
        // this.createUploadButton();
    }

    async getEditableQuestionnaires() {
        const response = await fetch("/api/questionnaires")

        // const quizes = document.createElement("div");

        response.json().then(data => {
            data.forEach(item => {
                const q = new Card();
                q.createTitle(item.name);
                q.setOnClick(evt => routerInstance.navigate(`/quiz/${item.uid}/edit`));
                this.qContainer.appendChild(q);
            });
        });
        // this.container.appendChild(quizes);
    }
}

customElements.define('admin-screen', AdminPage);