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
	projects.find({}, {}, function(err, projects) {
		if(err) {
			res.send('There was a problem loading projects');
		} else {
			res.render('admin/projects', {
				'title': 'Projects',
				'projects': projects
			})
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
		'title': projectImage
	}, function(err, project) {
		if(err) {
			res.send('There was an issue submitting image');
		} else {
			req.flash('success', 'Image Submitted');
			res.redirect('back');
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
		res.redirect('/admin/projects');
	});
});

module.exports = router;