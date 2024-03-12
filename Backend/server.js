const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const adminRoutes = require("./routes/admin");
const formRoutes = require("./routes/form");
const employeeRoutes = require("./routes/employee");
var fs = require("fs");
const cors = require("cors");
var path = require("path");
require("dotenv").config({
  path: "./.env",
});
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
}); //cors error

app.use("/admin", adminRoutes);
app.use("/employee", employeeRoutes);
app.use("/form", formRoutes);
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
