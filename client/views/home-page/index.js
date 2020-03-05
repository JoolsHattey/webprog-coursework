class HomePage extends Component {
    constructor() {
        super();
        this.initElement();
    }

    initElement() {
        this.container.classList.add("page");
        const btn = document.createElement("button");
        btn.append("See Questionnaires");
        this.container.appendChild(btn);
        btn.onclick = evt => this.getQuestionnaires();
    }

    clearScreen() {
        this.container.innerHTML=""
        console.log(this.container.children[1])
    }

    

    async getQuestionnaires() {
        const response = await fetch("/api/questionnaires")
    
        response.json().then(data => {

            console.log(data);
            
            const quuizes = document.createElement("div");

            data.forEach(item => {
                const q = new Card();
                q.createTitle(item.name);
                q.setClicker(evt => router.navigate(`/quiz/${item.uid}`));

                quuizes.appendChild(q);
                this.container.appendChild(quuizes);
            });
        });
    }
}

customElements.define('home-screen', HomePage);