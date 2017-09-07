var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/myblog');

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db;
	var projects = db.get('projects');
	var portfolio = [];
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
			res.render('index', {
				'title': 'Predrag Stošić',
				'projects': portfolio
			});
		}
	});
});

module.exports = router;
