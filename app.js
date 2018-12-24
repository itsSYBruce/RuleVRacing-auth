var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campgrounds");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var methodOverride = require("method-override");
var flash = require("connect-flash");
var cookieParser = require("cookie-parser");
var session = require("express-session");


// configure dotenv
// require('dotenv').load();

//requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");
    
// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

var url = "mongodb://localhost/PC" || process.env.DATABASEURL;
mongoose.connect(url);
// mongoose.connect("mongodb://itssybruce:sy961130@ds243054.mlab.com:43054/rulevracing", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.locals.moment = require('moment');
app.use(flash());
//seedDB();


//PASSPORT Configuration
app.use(require("express-session")({
    secret: "hey oh tuna",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});




// Campground.create({
//                 name: "Mark Zhao", 
                
//                 image: "https://static1.squarespace.com/static/575b7b93c6fc08a912726ad7/575dbd98d210b82f783dfbbf/599270eed2b8572bae2aad4a/1540846235861/untitled-30.jpg?format=500w",
            
//                 description: "this is our clothing coordinator"
//                 }, function(err, campground) {
//                 if (err) {
//                     console.log("bad creation");
//                 }
//                 else {
//                     console.log(campground);
//                 }    
//             });


app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
        


//listen
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("booted");
});