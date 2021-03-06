var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");


//root route
router.get("/", function(req, res) {
    //res.send("hey oh");
    res.render("landing");
})






//Auth Routes


//show register form
router.get("/register", function(req, res) {
    res.render("register");
})
//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to YelpCamp " + user.username);
           res.redirect("/campgrounds"); 
        });
    });
});

//show login form
router.get("/login", function(req, res) {
    res.render("login");
})
//handle login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "login"
    }), function(req, res) {
})


//logic route logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
})

// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     req.flash("error", "You need to be logged in to do that");
//     res.redirect("/login");
// }

module.exports = router;
