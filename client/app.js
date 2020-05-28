/* eslint-disable no-unused-vars */
'use strict';

import { Router } from './router.js';
import { RouterOutlet } from './components/router-outlet/router-outlet.component.js';
import { getAdminStatus } from './auth.js';
import { ProgressSpinner } from './components/progress-spinner/progress-spinner.component.js';
import { Icon } from './components/icon/icon.component.js';
import { $ } from './utils.js';


/********************************************
 * Client Routes
 * **************************************** */

const routerOutlet = $(document, 'router-outlet');
export const routerInstance = new Router();

routerInstance.get({ uri: '/', destination: null, defaultRoute: true, redirectTo: '/login' });
routerInstance.get({ uri: '/login', destination: () => import('./modules/login-page/login-page.component.js').then(m => m.LoginPage), lazy: true });
routerInstance.get({ uri: '/quiz/:quizID', destination: () => import('./modules/quiz-page/quiz-page.component.js').then(m => m.QuizPage), lazy: true });
routerInstance.get({ uri: '/quizeditor/:quizID', destination: () => import('./modules/quiz-editor/quiz-editor.component.js').then(m => m.QuizEditor), lazy: true, authGuard: getAdminStatus });
routerInstance.get({ uri: '/quizeditor', destination: () => import('./modules/quiz-editor/quiz-editor.component.js').then(m => m.QuizEditor), lazy: true, authGuard: getAdminStatus });

routerInstance.init(routerOutlet);
