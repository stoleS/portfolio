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
				'title': 'Categories',
				'categories': categories
			});
		}
	});
});
	
// add category to database
router.post('/', function(req, res, next) {
	// get form values
	var categoryName = req.body.categoryName;
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

// remove category from database
router.get('/:id/delete', function(req, res, next) {
	var categories = db.get('categories');
	var id = req.params.id;
	categories.remove({_id: id}, function(err) {
		res.redirect('/admin/categories');
	})
})

module.exports = router;