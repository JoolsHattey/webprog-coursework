'use strict';

import { Chart } from "./chart.component.js";

export class PieChart extends Chart {
    constructor(data, labels) {
        super();
        this.drawChart(data, labels);
    }
    drawChart(data, labels) {
        let lastend = 0;
        let myTotal = 0; // Automatically calculated so don't touch
        const myColor = ['red', 'green', 'blue', 'purple']; // Colors of each slice

        for (let e = 0; e < data.length; e++) {
            myTotal += data[e];
        }

        this.addLegend(data, labels, myTotal, myColor)

        for (let i = 0; i < data.length; i++) {
            this.ctx.fillStyle = myColor[i];
            this.ctx.beginPath();
            this.ctx.moveTo(this.canvas.width / 2, this.canvas.height / 2);
            // Arc Parameters: x, y, radius, startingAngle (radians), endingAngle (radians), antiClockwise (boolean)
            this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, this.canvas.height / 2, lastend, lastend + (Math.PI * 2 * (data[i] / myTotal)), false);
            this.ctx.lineTo(this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.fill();
            lastend += Math.PI * 2 * (data[i] / myTotal);
        }
    }
}
window.customElements.define('pie-chart', PieChart);