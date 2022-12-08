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
		async (req, res) => {
			try {
				const newEntryId = await createDetailprogramm(req.body);
				res.render('editDetailprogramm', {
					user: req.user,
					page: 'Detailprogramme',
					detailprogramm: await loadDetailprogramm(newEntryId),
				});
			} catch (error) {
				console.log(error);
				res.render('error', {
					user: req.user,
					page: 500,
					errorcode: 500,
				});
			}
		}
	);
	app.post(
		'/detailprogramme/edit',
		ensureAuthenticated,
		limiter,
		async (req, res) => {
			try {
				editDetailprogramm(req.query.detailprogrammId, req.body);
				res.render('editDetailprogramm', {
					user: req.user,
					page: 'Detailprogramme',
					detailprogramm: await loadDetailprogramm(req.query.detailprogrammId),
				});
			} catch (error) {
				console.log(error);
				res.render('error', {
					user: req.user,
					page: 500,
					errorcode: 500,
				});
			}
		}
	);
};
