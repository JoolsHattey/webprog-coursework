'use strict';

import { Component } from '../component.js';

export class BarChart extends Component {
  constructor(data) {
    super({
      stylesheet: '/components/chart/chart.component.css',
    });
    this.initElement(data);
    this.drawChart(data);
  }

  initElement(data) {
    this.canvas = document.createElement('canvas');
    this.container.append(this.canvas);
    const numItems = data.length;
    this.canvas.width = 600;
    this.canvas.height = 140 * (numItems - 1) + 100;
    this.ctx = this.canvas.getContext('2d');
  }

  drawChart(data) {
    let i = 0;
    this.total = 0;
    data.forEach(element => {
      this.total += element.value;
    });
    data.forEach(element => {
      this.drawBar(element.label, element.value, i);
      i++;
    });
  }

  drawBar(label, value, i) {
    this.ctx.fillStyle = '#439889';
    this.ctx.fillRect(0, i * 140, value / this.total * 600, 100);
    this.ctx.fillStyle = 'black';
    this.ctx.font = '2.25rem Roboto';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(label, 20, i * 140 + 62);
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`${value} / ${parseFloat((value / this.total * 100).toFixed(1))}%`, 600, i * 140 + 62);
  }
}
window.customElements.define('bar-chart', BarChart);
