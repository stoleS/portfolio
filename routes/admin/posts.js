var express = require('express');
var router = express.Router();
var async = require("async");
var multer = require('multer');
var upload = multer({ dest: './public/images/uploads' })
var mongo = require('mongodb');
var db = require('monk')('localhost/myblog');

router.get('/', function(req, res, next) {
	var db = req.db;
	var posts = db.get('posts');
	var categories = db.get('categories');
	var locals = {};
	var tasks = [
		// load posts
		function(callback) {
			posts.find({}, {}, function(err, posts) {
				locals.posts = posts;
				callback();
			});
		},

		// load categories
		function(callback) {
			categories.find({}, {}, function(err, categories) {
				locals.categories = categories;
				callback();
			})
		}
	];

	async.parallel(tasks, function(err) {
		if(err) return next(err);
		db.close();
		res.render('admin/addpost', locals);
	})
	
});

router.post('/', upload.single('mainImage'), function(req, res, next) {
	// get form values
	var title     = req.body.title;
	var category  = req.body.category;
	var shortBody = req.body.shortBody;
	var body      = req.body.body;
	var author    = req.body.author;
	var date      = new Date();
	
	if(req.file) {
		console.log('Uploading File...');
		var mainImage = req.file.filename;
	} else {
		console.log('No file uploaded...');
		var mainImage = 'noimage.jpg'
	}

	var posts = db.get('posts');

	// submit to db
	posts.insert({
		'title': title,
		'category': category,
		'shortBody': shortBody,
		'body': body,
		'author': author,
		'mainImage': mainImage
	}, function(err, post){
		if(err) {
			res.send('There was an issue submitting the post');
		} else {
			req.flash('success', 'Post Submitted');
			res.redirect('back');
		}
	});
});


module.exports = router;