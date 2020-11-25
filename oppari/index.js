const express = require("express");
const bodyParser = require("body-parser");
const user = require("./routes/user");
const mark = require("./routes/mark");
const InitiateMongoServer = require("./config/db");

// Initiate Mongo Server
InitiateMongoServer();

const app = express();

const cors = require('cors')
app.use(cors());
// PORT
const PORT = process.env.PORT || 4000;

// Middleware

app.use(bodyParser.json());


app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});

/**
 * Router Middleware
 * Router - /user/ amd /mark/*
 * Method - *
 */
app.use("/user", user);
app.use("/mark", mark);



app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});
