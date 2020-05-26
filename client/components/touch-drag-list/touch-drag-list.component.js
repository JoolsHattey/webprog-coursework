'use strict';

import { Component } from '../component.js';
import { $ } from '../../app.js';

export class TouchDragList extends Component {
  constructor() {
    super({ stylesheet: '/components/touch-drag-list/touch-drag-list.component.css' });
    this.items = [];
    this.style.display = 'block';
    this.container.style.margin = '0';
  }

  init(query, scroll) {
    this.queryName = query;
    this.scrollMode = scroll;
    if (scroll) {
      this.container.style.height = '100%';
      this.container.style.overflow = 'scroll';
    }
  }

  /**
   * Adds a new item to the list and attaches touch event listeners
   * @param {Element} el The list item to be added
   * @param {Element} dragHandle The drag handle of the item to control movement
   */
  addItem(el, dragHandle) {
    el.index = this.items.length;
    this.container.append(el);
    const dragHandleEl = $(el, dragHandle);
    dragHandleEl.addEventListener('touchstart', e => this.touchStart(e, el, dragHandleEl));
    dragHandleEl.addEventListener('touchmove', e => this.touchMove(e, el));
    dragHandleEl.addEventListener('touchend', e => this.touchEnd(e, el, dragHandleEl));
    this.items.push(el);
    if (this.scrollMode) {
      this.container.scrollTo(0, this.container.scrollHeight);
    }
  }

  removeItem(el, index) {
    this.container.removeChild(el);
    this.items.splice(index, 1);
  }

  removeAllItems() {
    Array.from(this.container.children).forEach(el => el.remove());
  }

  touchStart(e, el, dragHandle) {
    this.tempNewIndex = el.index;
    dragHandle.style.opacity = 1;
    el.style.zIndex = '199!important';
    el.classList.add('dragging');
    this.things = 0;
    this.scrollAmount = 0;
    this.startTime = e.timeStamp;
    el.style.transition = '0s';
    this.touchStartPos = e.changedTouches[0].clientY;
  }

  touchMove(e, el) {
    e.stopPropagation();
    e.preventDefault();
    const touchPos = e.changedTouches[0].clientY;
    const pos = touchPos - this.touchStartPos;
    if (this.oldPos < pos) {
      this.swipeDirection = 'down';
    } else {
      this.swipeDirection = 'up';
    }
    if (this.scrollMode) {
      if ((touchPos + 100) > window.innerHeight) {
        this.container.scrollBy(0, 5);
        this.scrollAmount += 5;
      }
    }
    // Prevent item from being dragged out of container
    if (touchPos > this.getBoundingClientRect().top && touchPos < this.getBoundingClientRect().bottom) {
      el.style.transform = `translate3d(0,${pos + this.scrollAmount}px,0)`;
    }
    // Detect collisions with other list items by getting elements from point of active item
    const elements = this.shadowRoot.elementsFromPoint(window.innerWidth / 2, touchPos);
    // Filter by element query name
    const item = elements.find(x => (x.classList.contains(this.queryName) || x.tagName.toLowerCase() === this.queryName) && !(x.index === el.index));
    if (item) {
      item.style.transition = '0.3s';
      if (this.swipeDirection === 'up') {
        if (item.index < el.index) {
          item.style.transform = 'translate3d(0,100%,0)';
          this.tempNewIndex = item.index;
        } else if (item.index > el.index) {
          item.style.transform = 'translate3d(0,0,0)';
          if (item.index === el.index + 1) {
            this.tempNewIndex = el.index;
          } else {
            this.tempNewIndex = item.index;
          }
        }
      } else if (this.swipeDirection === 'down') {
        if (item.index < el.index) {
          item.style.transform = 'translate3d(0,0,0)';
          if (item.index === el.index - 1) {
            this.tempNewIndex = el.index;
          } else {
            this.tempNewIndex = item.index;
          }
        } else if (item.index > el.index) {
          item.style.transform = 'translate3d(0,-100%,0)';
          this.tempNewIndex = item.index;
        }
      }
    }
    this.oldPos = pos;
  }

  touchEnd(e, el, dragHandle) {
    dragHandle.style.opacity = 0.5;
    e.stopPropagation();
    e.preventDefault();
    el.classList.remove('dragging');
    el.style.transition = '0.3s';
    if (el.index !== this.tempNewIndex) {
      this.moveItem(el.index, this.tempNewIndex, el);
    }
    el.style.transform = 'translate3d(0,0,0)';
  }


  moveItem(oldIndex, newIndex, el) {
    const event = new CustomEvent('reorder', {
      detail: {
        oldIndex,
        newIndex,
      },
    });
    this.dispatchEvent(event);

    const currentEl = this.container.removeChild(el);
    this.container.insertBefore(currentEl, this.container.children[newIndex]);
    Array.from(this.container.children).forEach(item => {
      item.style.transition = '0s';
      item.style.transform = 'translate3d(0,0,0)';
    });

    if (newIndex < oldIndex) {
      currentEl.index = newIndex;
      for (let i = newIndex + 1; i <= oldIndex; i++) {
        this.container.children[i].index++;
      }
    } else {
      currentEl.index = newIndex + 1;
      for (let i = newIndex; i >= oldIndex; i--) {
        this.container.children[i].index--;
      }
    }
  }
}
window.customElements.define('touch-drag-list', TouchDragList);
