require("dotenv").config();

const express = require('express');
const pug = require("pug")
const app = express();
const PORT = process.env.PORT || 4000;
const URL = process.env.URL || "127.0.0.1";
const routeController = require('./controller/routes');

app.set("view engine", "pug");
app.use(express.json());
app.use(express.urlencoded({extended: true }));
app.use('/api', routeController);

app.listen(PORT, URL, () => console.log(`Server is running on ${URL}:${PORT}`));