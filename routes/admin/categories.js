var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/myblog');

router.get('/', function(req, res, next) {
	var db = req.db;
	var categories = db.get('categories');
	categories.find({}, {}, function(err, categories) {
		if(err){
			res.send('There was a problem loading categories');
		} else {
			res.render('admin/addcategories', {
				'categories': categories
			});
		}
	});
});
	

router.post('/', function(req, res, next) {
	// get form values
	var categoryName = req.body.categoryName;
	console.log(categoryName);

	var categories = db.get('categories');

	// submit to db
	categories.insert({
		'title': categoryName
	}, function(err, category){
		if(err) {
			res.send('There was an issue submitting the category');
		} else {
			req.flash('success', 'Category Submitted');
			res.redirect('back');
		}
	}); 
});

module.exports = router;