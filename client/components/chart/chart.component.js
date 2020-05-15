'use strict';

import { Component } from "../component.js";

export class Chart extends Component {
    constructor() {
        super();
        this.canvas = document.createElement('canvas');
        this.container.append(this.canvas);
        this.initElement();
    }

    initElement() {
        this.canvas.width = 300;
        this.canvas.height = 300;
        this.ctx = this.canvas.getContext('2d');
    }
}