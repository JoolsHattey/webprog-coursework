async function getQuestions() {
    const response = await fetch("/getquestions");

    const yiss = await response.json();

    displayQuestions(yiss);
}

function displayQuestions(questions) {
    const body = document.querySelector("body");

    for(let q of questions.questions) {
        const newQ = document.createElement("div");

        const qContent = document.createTextNode(q.text);

        newQ.appendChild(qContent);

        body.appendChild(newQ);
    }
}


getQuestions();