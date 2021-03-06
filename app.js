require('dotenv').config();
var express    = require("express"),
app            = express(),
bodyParser     = require("body-parser"),
mongoose       = require("mongoose"),
flash          = require("connect-flash"),
passport       = require("passport"),
LocalStrategy  = require("passport-local"),
methodOverride = require("method-override"),
Campground     = require("./models/campground"),
Comments       = require("./models/comment"),
User           = require("./models/user"),
seedDB         = require("./seeds");

//requring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");

var url = (process.env.DATABASEURL || "mongodb://localhost/yelp_camp");
mongoose.connect(url);
// mongoose.connect("mongodb://vaibhav:Passw0rd@ds115352.mlab.com:15352/vaibhav_yelpcamp");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//Passport config
app.use(require("express-session")({
  secret: "This is Man Utd!",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//custom middleware
//req.user will either be empty or it will contain the current user and id
app.use(function (req,res,next){
  res.locals.currentUser = req.user;
  res.locals.error       = req.flash("error");
  res.locals.success     = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT || 8080,function(){
  console.log("The YelpCamp Server has started!");
});
