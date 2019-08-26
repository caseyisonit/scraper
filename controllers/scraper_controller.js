var cheerio = require("cheerio");
var axios = require("axios");
var express = require("express");
var router = express.Router();

var db = require("../models");

// Routes
router.get("/", function (req, res) {
    res.render("index");
})

// A GET route for scraping the echoJS website
router.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.thisiscolossal.com/").then(function (response) {
        console.log("Scrape works")
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $("#posts").each(function (i, element) {
            console.log("Article grabbed")
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children("h2")
                .children("a")
                .text();
            result.link = $(this)
                .children("h2")
                .children("a")
                .attr("href");
            result.image = $(this)
                .children("p")
                .children("img")
                .attr("src");

            console.log(result);
            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                });
        });

        // Send a message to the client 
        res.redirect("/articles");
    });
});

// Route for getting all Articles from the db
router.get("/articles", function (req, res) {
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({})
        .then(function (dbArticle) {
            res.render("index", { data: dbArticle });
        })
        .catch(function (err) {
            res.json(err);
        })
});

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function (req, res) {
    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included
    db.Article.findById(req.params.id)
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
});

// Route for saving/updating an Article's associated Note
router.post("/articles/:id", function (req, res) {
    // TODO
    // ====
    // save the new note that gets posted to the Notes collection
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the new note

    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, {$push: { note: dbNote._id }}, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        })
});

module.exports = router;