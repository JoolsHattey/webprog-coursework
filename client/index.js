async function getQuestions() {
    const response = await fetch("/getquestions");

    const yiss = await response.json();

    displayQuestions(yiss);
}

function displayQuestions(questions) {
    const body = document.querySelector("main");

    for(let q of questions.questions) {
        const newQ = document.createElement("div");

        const qTitle = document.createElement("h5");
        const qTitleContent = document.createTextNode(q.text);
        qTitle.appendChild(qTitleContent);

        newQ.appendChild(qTitle);

        

        body.appendChild(newQ);
    }
}


getQuestions();