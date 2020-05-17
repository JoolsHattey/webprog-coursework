'use strict';

import { Component } from "../component.js";
import { $ } from "../../app.js";

export class JsonFileUpload extends Component {
    constructor() {
        super({
            template: '/components/file-upload/json-file-upload.component.html',
            stylesheet: '/components/file-upload/json-file-upload.component.css'
        });
        this.initElement();
    }

    async initElement() {
        await this.templatePromise;
        $(this, 'input').addEventListener('change', (e) => {
            $(this, '#fileName').append(e.target.files[0].name)
            this.getValue().then(value => {
                const uploadEvent = new CustomEvent('upload', {detail: value});
                this.dispatchEvent(uploadEvent);
            });
        });
    }

    async getValue() {
        const inputEl = $(this, 'input');
        return JSON.parse(await inputEl.files[0].text());
    }
}

window.customElements.define('json-file-upload', JsonFileUpload);