async function test() {
    const request = fetch("http://localhost:8080/yeet");

    const response = await request;

    console.log(response.text())
}

test();