'use strict';

import { Component } from "../component.js";
import { $ } from "../../app.js";

export class CardStack extends Component {
    constructor() {
        super({
            stylesheet: '/components/card-stack/card-stack.component.css'
        });
        this.cardContainer = document.createElement('div');
        this.container.appendChild(this.cardContainer);
    }

    init(cards) {
        this.touchStartEvent = (ev) => this.touchStart(ev);
        this.touchMoveEvent = (ev) => this.touchMove(ev);
        this.touchEndEvent = (ev) => this.touchEnd(ev);
        this.cards = cards;
        this.cardContainer.classList.add('linearMode')
        for(const [i, el] of cards.entries()) {
            el.classList.add('stackedCard');
            this.cardContainer.appendChild(el);
            el.style.zIndex = cards.length-i;
            el.style.transformOrigin = 'top';
            el.style.transform = `scale3d(${1-(i*0.1)}, ${1-(i*0.1)}, ${1-(i*0.1)})`;
            el.style.transform += `translate3d(0, ${-(i*5)}px, 0)`;
            el.addEventListener('touchstart', this.touchStartEvent);
            el.addEventListener('touchmove', this.touchMoveEvent);
            el.addEventListener('touchend', this.touchEndEvent);
            if(i > 2) {
                el.style.opacity = 0;
                // el.classList.add('fadeOut');
            }
        }
        this.currentCard = 0;
        this.hidden = true;
        this.style.opacity = 0;
    }
    next() {
        if(this.hidden) {
            this.hidden = false;
            this.style.opacity = 1;
        }
        else if(this.currentCard < this.cards.length) {
            console.log('NEXT')
            this.cards[this.currentCard].style.transform = `translate3d(0, ${window.innerHeight-300}px, 0)`;
            for(const [i, el] of this.cards.entries()) {
                if(i > this.currentCard) {
                    if(i-this.currentCard < 4) {
                        el.style.opacity = 1;
                        // el.classList.add('fadeIn');
                    }
                    el.style.transform = `scale3d(${1-((i-this.currentCard-1)*0.1)}, ${1-((i-this.currentCard-1)*0.1)}, ${1-((i-this.currentCard-1)*0.1)})`;
                    el.style.transform += `translate3d(0, ${-(((i-this.currentCard)-1)*5)}px, 0)`;
                    console.log(el, i)
                }
            }
            this.currentCard++;
        }
    }
    prev() {
        if(this.currentCard > 0) {
            console.log('BACK')
            this.currentCard--;
            this.cards[this.currentCard].style.transform = 'translate3d(0, 0, 0)';
            for(const [i, el] of this.cards.entries()) {
                if(i > this.currentCard) {
                    if(i-this.currentCard > 2) {
                        el.style.opacity = 0;
                        // el.classList.add('fadeOut');
                    }
                    el.style.transform = `scale3d(${1-((i-this.currentCard)*0.1)}, ${1-((i-this.currentCard)*0.1)}, ${1-((i-this.currentCard)*0.1)})`;
                    el.style.transform += `translate3d(0, ${-((i-this.currentCard)*5)}px, 0)`;
                }

            }
            
        }
    }
    touchStart(event) {
        console.log(event.target)
        event.target.style.transition = '0s'
        this.touchStartPos = event.changedTouches[0].clientY;
        this.touchStartTime = event.timeStamp;
    }
    touchMove(event) {
        event.preventDefault();
        event.target.style.transform = `translate3d(0, ${event.changedTouches[0].clientY-this.touchStartPos}px, 0)`;

    }
    touchEnd(event) {
        event.target.style.transition = '0.5s'
        const speed = (Math.abs(this.touchStartPos-event.changedTouches[0].clientY))/(event.timeStamp-this.touchStartTime);
        console.log(speed)
        if(speed > 0.5) {
            this.next();
        } else {
            event.target.style.transform = 'translate3d(0, 0, 0)';
        }
    }
    // switchToFlow() {
    //     console.log("FLOW")
    //     this.cardContainer.classList.add('flowMode')
    //     for(const [i, el] of this.cards) {
    //         el.classList.remove('stackedCard')
    //         el.style.transform = 'scale3d(1,1,1)';
    //         el.style.display = ''
    //         el.style.opacity = 1;
    //         el.removeEventListener('touchstart', this.touchStartEvent);
    //         el.removeEventListener('touchmove', this.touchMoveEvent);
    //         el.removeEventListener('touchend', this.touchEndEvent);

    //         if(i > this.currentCard) {
    //             el.style.transform = `translate3d(0, ${}, 0)`
    //         }

    //     })
    //     this.container.classList.add('flowModeScroll')
    //     this.cardContainer.classList.remove('linearMode')
    // }
    switchToStack() {}

    get currentCard() {
        return this.getAttribute('currentcard');
    }
    set currentCard(newValue) {
        this.setAttribute('currentcard', newValue);
    }
}

customElements.define('card-stack', CardStack);