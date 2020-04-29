"use strict";

import { Router } from './router.js';
import { RouterOutlet } from './components/router-outlet/router-outlet.component.js';
import { getAuthStatus, login, initAuth, authObservable } from './auth.js';
import { HomePage } from './views/home-page/index.js';
import { AdminPage } from './views/admin-page/index.js';
import { QuizPage } from './views/quiz-page/index.js';
import { AppBar } from './components/app-bar/app-bar.component.js';
import { ProgressSpinner } from './components/progress-spinner/progress-spinner.component.js';
import { Icon } from './components/icon/icon.component.js';


/********************************************
 * Client Routes
 * **************************************** */

const routerOutlet = document.querySelector('router-outlet');
export const routerInstance = new Router();

routerInstance.get('/home', HomePage);
routerInstance.get('/admin', AdminPage, {getAuthStatus, requireIf: null});
routerInstance.get(`/quiz/:quizID/:mode`, QuizPage, {getAuthStatus, requireIf: {param: 'mode', value: 'edit'}});

routerInstance.init(routerOutlet);

const appBar = document.querySelector('app-bar');
initAuth(appBar);

authObservable.subscribe({next: x => {
    console.log(x)
}})

/**
 * @param {Element} ctx 
 * @param {string} queryName 
 * @return {Element}
 */
export function $(ctx, queryName) {
    if(ctx.shadowRoot) {
        return ctx.shadowRoot.querySelector(queryName);
    }
    return ctx.querySelector(queryName);
}
export async function $r(elName, template) {
    const el = document.createElement(elName);
    if(template) {
        let res = await fetch(template);
        el.innerHTML = await res.text();
    }
    return el;
}


class SafeObserver {
    constructor(destination) {
      this.destination = destination;
    }
    
    next(value) {
      // only try to next if you're subscribed have a handler
      if (!this.isUnsubscribed && this.destination.next) {
        try {
          this.destination.next(value);
        } catch (err) {
          // if the provided handler errors, teardown resources, then throw
          this.unsubscribe();
          throw err;
        }
      }
    }
    
    error(err) {
      // only try to emit error if you're subscribed and have a handler
      if (!this.isUnsubscribed && this.destination.error) {
        try {
          this.destination.error(err);
        } catch (e2) {
          // if the provided handler errors, teardown resources, then throw
          this.unsubscribe();
          throw e2;
        }
        this.unsubscribe();
      }
    }
  
    complete() {
      // only try to emit completion if you're subscribed and have a handler
      if (!this.isUnsubscribed && this.destination.complete) {
        try {
          this.destination.complete();
        } catch (err) {
          // if the provided handler errors, teardown resources, then throw
          this.unsubscribe();
          throw err;
        }
        this.unsubscribe();
      }
    }
    
    unsubscribe() {
      this.isUnsubscribed = true;
      if (this.unsub) {
        this.unsub();
      }
    }
}

export class Observable {
    constructor(_subscribe) {
        this._subscribe = _subscribe;
    }
    subscribe(observer) {
        const safeObserver = new SafeObserver(observer);
        return this._subscribe(safeObserver);
    }
}