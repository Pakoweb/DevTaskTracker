const http = require("http");

function check(path) {
    const options = {
        hostname: "localhost",
        port: 3001,
        path: path,
        method: "GET",
    };

    const req = http.request(options, (res) => {
        console.log(`GET ${path} -> StatusCode: ${res.statusCode}`);
    });

    req.on("error", (e) => console.log(`GET ${path} -> Error: ${e.message}`));
    req.end();
}

check("/");
check("/api/tasks");
check("/api/backlog");
