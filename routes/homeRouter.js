const validate = require('validate.js');
const express = require('express');
const homeRouter = express.Router();

homeRouter.get('/', function (req, res) {
	res.render('home', {
		user: req.user,
		page: 'Home',
		validate: validate,
	});
});

module.exports = homeRouter;
