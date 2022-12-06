const {
	loadAllDPs,
	createDetailprogramm,
	loadDetailprogramm,
	editDetailprogramm,
} = require('../js/db.js');

module.exports = function (app, ensureAuthenticated, limiter) {
	app.get(
		'/detailprogramme',
		limiter,
		ensureAuthenticated,
		async function (req, res) {
			res.render('detailprogramme', {
				user: req.user,
				page: 'Detailprogramme',
				detailprogramme: await loadAllDPs(),
			});
		}
	);

	app.get(
		'/detailprogramme/edit',
		limiter,
		ensureAuthenticated,
		async function (req, res) {
			res.render('editDetailprogramm', {
				user: req.user,
				page: 'Detailprogramme',
				detailprogramm: await loadDetailprogramm(req.query.detailprogrammId),
			});
		}
	);
	app.post(
		'/detailprogramme/create',
		ensureAuthenticated,
		limiter,
		(req, res) => {
			try {
				createDetailprogramm(req.body);
				res.sendStatus(200);
			} catch (error) {
				console.log(error);
				res.sendStatus(500);
			}
		}
	);
	app.post(
		'/detailprogramme/edit',
		ensureAuthenticated,
		limiter,
		(req, res) => {
			try {
				editDetailprogramm(req.query.detailprogrammId, req.body);
				res.sendStatus(200);
			} catch (error) {
				console.log(error);
				res.sendStatus(500);
			}
		}
	);
};
