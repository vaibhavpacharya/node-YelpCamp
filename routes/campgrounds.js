var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var geocoder = require('geocoder');

// Index
router.get("/",function(req,res){
// Get all campgrounds ffrom the DB
Campground.find({},function(err,allCampgrounds){
  if(err){
    console.log("SOMETHING GOT WRONG!");
    console.log(err);
  }
  else {
    // THen render them to the page
        res.render("campgrounds/index",{campgrounds:allCampgrounds, page: 'campgrounds'});
      }
    });
});

// CREATE Add new campgrounds
router.post("/", middleware.isLoggedIn, function(req,res){
    // get data from form
  var name        =  req.body.name;
  var price       =  req.body.price;
  var image       =  req.body.image;
  var description =  req.body.description;
  var author      = {
    id:       req.user._id,
    username: req.user.username
  };
  geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;

  var newCampground = {name:name, price: price, image:image, description:description, author:author, location:location, lat:lat, lng:lng};

  // Create a new campground and save to the DB
  Campground.create(newCampground,function(err,newlyCreated){
    if(err){
      console.log(err);
    }
    else{
        //redirect to campgrounds page
        // console.log(newlyCreated);
        res.redirect("/campgrounds");
        }
    });
  });
});

// NEW-Show form to create new campgrounds
router.get("/new", middleware.isLoggedIn, function(req,res){
  res.render("campgrounds/form");
});

//SHOW- Show info about one campground
router.get("/:id",function(req,res){
  //find the campground with provided ID
  // FindById(id,callback)
  Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
    if(err){
      console.log(err);
    }else{
      //render the show page
      res.render("campgrounds/show",{campground: foundCampground});
        }
  });
});

//EDIT campground routes
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err, foundCampground){
          res.render("campgrounds/edit",{campground: foundCampground});
    });
});

//UPDATE campground route
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
  geocoder.geocode(req.body.location, function (err, data) {
    var lat       = data.results[0].geometry.location.lat;
    var lng       = data.results[0].geometry.location.lng;
    var location  = data.results[0].formatted_address;
    var newData   = {name: req.body.name, image: req.body.image, description: req.body.description, price: req.body.price, location: location, lat: lat, lng: lng};
  //find the correct campground
  Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updatedCampground){
    if(err){
      req.flash("error", err.message);
      res.redirect("/campgrounds");
    } else {
      req.flash("success", "Successfully updated!");
      res.redirect("/campgrounds/" +updatedCampground._id);
          }
    });
  });
});

//DESTROY campground route
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err){
      res.redirect("/campgrounds");
    } else{
    res.redirect("/campgrounds");
  }
  });
});

module.exports = router;
