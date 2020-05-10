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
            const scaleValue = 1-((i+4)*0.1);
            const transformValue = -((i+4)*15);
            el.classList.add('stackedCard');
            el.style.zIndex = cards.length-i;
            el.style.transform = `scale3d(${scaleValue}, ${scaleValue}, ${scaleValue})`;
            el.style.transform += `translate3d(0, ${transformValue}px, 0)`;
            if(i < this.cards.length-1) {
                el.addEventListener('touchstart', this.touchStartEvent);
                el.addEventListener('touchmove', this.touchMoveEvent);
                el.addEventListener('touchend', this.touchEndEvent);
            }
            el.style.opacity = 0;

            if(i < 4) this.cardContainer.appendChild(el);
        }
        this.currentCard = 0;
        this.hidden = true;
        // this.style.opacity = 0;
    }
    next() {
        if(this.currentCard < this.cards.length) {
            if(this.hidden) {
                this.hidden = false;
                for(const [i, el] of this.cards.entries()) {
                    el.style.transitionDelay = `${i*0.15}s`;
                }
            } else {
                for(const [i, el] of this.cards.entries()) {
                    el.style.transitionDelay = `0s`;
                }
                this.currentCard++;
            }
            this.animateNext();
        }
    }
    prev() {
        if(this.currentCard > 0) {
            console.log('BACK')
            this.currentCard--;
            this.animateBack();
        }
    }
    animateNext() {
        for(const [i, el] of this.cards.entries()) {
            const scaleValue = 1-((i-this.currentCard)*0.1);
            const tranlateValue = -((i-this.currentCard)*15);
            if(i >= this.currentCard) {
                el.style.transform = `scale3d(${scaleValue}, ${scaleValue}, ${scaleValue})`;
                el.style.transform += `translate3d(0, ${tranlateValue}px, 0)`;
            }
            if(i <= this.currentCard + 2) {
                el.style.opacity = 1;
            }
            if(i === this.currentCard - 1) {
                el.style.transform = `translate3d(0, ${window.innerHeight-250}px, 0)`;
            } else if(i === this.currentCard + 3) {
                this.cardContainer.appendChild(el);
            } else if(i === this.currentCard - 2) {
                this.cardContainer.removeChild(el);
            }
        }
    }
    animateBack() {
        for(const [i, el] of this.cards.entries()) {
            const scaleValue = 1-((i-this.currentCard)*0.1);
            const tranlateValue = -((i-this.currentCard)*15);
            if(i >= this.currentCard) {
                el.style.transform = `scale3d(${scaleValue}, ${scaleValue}, ${scaleValue})`;
                el.style.transform += `translate3d(0, ${tranlateValue}px, 0)`;
            }
            if(i === this.currentCard + 3) {
                el.style.opacity = 0;
            } else if(i === this.currentCard + 4) {
                this.cardContainer.removeChild(el);
            } else if(i === this.currentCard - 1) {
                this.cardContainer.appendChild(el);
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
        return parseInt(this.getAttribute('currentcard'));
    }
    set currentCard(newValue) {
        this.setAttribute('currentcard', newValue);
    }
}

customElements.define('card-stack', CardStack);