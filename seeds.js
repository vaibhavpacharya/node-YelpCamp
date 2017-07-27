var mongoose = require("mongoose");
var Campground = require("./models/campground");
var comment = require("./models/comment");

var data = [
  {
    name: "Sils Maria",
    image: "http://www.photosforclass.com/download/8524305204",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
  {
    name: "Creek Point",
    image: "http://www.photosforclass.com/download/15989950903",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
  {
    name: "Midnight Howl",
    image: "http://www.photosforclass.com/download/7842069486",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  }
]

function seedDB(){
  //Remove all campgrounds
  Campground.remove({},function(err){
    if(err){
      console.log(err);
    } else
    console.log("removed campgrounds!!!");
    //add campgrounds
    data.forEach(function(seed){
      Campground.create(seed,function(err,campground){
        if(err){
          console.log(err);
        } else {
          console.log("Successfully added to the DB!");
              }
              //add comments
            comment.create({
              text:"This place must have internet!@",
              author: "Homey"
            },function(err,comment){
              if(err){
                console.log(err);
              } else {
                campground.comments.push(comment);
                campground.save();
                console.log("Created new comment Successfully");
                    }
          });
      });
    });
  });
};
module.exports = seedDB;
