var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next){
		if (req.isAuthenticated()){
		
				Campground.findById(req.params.id, function (err, foundcampground){
				if (err){
					req.flash("error", "Campground not found");
					res.redirect("back");
				} else {
					if (foundcampground.author.id.equals(req.user._id)) { 						next();
					} else {
						req.flash("error", "You don't have permission to do that");
						res.redirect("back");
					}

				}
			});
		   
	} else {
		   res.redirect("back");
	}
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
		if (req.isAuthenticated()){
				Comment.findById(req.params.comment._id, function (err, foundComment){
				if (err){
					req.flash("error", "Comment not found");
					res.redirect("back");
				} else {
					if (foundComent.author.id.equals(req.user._id)) { 						next();
					} else {
						req.flash("error", "You don't have permission to do that");
						res.redirect("back");
					}

				}
			});
		   
	} else {
			req.flash("error", "You need to be logged to edit");
		   res.redirect("back");
	}
};


middlewareObj.isLoggedIn = function (req, res, next) {
	if (req.isAuthenticated()){
		return next();
	}	
	req.flash("error", "Please Log In First");
	res.redirect("/login");
	
	
};



module.exports = middlewareObj;