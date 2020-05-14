'use strict';

import { Component } from "../component.js";

export class TouchDragList extends Component {
    constructor() {
        super();
        this.items = [];
    }

    init(query) {
        this.things = 0;
        this.queryName = query;
    }

    /**
     * Adds a new item to the list and attaches touch event listeners
     * @param {Element} el 
     */
    addItem(el) {
        this.items.push(el);
        el.addEventListener('touchstart', e => this.touchStart(e, el));
        el.addEventListener('touchmove', e => this.touchMove(e, el));
        el.addEventListener('touchend', e => this.touchEnd(e, el));
        console.log(this.items);
        this.container.append(el);
    }

    touchStart(e, el) {
        this.things = 0;
        this.startTime = e.timeStamp;
        el.style.transition = '0s';
        this.touchStartPos = e.changedTouches[0].clientY;
    }
    touchMove(e, el) {
        e.stopPropagation();
        e.preventDefault();
        const pos = e.changedTouches[0].clientY-this.touchStartPos;
        el.style.transform = `translate3d(0,${pos}px,0)`;

        if(this.oldPos<pos) {
            this.currentDirection = 'down'
        } else {
            this.currentDirection = 'up'
        }
        if(!this.swipeDirection) {
            if(e.changedTouches[0].clientY<this.touchStartPos) {
                this.swipeDirection = 'up';
            } else {
                this.swipeDirection = 'down';
            }
        }
        
        // Detect collisions with other list items by getting elements from point of active item
        (this.shadowRoot.elementsFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY)).some(item => {
            this.things++;
            if((item.classList.contains(this.queryName) || item.tagName.toLowerCase() === this.queryName) && !(item.index === el.index)) {
                console.log(item)
                this.tempNewIndex = item.index;
                if(this.swipeDirection === 'up') {
                    item.style.transition = '0.3s';
                    if(this.currentDirection === 'down') {
                        item.style.transform = 'translate3d(0,0,0)';
                        this.tempNewIndex = item.index+1;
                    } else {
                        item.style.transform = 'translate3d(0,100%,0)';
                    }
                } else {
                    item.style.transition = '0.3s';
                    if(this.currentDirection === 'up') {
                        item.style.transform = 'translate3d(0,0,0)';
                        this.tempNewIndex = item.index-1;
                    } else {
                        item.style.transform = 'translate3d(0,-100%,0)';
                    }
                }
                return true;
            }
        });
        this.oldPos = pos;
    }
    touchEnd(e, el) {
        e.stopPropagation();
        e.preventDefault();
        this.swipeDirection = null;
        el.style.transition = '0.3s';
        this.moveItem(el.index, this.tempNewIndex, el);
        
        el.style.transform = `translate3d(0,0,0)`;
        
        console.log(`did ${this.things} things, ${this.things/((e.timeStamp-this.startTime)/1000)} per second`)
    }


    moveItem(oldIndex, newIndex, el) {
        const event = new CustomEvent('reorder', {
            detail: {
                oldIndex,
                newIndex
            }
        });
        this.dispatchEvent(event);

        const currentEl = this.container.removeChild(el);
        this.container.insertBefore(currentEl, this.container.children[newIndex]);
        Array.from(this.container.children).forEach(item => {
            item.style.transition = '0s';
            item.style.transform = 'translate3d(0,0,0)';
        });
        
        if(newIndex < oldIndex ) {
            currentEl.index = newIndex;
            for(let i=newIndex+1; i<=oldIndex; i++) {
                this.container.children[i].index++;
            }
        } else {
            currentEl.index = newIndex+1;
            for(let i=newIndex; i>=oldIndex; i--) {
                this.container.children[i].index--;
            }
        }
    }
}
customElements.define('touch-drag-list', TouchDragList);