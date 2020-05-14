'use strict';

import { $ } from "./app.js";

export class TouchDrag {
    constructor() {
        this.items = [];
    }

    /**
     * Initialise the list with the container that holds the elements and the parent document/shadow root
     * @param {Element} container 
     * @param {Document|ShadowRoot} parentDoc 
     */
    init(container, parentDoc) {
        this.container = container;
        this.parentDoc = parentDoc;
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
    }

    touchStart(e, el) {
        el.style.transition = '0s';
        this.touchStartPos = e.changedTouches[0].clientY;
    }
    touchMove(e, el) {
        e.preventDefault();
        el.style.transform = `translate3d(0,${e.changedTouches[0].clientY-this.touchStartPos}px,0)`;
        (this.parentDoc.elementsFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY)).some(item => {
            if(item.classList.contains('qAnswerItem') && !(item.index === el.index)) {
                this.tempNewIndex = item.index;
                if(e.changedTouches[0].clientY<this.touchStartPos) {
                    // Moving item up
                    Array.from(this.container.children).forEach(opt => {
                        if(parseInt(opt.index) >= parseInt(item.index) && !(opt.index === el.index)) {
                            opt.style.transition = '0.3s'
                            opt.style.transform = 'translate3d(0,100%,0)';
                        } else if(parseInt(opt.index) < parseInt(item.index)) {
                            opt.style.transform = 'translate3d(0,0,0)';
                        }
                    })
                } else {
                    // Moving item down
                    Array.from(this.container.children).forEach(opt => {
                        if(parseInt(opt.index) <= parseInt(item.index) && !(opt.index === el.index)) {
                            opt.style.transition = '0.3s'
                            opt.style.transform = 'translate3d(0,-100%,0)';
                        }
                        if(parseInt(opt.index) > parseInt(item.index) && !(opt.index === el.index)) {
                            opt.style.transform = 'translate3d(0,0,0)';
                        }
                    })
                }
                
                return true;
            }
        });
    }
    touchEnd(e, el) {
        el.style.transition = '0.3s';
        el.style.transform = `translate3d(0,0,0)`;
        this.moveOption(el.index, this.tempNewIndex, el);
    }


moveOption(oldIndex, newIndex, el) {
    const event = new CustomEvent('reorder', {
        detail: {
            oldIndex,
            newIndex
        }
    })
    this.container.dispatchEvent(event)

    const currentEl = this.container.removeChild(el);
    this.container.insertBefore(currentEl, this.container.children[newIndex]);
    Array.from(this.container.children).forEach(item => {
        item.style.transition = '0s';
        item.style.transform = 'translate3d(0,0,0)';
    });
    
    if(newIndex < oldIndex ) {
        currentEl.index = newIndex;
        $(currentEl, 'text-input').setValue(currentEl.index + $(currentEl,  'text-input').getValue());
        for(let i=newIndex+1; i<=oldIndex; i++) {
            this.container.children[i].index++;
            $(this.container.children[i], 'text-input').setValue(this.container.children[i].index + $(this.container.children[i], 'text-input').getValue());
        }
    } else {
        currentEl.index = newIndex+1;
        $(currentEl, 'text-input').setValue(currentEl.index + $(currentEl,  'text-input').getValue());
        for(let i=newIndex; i>=oldIndex; i--) {
            this.container.children[i].index--;
            $(this.container.children[i], 'text-input').setValue(this.container.children[i].index + $(this.container.children[i], 'text-input').getValue());
        }
    }
}
}