'use strict';

import { Component } from "../component.js";

export class Chart extends Component {
    constructor() {
        super({
            stylesheet: '/components/chart/chart.component.css'
        });
        this.canvas = document.createElement('canvas');
        this.container.append(this.canvas);
        this.initElement();
    }

    initElement() {
        this.canvas.width = 300;
        this.canvas.height = 300;
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.width = '60%'
    }

    addLegend(data, labels) {
        const legend = document.createElement('div');
        legend.classList.add('legend');
        for(const [i, v] of data.entries()) {
            const item = document.createElement('div');
            item.append(labels[i]);
            item.append(v);
            legend.append(item);
        };
        this.container.append(legend);
    }
}