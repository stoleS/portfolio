var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/myblog');

// render testimonial page with all testimonials in database
router.get('/', function(req, res, next) {
	var db = req.db;
	var testimonials = db.get('testimonials');
	testimonials.find({}, {}, function(err, testimonials) {
		if(err) { 
			res.send('There was a problem loading testimonials');
		} else {
			res.render('admin/testimonials', {
				'title': 'Testimonials',
				'testimonials': testimonials
			});
		}
	})
});

// add new testimonial to database
router.post('/', function(req, res, next) {
	// get form values
	var testimonialAuthor = req.body.testimonialAuthor;
	var testimonialText = req.body.testimonialText;
	var testimonialAuthorFirm = req.body.testimonialAuthorFirm;
	var testimonialAuthorJob = req.body.testimonialAuthorJob;
	var testimonials = db.get('testimonials');

	// submit to db
	testimonials.insert({
		'author': testimonialAuthor,
		'firm': testimonialAuthorFirm,
		'job': testimonialAuthorJob,
		'text': testimonialText
	}, function(err, testimonial) {
			if(err) {
				res.send('There was an issue submitting testimonial');
			} else {
				req.flash('success', 'Testimonial Submitted');
				res.redirect('back');
			}
	});
});

// remove testimonial from database
router.get('/:id/delete', function(req, res, next) {
	var testimonials = db.get('testimonials');
	var id = req.params.id;
	testimonials.remove({_id: id}, function(err) {
		req.flash('success', 'Testimonial Deleted')
		res.redirect('/admin/testimonials');
	})
});

module.exports = router;