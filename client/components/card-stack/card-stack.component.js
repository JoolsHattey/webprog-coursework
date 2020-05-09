'use strict';

import { Component } from "../component.js";

export class CardStack extends Component {
    constructor() {
        super({
            stylesheet: '/components/card-stack/card-stack.component.css'
        });
    }

    init(cards) {
        this.cards = cards;
        for(const [i, el] of cards.entries()) {
            this.container.appendChild(el);
            el.style.zIndex = cards.length-i;
            el.style.transformOrigin = 'top';
            el.style.transform = `scale3d(${1-(i*0.1)}, ${1-(i*0.1)}, ${1-(i*0.1)})`;
            el.style.marginTop = `${(cards.length-i)*9}px`;
            el.addEventListener('touchstart', (ev) => this.touchStart(ev, el));
            el.addEventListener('touchmove', (ev) => this.touchMove(ev, el));
            el.addEventListener('touchend', (ev) => this.touchEnd(ev, el));
            if(i > 2) {
                el.style.opacity = 0;
                // el.classList.add('fadeOut');
            }
        }
        this.currentCard = 0;
    }
    next() {
        if(this.currentCard < this.cards.length) {
            console.log('NEXT')
            this.cards[this.currentCard].style.transform = `translate3d(0, ${window.innerHeight-300}px, 0)`;
            this.cards[this.currentCard].style.marginTop = `${(this.cards.length-this.currentCard)*9}px`
            for(const [i, el] of this.cards.entries()) {
                if(i > this.currentCard) {
                    if(i-this.currentCard < 4) {
                        el.style.opacity = 1;
                        // el.classList.add('fadeIn');
                    }
                    el.style.transform = `scale(${1-((i-this.currentCard-1)*0.1)})`;
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
            this.cards[this.currentCard].style.marginTop = `${(this.cards.length-this.currentCard)*9}px`
            for(const [i, el] of this.cards.entries()) {
                if(i > this.currentCard) {
                    if(i-this.currentCard > 2) {
                        el.style.opacity = 0;
                        // el.classList.add('fadeOut');
                    }
                    el.style.transform = `scale3d(${1-((i-this.currentCard)*0.1)}, ${1-((i-this.currentCard)*0.1)}, ${1-((i-this.currentCard)*0.1)})`;
                }

            }
            
        }
    }
    touchStart(event, el) {
        el.style.transition = '0s'
        this.touchStartPos = event.changedTouches[0].clientY;
        this.touchStartTime = event.timeStamp;
    }
    touchMove(event, el) {
        event.preventDefault();
        console.log(event, el)
        el.style.transform = `translate3d(0, ${event.changedTouches[0].clientY-this.touchStartPos}px, 0)`;

    }
    touchEnd(event, el) {
        el.style.transition = '0.5s'
        const speed = (Math.abs(this.touchStartPos-event.changedTouches[0].clientY))/(event.timeStamp-this.touchStartTime);
        console.log(speed)
        if(speed > 0.5) {
            this.next();
        } else {
            el.style.transform = 'translate3d(0, 0, 0)';
        }
    }
}

customElements.define('card-stack', CardStack);