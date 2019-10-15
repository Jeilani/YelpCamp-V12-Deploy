var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


var isLoggedIn = function (req, res, next){
	if (req.isAuthenticated()){
		return next();
	}	
	res.redirect("/login");
};


//comments new
router.get("/new", middleware.isLoggedIn, function (req, res){
	Campground.findById(req.params.id, function (err, foundCampground){
		if (err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: foundCampground})
		}
		
	});
});

//comments create


router.post("/", middleware.isLoggedIn, function (req, res){
	// look up campground using id
	Campground.findById(req.params.id, function (err, foundCampground){
		if (err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function (err, comment){
				if (err){
					console.log(err);
				} else {
					//add username and ID to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					foundCampground.comments.push(comment);
					foundCampground.save();
					req.flash("success", "Successfully added a comment");
					res.redirect("/campgrounds/" + foundCampground._id)
					console.log(comment);
				}
				
			});
		}
	});
});


//EDIT AND UPDATE ROUTES	

//EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res){
		Campground.findById(req.params.id, function (err, foundCampground){
		if (err){
			console.log(err);
			res.redirect("back");
		} else {
			Comment.findById(req.params.comment_id, function (err, comment){
				if (err){
					console.log(err);
					res.redirect("back");
				} else {
				res.render("../views/comments/edit", {campground: foundCampground, comment: comment});
				}
				
			});
		}
	});
});

//UPDTATE
router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
		if (err){
			console.log(err);
			res.redirect("back");
		}
		else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function (err) {
		if (err){
			console.log(err);
			res.redirect('back');
		} else {
			req.flash("success", "Comment Removed");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


//middleware



module.exports = router;