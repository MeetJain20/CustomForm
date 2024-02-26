const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const userRoutes = require("./routes/user");
// const adminRoutes = require("./routes/admin");
// const merchantRoutes = require("./routes/merchant");
// const itemRoutes = require("./routes/item");
// const goldRoutes = require("./routes/gold");
var fs = require("fs");
var path = require("path");
require("dotenv").config({
    path: "./.env",
});
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

    next();
}); //cors error

// app.use("/user", userRoutes);
// app.use("/merchant", merchantRoutes);
// app.use("/item", itemRoutes);
// app.use("/gold", goldRoutes);
// app.use("/admin", adminRoutes);

app.use((req, res, next) => {
    const error = new HttpError("Could not find this route.", 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occurred!" });
});

const dbUrl = process.env.MONGO_URL;

mongoose
    .connect(dbUrl)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(5000);
    })
    .catch((err) => {
        console.log(err);
    });


// app.get("/", (req, res) => {
//     res.send("Hello World! Its working");
// }
// );

