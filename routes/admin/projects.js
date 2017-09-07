var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: './public/images/portfolio/uploads' })
var mongo = require('mongodb');
var db = require('monk')('localhost/myblog');
var fs = require('fs');

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
			res.render('admin/projects', {
				'title': 'Projects',
				'projects': portfolio
			});
		}
	});
});

router.post('/', upload.single('projectImage'), function(req, res, next) {
	if(req.file) {
		console.log('Uploading File...');
		var projectImage = req.file.filename;
	} else {
		console.log('No file uploaded...');
	}

	var projects = db.get('projects');

	// submit to db
	projects.insert({
		'title': projectImage,
		'position': 'unused'
	}, function(err, project) {
		if(err) {
			res.send('There was an issue submitting image');
		} else {
			req.flash('success', 'Image Submitted');
			res.redirect(req.get('referer'));
		}
	});
});

// remove image from database and delete it from disk
router.get('/:id/delete', function(req, res, next) {
	var projects = db.get('projects');
	var id = req.params.id;
	projects.findOneAndDelete({_id: id}, function(err, project) {
		var image = project.title;
		fs.unlink('./public/images/portfolio/uploads/' + image, function(err) {
			if(err) throw err;
		});
		if(err) throw err;
		res.redirect(req.get('referer'));
	});
});

// change image
router.get('/:title', function(req, res, next) {
	var db = req.db;
	var projects = db.get('projects');
	var title = req.params.title;
	projects.find({}, {}, function(err, projects) {
		if(err) {
			res.send('There was a problem loading project');
		} else {
			res.render('admin/projects_list', {
				'title': 'Projects List',
				'id': req.params.id,
				'projects': projects,
				'title': title
			})
		}
	});
});

router.get('/:title/:id', function(req, res, next) {
	var db = req.db;
	var projects = db.get('projects');
	var title = req.params.title;
	var id = req.params.id;
	projects.findOneAndUpdate({position: title}, {
		$set: {
			position: 'unused' }
		},
		function(err, position){
			if(err) {throw err;}
			else{
				console.log('Updated1');
				projects.findOneAndUpdate({_id: id}, {
					$set: {
					position: title }
					},
					function(err, project) {
						if(err) {throw err;}
						else{
							console.log('Updated2');
						}
				});
			}
	});
	res.redirect('../');
	});

module.exports = router;