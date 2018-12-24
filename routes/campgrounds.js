var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware");

//INDEX show index
router.get("/", function(req, res) {
    //get from DB
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log("wrong");
        }
        else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user}); 
        }
        
    })
});


//CREATE add something to index page
router.post("/", middleware.isLoggedIn,function(req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newcampground = {name: name, price: price, image: image, description: description, author: author};
    //campgrounds.push(newcampground);
    //create a new campground and save it to new database
    Campground.create(newcampground, function(err, newcamp) {
        if(err) {
            console.log("create fail");
        }else {
            console.log(newcamp);
            res.redirect("/campgrounds");
        }
    });
})


//NEW
router.get("/new", middleware.isLoggedIn,  function(req, res) {
    res.render("campgrounds/new");
})



//SHOW more info about the campground
router.get("/:id", function(req, res) {
    //find the campground with that id, populate the comments array
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        }else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    })
});

//Edit campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership,function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    })
})

//update campground route
router.put("/:id", middleware.checkCampgroundOwnership,function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

// //middleware
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership,function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
      }
   });
});



module.exports = router;