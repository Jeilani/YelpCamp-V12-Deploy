var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var middleware = require("../middleware");


//INDEX - show all campgrounds
router.get("/", function (req, res) {
	//Get all campgrounds from DB
	Campground.find({}, function (err, allCampgrounds){
		if (err){
			console.log(err);
		}
		else {
			res.render("index", {campgrounds: allCampgrounds, currentUser: req.user});
		}
		
	});
	
});


//create route
router.post("/", middleware.isLoggedIn, function (req, res) {
	//get data from form and add to campgrounds array
	var name = req.body.name;
	var image= req.body.image;
	var description = req.body.description;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	
	var newCampground = {name: name, image: image, description: description, price: price, author: author};
	
	console.log(req.user);
		//create a new campground and sve to DB
	Campground.create(newCampground, function (err, newlyCreated){
		if (err){
			console.log(err);
		}
		else {
			console.log(newlyCreated);
			res.redirect("/campgrounds");
		}
		
	});

	
});

//New- show form to create new campground
router.get("/new", middleware.isLoggedIn, function (req, res) {
	res.render("campgrounds/new.ejs");
});


//SHOW - shows more info about one campground
router.get("/:id", function (req, res){
	Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
		if (err) {
			console.log(err);
		}
		else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// EDIT AND UPDATE ROUTES

router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
	Campground.findById(req.params.id, function (err, foundCampground){
		res.render("../views/campgrounds/edit", {campground: foundCampground});
	});
	
	
	
});

router.put("/:id", middleware.checkCampgroundOwnership, function (req, res){
	var updatedCampground = req.body.campground;
	Campground.findByIdAndUpdate(req.params.id, updatedCampground, function (err, campground){
		if (err){
			console.log(err);
			res.redirect("/campgrounds");;
		}
		else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	
});


router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res){
	Campground.findByIdAndRemove(req.params.id, function (err){
		if (err){
			res.redirect("/campgrounds");
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
});




module.exports = router;
