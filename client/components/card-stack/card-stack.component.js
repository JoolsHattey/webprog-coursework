'use strict';

import { Component } from "../component.js";

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
      el.addEventListener('touchstart', this.touchStartEvent);
      el.addEventListener('touchmove', this.touchMoveEvent);
      el.addEventListener('touchend', this.touchEndEvent);
      el.style.opacity = 0;

      if(i < 4) this.cardContainer.appendChild(el);
    }
    this.currentCard = 0;
    this.notInit = true;
    this.style.opacity = 0;
  }
  next() {
    if(this.currentCard < this.cards.length) {
      if(!this.lockNext) {
        if(this.notInit) {
          this.notInit = false;
          this.style.opacity = 1;
          for(const [i, el] of this.cards.entries()) {
            el.style.transitionDelay = `${i*0.15}s`;
          }
        } else {
          for(const [i, el] of this.cards.entries()) {
            el.style.transitionDelay = `0s`;
          }
          this.currentCard++;
        }
        this.lockNext = true;
        this.animateNext();
      }
       else {
        const newEvent = new CustomEvent('lockrejected', {
          detail: {
            currentCard: this.currentCard
          }
        });
        this.dispatchEvent(newEvent);
      }
    }
  }
  prev() {
    if(this.currentCard > 0) {
      this.lockNext = false;
      this.currentCard--;
      this.cards[this.currentCard].style.transition = '0.5s'
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
    event.target.style.transition = '0s'
    this.touchStartPos = event.changedTouches[0].clientY;
    this.touchStartTime = event.timeStamp;
  }
  touchMove(event) {
    event.preventDefault();
    // Swipe down
    if(event.changedTouches[0].clientY-this.touchStartPos > 0) {
      if(!(event.target.index === this.cards.length-1)) {
        event.target.style.transform = `translate3d(0, ${event.changedTouches[0].clientY-this.touchStartPos}px, 0)`;
      }
    } else {
      const moveValue = (event.changedTouches[0].clientY-this.touchStartPos)
      for(const [i, el] of this.cards.entries()) {
        el.style.transition = '0s'
        const tranlateValue = -(((i-this.currentCard)*15)-(moveValue/50));
        const scaleValue = 1-(tranlateValue / -150)
        if(i >= this.currentCard) {
          el.style.transform = `scale3d(${scaleValue}, ${scaleValue}, ${scaleValue})`;
          el.style.transform += `translate3d(0, ${tranlateValue}px, 0)`;
        } else if(i === this.currentCard - 1) {
          el.style.transform = `translate3d(0, ${((event.changedTouches[0].clientY-this.touchStartPos)+window.innerHeight)}px, 0)`;
        } else if(i === this.currentCard + 2) {
          // el.style.opacity = 
        }
      }
    }
  }
  touchEnd(event) {
    event.stopPropagation();
    this.cards.forEach(el => {
      el.style.transition = '0.5s';
    });
    event.target.style.transition = '0.5s'
    const speed = (Math.abs(this.touchStartPos-event.changedTouches[0].clientY))/(event.timeStamp-this.touchStartTime);
    if(this.touchStartPos>event.changedTouches[0].clientY) {
      this.prev();
    } else {
      if(this.lockNext) {
        const newEvent = new CustomEvent('lockrejected', {
          detail: {
            currentCard: this.currentCard
          }
        });
        this.dispatchEvent(newEvent);
        event.target.style.transform = 'translate3d(0, 0, 0)';
      } else if(speed > 0.5) {
        this.next();
      } else {
        event.target.style.transform = 'translate3d(0, 0, 0)';
      }
      console.log('down')
    }

  }

  get currentCard() {
    return parseInt(this.getAttribute('currentcard'));
  }
  set currentCard(newValue) {
    this.setAttribute('currentcard', newValue);
  }
}

window.customElements.define('card-stack', CardStack);