var express = require("express");

var router = express.Router();

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");

// Import the model (Article.js) to use its database functions.
var Article = require("../models/Article.js");

// Create all our routes and set up logic within those routes where required.
router.get("/getsAllThings", function (req, res) {
  Article.all(function (data) {
    var hbsObject = {
      Articles: data
    };
    console.log(hbsObject);
    res.render("index", hbsObject);
  });
});

router.post("/api/Articles", function (req, res) {
  Article.create([
    "name", "sleepy"
  ], [
    req.body.name, req.body.sleepy
  ], function (result) {
    // Send back the ID of the new quote
    res.json({
      id: result.insertId
    });
  });
});

router.put("/api/Articles/:id", function (req, res) {
  var condition = "id = " + req.params.id;

  console.log("condition", condition);

  Article.update({
    sleepy: req.body.sleepy
  }, condition, function (result) {
    if (result.changedRows == 0) {
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    } else {
      res.status(200).end();
    }
  });
});

router.delete("/api/Articles/:id", function (req, res) {
  var condition = "id = " + req.params.id;

  Article.delete(condition, function (result) {
    if (result.affectedRows == 0) {
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    } else {
      res.status(200).end();
    }
  });
});

// Routes
router.get("/", function (req, res) {
  // Scrapes before anything else
  // First, we grab the body of the html with axios
  axios.get("https://www.npr.org/sections/news/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article.item").each(function (i, element) {

      // Creates a title string for the database
      let title = $(this)
        .children("div.item-info")
        .children("h2")
        .text();

      // Creates a link string for the database
      let link = $(this)
        .children("div.item-info")
        .children("h2")
        .children("a")
        .attr("href");

      // Creates a preview string for the database
      let preview = $(this)
        .children("div.item-info")
        .children("p")
        .text();

      // Creates a image source link string for the database
      let image = $(this)
        .children("div.item-image")
        .children("div.imagewrap")
        .children("a")
        .children("img")
        .attr("src");

      // Then stores everything into an object that's pushed to the database 
      let result = {
        title: title,
        link: link,
        preview: preview,
        image: image
      };

      // Check if db has entry
      let alreadyHasArt = db.Article.find({});

      // simplish check for prexisting in db, but requires database to be created
      if (!alreadyHasArt) {
        db.Article.create(result)
        .then(function(data){
          console.log("NEW DB ENTRY- "+data);
        })
        .catch(function (err) {
          // If an error occurred, log it
          console.log(err);
        });
      } else {
        console.log("ALREADY HAS IN DB");
      }
    });
  });

  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      
      let hbsObject = {
        article: dbArticle
      }
      res.render("index", hbsObject);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.render(err);
    });

});

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({
      _id: req.params.id
    })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
router.post("/articles/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  // console.log(req.body);
  db.Note.create(req.body)
    .then(function (dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({
        _id: req.params.id
      }, {
        comment: dbNote._id
      }, {
        new: true
      });
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


// Export routes for server.js to use.
module.exports = router;