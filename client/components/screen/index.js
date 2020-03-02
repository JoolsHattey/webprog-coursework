class ScreenComponent extends Component {
    constructor() {
        super();
        this.appBar = new AppBar();
        this.home = new HomePage();
        this.home.initElement();
        this.admin = new AdminPage();
        this.appBar.btn.onclick = evt => router.navigate('/home');
        this.appBar.adminbtn.onclick = evt => router.navigate('/admin');
        this.container.appendChild(this.appBar);
        this.homePage();
    }
    homePage() {
        if(this.container.contains(this.admin)) {
            this.container.removeChild(this.admin);
        }
        //
        this.container.appendChild(this.home);
        //window.location.replace('/home');
    }
    adminPage() {
        if(this.container.contains(this.home)) {
            this.container.removeChild(this.home);
        }
        
        //this.admin.initElement();
        this.container.appendChild(this.admin);
        //window.location.replace('/admin');
    }
    quizPage(quizid, editMode) {
        if(this.container.contains(this.home)) {
            this.container.removeChild(this.home);
        }
        if(this.container.contains(this.admin)) {
            this.container.removeChild(this.admin);
        }
        this.quiz = new QuizPage(quizid, editMode);
        this.quiz.initElement(quizid, editMode);
        this.container.appendChild(this.quiz);
        //window.location.replace('/admin');
    }
}

customElements.define('screen-elmnt', ScreenComponent);