"use strict";

import { Router } from './router.js';
import { RouterOutlet } from './components/router-outlet/index.js';
import { getAuthStatus, login, initAuth, authObservable } from './auth.js';
import { HomePage } from './views/home-page/index.js';
import { AdminPage } from './views/admin-page/index.js';
import { QuizPage } from './views/quiz-page/index.js';
import { AppBar } from './components/app-bar/index.js';



/********************************************
 * Client Routes
 * **************************************** */

const routerOutlet = document.querySelector('router-outlet');
export const routerInstance = new Router();

routerInstance.get('/home', HomePage);
routerInstance.get('/admin', AdminPage);
routerInstance.get(`/quiz/:quizID/:mode`, QuizPage, getAuthStatus);

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
    return ctx.shadowRoot.querySelector(queryName);
}