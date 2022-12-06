const nodemailer = require('nodemailer');

function sendMail(senderMail, receiverMail, subject, mailHtml) {
	const transporter = nodemailer.createTransport({
		host: 'pfadihue-ch.mail.protection.outlook.com',
		port: 25,
		auth: {
			user: senderMail,
		},
	});

	const mailOptions = {
		from: senderMail,
		to: receiverMail,
		subject: subject,
		html: mailHtml,
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		}
	});
}

module.exports = { sendMail };
