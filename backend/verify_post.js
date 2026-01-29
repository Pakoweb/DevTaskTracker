const http = require("http");

const data = JSON.stringify({
    titulo: "Test Task from Script",
    descripcion: "This is a test task to verify POST endpoint",
    tecnologia: "TestTech",
    estado: "pending"
});

const options = {
    hostname: "localhost",
    port: 3001,
    path: "/api/tasks",
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`StatusCode: ${res.statusCode}`);

    res.on("data", (d) => {
        process.stdout.write(d);
    });
});

req.on("error", (error) => {
    console.error("Error:", error.message);
});

req.write(data);
req.end();
