"use strict";

import { Component } from '../component.js';

export class ProgressIndicator extends Component {
    constructor(numQuestions) {
        super({
            template: '/components/progress-indicator/index.html',
            styles: '/components/progress-indicator/styles.css'
        });
        this.setAttribute('step', 0);
        this.setAttribute('progress', 0);
        console.log(getComputedStyle(this).getPropertyValue('--prog-width'))
    }
    setProgress(num) {
        this.style.setProperty('--prog-width', `${num}%`)
    }
    increment() {
        this.step++;
        console.log(this.step/this.steps)
        this.setProgress((this.step/this.steps)*100);
        this.progWidth = `${this.step / this.steps * 100}%`;
    }
    get progWidth() {
        return this.getAttribute('prog-width');
    }
    set progWidth(newValue) {
        this.setAttribute('prog-width', newValue);
    }
    get step() {
        return this.getAttribute('step');
    }
    set step(newValue) {
        this.setAttribute('step', newValue)
        this.incrementor = 300/newValue;
    }
    get steps() {
        return this.getAttribute('steps');
    }
    set steps(newValue) {
        this.setAttribute('steps', newValue);
    }
    get progress() {
        return this.getAttribute('progress');
    }
    set progress(newValue) {
        this.setAttribute('progress', newValue);
        this.setProgress(newValue);
    }
    get incrementor() {
        return this.getAnimations('incrementor');
    }
    set incrementor(newValue) {
        this.setAttribute('incrementor', newValue);
    }
}

customElements.define('progress-indicator', ProgressIndicator);