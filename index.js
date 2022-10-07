const express = require("express");

const mongoose = require('mongoose');

const app = express();

//middleware
app.use(express.json());
app.use((req, res, next) => {
    console.log(req.path);
    console.log(req.ip);
    console.log(new Date());
    next();
})

//routes

app.use("/array", require("./routes/library.js"));
app.use("/mongoose", require("./routes/mongoose.js").router);

app.get("/error", (req, res, next) => {
    next(new Error("Custom Error"));
})

app.get("/hello", (req, res, next) => {
    res.status(200).send("Hello!");
})

/// Error Handling
app.use((err, req, res, next) => {
    console.log(err);
    next(err);
})

app.use((err, req, res, next) => {
    res.status(500).send(err.stack);
    next(err);
})

// Start

mongoose.connect("mongodb://127.0.0.1:27017").then(()=>{
    console.log("DB Connected");
}).catch(console.log);

const server = app.listen(4494, () => {
    console.log(server.address())
})

server.on("close", () =>{
    mongoose.connection.close();
})

module.exports = {server};