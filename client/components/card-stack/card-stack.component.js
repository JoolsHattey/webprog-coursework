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
            el.style.transform = `scale(${1-(i*0.1)})`;
            el.style.marginTop = `${(cards.length-i)*9}px`;
        }
        this.currentCard = 0;
    }
    next() {
        if(this.currentCard < this.cards.length) {
            console.log('NEXT')
            this.cards[this.currentCard].style.transform = `translate3d(0, ${window.innerHeight-300}px, 0)`;
            // this.cards[this.currentCard].style.transform = `scale(${1-(this.currentCard*0.1)})`;
            this.cards[this.currentCard].style.marginTop = `${(this.cards.length-this.currentCard)*9}px`
            for(const [i, el] of this.cards.entries()) {
                if(i > this.currentCard) {
                    el.style.transform = `scale(${1-((i-this.currentCard)*0.1)})`;
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
                    el.style.transform = `scale(${1-((i-this.currentCard+1)*0.1)})`;
                }
            }
            
        }
    }
}

customElements.define('card-stack', CardStack);