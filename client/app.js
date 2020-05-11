"use strict";

import { Router } from './router.js';
import { RouterOutlet } from './components/router-outlet/router-outlet.component.js';
import { getAdminStatus } from './auth.js';
import { QuizPage } from './views/quiz-page/index.js';
import { AppBar } from './components/app-bar/app-bar.component.js';
import { ProgressSpinner } from './components/progress-spinner/progress-spinner.component.js';
import { Icon } from './components/icon/icon.component.js';
import { QuizEditor } from './views/quiz-editor/quiz-editor.component.js';
import { LoginPage } from './views/login-page/login-page.component.js';

/********************************************
 * Client Routes
 * **************************************** */

const routerOutlet = $(document, 'router-outlet');
export const routerInstance = new Router(); 

routerInstance.get({uri: '/', component: LoginPage,defaultRoute: true, redirectTo: '/login'});
routerInstance.get({uri: '/login', component: LoginPage});
routerInstance.get({uri: `/quiz/:quizID`, component: QuizPage});
routerInstance.get({uri: '/quizeditor/:quizID', component: QuizEditor, authGuard: getAdminStatus});
routerInstance.get({uri: '/quizeditor', component: QuizEditor, authGuard: getAdminStatus});

routerInstance.init(routerOutlet);


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
/**
 * 
 * @param {string} elName 
 * @param {string} template 
 * @return {Element}
 */
export async function $r(elName, template) {
    const el = document.createElement(elName);
    if(template) {
      const parser = new DOMParser();
      const res = await fetch(template);
      const textTemplate = await res.text();
      const htmlTemplate = parser.parseFromString(textTemplate, 'text/html').querySelector('template');
      console.log(htmlTemplate)
      el.append(htmlTemplate.content.cloneNode(true))
    }
    return el;
}
/**
 * Clear inner content of element
 * @param {Element} el 
 */
export async function $clear(el) {
  el.innerHTML = '';
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
    subscribe(next, error, complete) {
        const safeObserver = new SafeObserver({next, error, complete});
        return this._subscribe(safeObserver);
    }
}