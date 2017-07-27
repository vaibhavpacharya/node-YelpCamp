var express     = require("express");
var router      = express.Router({mergeParams: true});
var Campground  = require("../models/campground");
var Comments    = require("../models/comment");
var middleware = require("../middleware");


//Comments New
router.get("/new", middleware.isLoggedIn, function(req,res){
  //find campgrounds
  Campground.findById(req.params.id,function(err,campground){
    if(err){
      console.log(err);
    }else{
      //render the comments page
      res.render("comments/form",{campground: campground});
        }
      });
});

//Comments Create
router.post("/", middleware.isLoggedIn, function(req,res){
  //lookup campground using id
  Campground.findById(req.params.id,function(err,campground){
    if(err){
      req.flash("error","Something went wrong.");
      console.log(err);
      res.redirect("/campgrounds");
    }else{
      Comments.create(req.body.comment,function(err,comment){
        if(err){
          console.log(err);
        } else{
          //add username and ID to the comment
          // comment.author.id = req.user._id;
          // comment.author.username = req.user.username;
          comment.author.id       = req.user._id;
          comment.author.username = req.user.username;
          console.log("New comment user will be === " +comment.author.username);
          //save comment
          comment.save();
          campground.comments.push(comment);
          // console.log(comment);
          campground.save();
          console.log(comment);
          req.flash("success","Successfully added the comment.");
          res.redirect('/campgrounds/' + campground._id);
        }

      });
    }
  });
});
//Comment Edit Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership,function(req,res){
  Comments.findById(req.params.comment_id, function(err,foundComment){
    if(err){
      res.redirect("back");
    } else {
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    }
  });
});

//Comment Update Route
router.put("/:comment_id", middleware.checkCommentOwnership,function(req,res){
    Comments.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedComment){
      if(err){
        res.redirect("back");
      } else {
        req.flash("success","Comment Updated Successfully.");
        res.redirect("/campgrounds/" + req.params.id);
      }
    });
});

//Comment Destroy Route
router.delete("/:comment_id", middleware.checkCommentOwnership,function(req,res){
  Comments.findByIdAndRemove(req.params.comment_id, function(err){
    if(err){
      res.redirect("back");
    } else {
      req.flash("success","Comment deleted.");
      res.redirect("/campgrounds/" +req.params.id);
    }
  })
});

module.exports = router;
