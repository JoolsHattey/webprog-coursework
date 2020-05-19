'use strict';

import { Chart } from "./chart.component.js";

export class BarChart extends Chart {
    constructor(data) {
        super();
        this.drawChart(data)
    }
    drawChart(data) {
        console.log(data)
        let i = 0;
        this.total = 0;
        for(const name in data) {
            this.total += data[name];
        }
        for(const name in data) {
            this.drawBar(name, data[name], i);
            i++;
        }
    }
    drawBar(label, value, i) {
        this.ctx.fillStyle = '#439889';
        this.ctx.fillRect(0,i*70, value/this.total*300, 50);
        this.ctx.fillStyle = 'black';
        this.ctx.font = "1.5rem Roboto"
        this.ctx.textAlign = "left"
        this.ctx.fillText(label, 10, i*70+30);
        this.ctx.textAlign = "right"
        this.ctx.fillText(`${(value/this.total*100).toFixed(1)}%`, 300, i*70+30);
    }
}
window.customElements.define('bar-chart', BarChart);