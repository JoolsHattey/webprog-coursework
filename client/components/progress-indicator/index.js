class ProgressIndicator extends Component {
    constructor(numQuestions) {
        super();
        this.container.style="width: 300px; height: 20px; background-color: red";
        this.progressDiv = document.createElement("div");
        this.progressDiv.style="height: 20px; background-color: green";
        this.container.appendChild(this.progressDiv);
        this.incrementor = 300/numQuestions;
        this.setAttribute('steps', numQuestions);
        this.setAttribute('step', 0);
        this.setAttribute('progress', 0);
    }
    setProgress(num) {
        this.progressDiv.style=`height: 20px; width:${num}%; background-color: green`;
    }
    increment() {
        this.step++;
        console.log(this.step/this.steps)
        this.setProgress((this.step/this.steps)*100);
    }
    get step() {
        return this.getAttribute('step');
    }
    set step(newValue) {
        this.setAttribute('step', newValue)
    }
    get steps() {
        return this.getAttribute('steps');
    }
    set steps(newValue) {
        this.setAttribute('steps', newValue);
    }
    get progress() {
        return this.getAttribute('progress');
    }
    set progress(newValue) {
        this.setAttribute('progress', newValue);
        this.setProgress(newValue);
    }
}

customElements.define('progress-indicator', ProgressIndicator);