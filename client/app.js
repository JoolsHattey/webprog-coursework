/* eslint-disable no-unused-vars */
'use strict';

import { Router } from './router.js';
import { RouterOutlet } from './components/router-outlet/router-outlet.component.js';
import { getAdminStatus } from './auth.js';
import { ProgressSpinner } from './components/progress-spinner/progress-spinner.component.js';
import { Icon } from './components/icon/icon.component.js';


/********************************************
 * Client Routes
 * **************************************** */

const routerOutlet = $(document, 'router-outlet');
export const routerInstance = new Router();

routerInstance.get({ uri: '/', destination: null, defaultRoute: true, redirectTo: '/login' });
routerInstance.get({ uri: '/login', destination: () => import('./views/login-page/login-page.component.js').then(m => m.LoginPage), lazy: true });
routerInstance.get({ uri: '/quiz/:quizID', destination: () => import('./views/quiz-page/index.js').then(m => m.QuizPage), lazy: true });
routerInstance.get({ uri: '/quizeditor/:quizID', destination: () => import('./views/quiz-editor/quiz-editor.component.js').then(m => m.QuizEditor), lazy: true, authGuard: getAdminStatus });
routerInstance.get({ uri: '/quizeditor', destination: () => import('./views/quiz-editor/quiz-editor.component.js').then(m => m.QuizEditor), lazy: true, authGuard: getAdminStatus });

routerInstance.init(routerOutlet);

/**
 * Queries the context for the node matching the specified selector.
 * @param {HTMLElement} ctx
 * @param {string} queryName
 * @returns {HTMLElement}
 */
export function $(ctx, queryName) {
  if (ctx.shadowRoot) {
    return ctx.shadowRoot.querySelector(queryName);
  }
  return ctx.querySelector(queryName);
}
/**
 * Creates an instance of the element for the specified tag.
 * @param {string} elName
 * @param {string} [template] Path to template file for contents of element.
 * @returns {HTMLElement}
 */
export async function $r(elName, template) {
  const el = document.createElement(elName);
  if (template) {
    const parser = new DOMParser();
    const res = await fetch(template);
    const textTemplate = await res.text();
    const htmlTemplate = parser.parseFromString(textTemplate, 'text/html').querySelector('template');
    el.append(htmlTemplate.content.cloneNode(true));
  }
  return el;
}
/**
 * Clear inner content of element
 * @param {HTMLElement} el
 */
export function $clear(el) {
  Array.from(el.children).forEach(childNode => childNode.remove());
}
