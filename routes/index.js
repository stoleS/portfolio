var express = require('express');
var router = express.Router();
var async = require("async");

var mongo = require('mongodb');
var db = require('monk')('localhost/myblog');

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db;
	var projects = db.get('projects');
	var testimonials = db.get('testimonials');
	var portfolio = [];
	var data = {}
	var load = [
		// load testimonials
		function(callback) {
			testimonials.find({}, {}, function(err, testimonials) {
				data.testimonials = testimonials;
				callback();
			});
		},

		// load projects
		function(callback) {
			projects.find({}, {}, function(err, projects) {
				if(err) {
					res.send('There was a problem loading projects');
				} else {
					for(var i = 0; i < 5; i++){
						for(var project in projects) {
							if(projects[project].position == 'portfolio' + (i + 1)){
								portfolio[i] = projects[project].title;
								break;
							}
						} 
					}
					data.projects = portfolio;
					callback();
				}
			});
		}
	];

	data.title = 'Predrag Stošić';

	async.parallel(load, function(err) {
		if(err) return next(err);
		db.close();
		res.render('index', data);
	});

});

module.exports = router;
