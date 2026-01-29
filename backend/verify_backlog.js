const http = require("http");

const options = {
    hostname: "localhost",
    port: 3001,
    path: "/api/backlog",
    method: "GET",
};

const req = http.request(options, (res) => {
    console.log(`StatusCode: ${res.statusCode}`);

    let data = "";
    res.on("data", (chunk) => {
        data += chunk;
    });

    res.on("end", () => {
        console.log("Response:", data.substring(0, 200) + "..."); // Truncate output
    });
});

req.on("error", (error) => {
    console.error("Error:", error.message);
});

req.end();
