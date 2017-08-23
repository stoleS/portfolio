var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/myblog');

router.get('/post/:id', function(req, res, next) {
	var posts = db.get('posts');
	var id = req.params.id;
	posts.findOne({_id: id}, function(err, post) {
		res.render('show', {
			'post': post
		});
	});
});

/* GET blog page. */
router.get('/', function(req, res, next) {
	var db = req.db;
	var posts = db.get('posts');
	posts.find({}, {}, function(err, posts) {
		res.render('blog', {
			"posts": posts
		});
	});
});

module.exports = router;