async function test() {
    const response = await fetch("/getquestions");

    console.log(await response.json())
}

test();