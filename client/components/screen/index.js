import { Component } from '/components/component.js';
import { AppBar } from '../app-bar/index.js';
import { HomePage } from '../../views/home-page/index.js';
import { AdminPage } from '../../views/admin-page/index.js';
import { QuizPage } from '../../views/quiz-page/index.js';
import { routerInstance } from '../../index.js';

export class RouterOutlet extends Component {
    constructor() {
        super();
        this.appBar = document.querySelector('app-bar');
        this.home = new HomePage();
        this.admin = new AdminPage();
        this.appBar.btn.onclick = evt => routerInstance.navigate('/home');
        this.appBar.adminbtn.onclick = evt => routerInstance.navigate('/admin');
        // this.container.appendChild(this.appBar);
        this.homePage();
    }
    routeComponent(component, req) {
        console.log(component)
        this.container.innerHTML = '';
        this.container.appendChild(new component(req));
    }
}

customElements.define('router-outlet', RouterOutlet);