const path = require("path");
const express = require("express");
const Sequelize = require("sequelize");
var models = require("./models");
var passport = require("passport");

const app = express();

app.use(require("morgan")("combined"));
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(
    require("express-session")({
        secret: "keyboard cat",
        resave: true,
        saveUninitialized: true
    })
);

app.use(passport.initialize());

var initPassport = require("./passport/init");
initPassport(passport);

app.use(require("body-parser")());
const handlebars = require("express-handlebars").create({
    defaultLayout: "main",
    partialsPath: "views/partials"
});

app.engine("handlebars", handlebars.engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, "/public")));

app.set("port", process.env.PORT || 3000);
let auth = passport.authenticate("facebook", { failureRedirect: "/login" });

const piratesController = (req, res, next) => {
    console.log(req.body);
    console.log(req.isAuthenticated());
    if (req.body.family_name)
        models.Pirates.create({
            family_name: req.body.family_name,
            nick_name: req.body.nick_name,
            birth_country: req.body.birth_country,
            worth: req.body.worth,
            date_of_death: req.body.death
        })
            .then(newPirate => {
                console.log(
                    `New Pirate ${newPirate.nick_name}, with id ${
                    newPirate.PirateId
                    } has been created.`
                );
            })
            .catch(err => console.log(err))
    models.Pirates.findAll({}).then(function (data) {
        res.render("pirates", {
            pirates: data
        });
    });
};

app.get("/", piratesController);

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/users", (req, res) => {
    models.User.findAll().then(function (data) {
        res.render("users", {
            users: data
        });
    });
});

app.get("/profile", (req, res) => {
    console.log(req.isAuthenticated());
    res.send({ title: "HELLO" });
});

app.get("/pirate", (req, res) => {
    res.render("pirate-form");
});

app.post("/pirate", piratesController);

app.get("/pirates", piratesController);

app.get("/login/facebook", passport.authenticate("facebook"));

app.get(
    "/login/facebook",
    passport.authenticate("facebook", { session: true, failureRedirect: "/" })
);

app.get(
    "/login/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/pirates" }),
    function (req, res) {
        res.redirect("/users");
    }
);

app.use((req, res) => {
    res.render("404");
});

models.sequelize.sync().then(function () {
    app.listen(app.get("port"), () => {
        console.log(
            "Express started on http://localhost:" +
            app.get("port") +
            "; press Ctrl-C to terminate."
        );
    });
});