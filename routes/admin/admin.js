var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/myblog');

router.get('/', function(req, res, next) {
	res.render('admin/admin', {
		'title': 'Admin'
	});
});

module.exports = router;