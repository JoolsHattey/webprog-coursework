'use strict';

import { Chart } from "./chart.component.js";

export class BarChart extends Chart {
    constructor(data) {
        super();
        this.drawChart(data)
    }
    drawChart(data) {

    }
}
customElements.define('bar-chart', BarChart);