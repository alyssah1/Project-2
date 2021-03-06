const express = require('express');
const path = require('path');
const db = require(path.join(__dirname, './models'));
const exphbs = require("express-handlebars");
const passport = require("./config/passport");
const session = require("express-session");
require("dotenv").config();

const PORT = process.env.PORT || 8080;
const app = express();

//parse parameters
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

//config express handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(session({ secret: "someactuallegitsecretstuff", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(require('./routes/authentication'));
app.use(require('./routes/apiRoutes'));
app.use(require('./routes/pageRoute'));

//sync models before active server
db.sequelize.sync().then(() => {
    //bind server.
    app.listen(PORT, () => {
        console.log("Server is now listening on port: " + PORT);
    });
});
