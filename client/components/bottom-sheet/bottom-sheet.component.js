'use strict';

import { Component } from '../component.js';
import { $ } from '../../utils.js';

/**
 * @typedef {Object} ComponentStructure
 * @property {string} options.template HTML template to define component structure
 * @property {string} options.stylesheet CSS stylesheet for component styling
 */

export class BottomSheet extends Component {
  /**
   * @param {ComponentStructure} options
   */
  constructor(options) {
    super(options);
    this.addStyleSheet('/components/bottom-sheet/bottom-sheet.component.css');
    this.initElement();
  }

  async initElement() {
    await this.loaded;
    const chip = document.createElement('div');
    chip.classList.add('chip');
    this.container.children[0].before(chip);
    const saveBtn = $(this, "[data-modal-action='save']");
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.afterCloseCallback(true);
        this.close();
      });
    }
    const cancelBtn = $(this, "[data-modal-action='cancel']");
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        if (this.afterCloseCallback) this.afterCloseCallback();
        this.close();
      });
    }
    this.overlay = document.createElement('div');
    this.overlay.classList.add('overlay');
    this.shadowRoot.append(this.overlay);
    this.overlay.addEventListener('click', () => this.close());
    this.addEventListener('touchstart', (e) => this.touchStart(e));
    this.addEventListener('touchmove', (e) => this.touchMove(e));
    this.addEventListener('touchend', (e) => this.touchEnd(e));
  }

  touchStart(e) {
    this.touchStartTime = e.timeStamp;
    this.container.style.transition = '0s';
    this.startPos = e.changedTouches[0].clientY + (window.innerHeight * 0.3);
    this.touchStartPos = e.changedTouches[0].clientY;
  }

  touchMove(e) {
    e.stopPropagation();
    e.preventDefault();
    const touchPos = e.changedTouches[0].clientY;
    const pos = touchPos - this.startPos;
    if (touchPos > this.touchStartPos) {
      this.container.style.transform = `translate3d(0,${pos}px,0)`;
    }
  }

  touchEnd(e) {
    this.container.style.transition = '0.3s';
    const touchPos = e.changedTouches[0].clientY;
    const pos = touchPos - this.touchStartPos;
    const distance = touchPos - this.touchStartPos;
    const speed = distance / (e.timeStamp - this.touchStartTime);
    if (pos > (window.innerHeight * 0.10) || speed > 0.5) {
      if (this.afterCloseCallback) this.afterCloseCallback();
      this.close();
    } else {
      this.container.style.transform = null;
    }
  }

  open() {
    if (!this.opened) {
      this.opened = true;
      document.body.append(this);
      this.overlay.style.opacity = 0.5;
    }
  }

  close() {
    if (this.opened) {
      this.opened = false;
      this.container.style.transform = 'translate3d(0,0,0)';
      this.overlay.style.opacity = 0;
      window.setTimeout(() => {
        this.container.style.transform = null;
        document.body.removeChild(this);
      }, 300);
    }
  }

  afterClose(callback) {
    this.afterCloseCallback = callback;
  }
}

window.customElements.define('bottom-sheet', BottomSheet);
