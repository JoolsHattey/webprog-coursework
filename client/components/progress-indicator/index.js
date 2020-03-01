class ProgressIndicator extends Component {
    constructor(numQuestions) {
        super();
        this.container.style="width: 300px; height: 20px; background-color: red";
        this.progress = document.createElement("div");
        this.progress.style="height: 20px; background-color: green"
        this.container.appendChild(this.progress);
        this.incrementor = 300/numQuestions;
    }
    setProgress(num) {
        this.progress.style=`height: 20px; width:${this.incrementor*num}px; background-color: green`;
    }
}

customElements.define('progress-indicator', ProgressIndicator);