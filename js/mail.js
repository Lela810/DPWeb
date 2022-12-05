const nodemailer = require('nodemailer');

function sendMail(senderMail, receiverMail, subject, text) {
	const transporter = nodemailer.createTransport({
		host: 'pfadihue-ch.mail.protection.outlook.com',
		port: 25,
		auth: {
			user: senderMail,
		},
	});

	const notificationMailHtml = `
        <html>
            <body>
                
<p>Test</p>
                    
            </body>
        </html>`;

	const mailOptions = {
		from: senderMail,
		to: receiverMail,
		subject: subject,
		html: notificationMailHtml,
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		}
	});
}

module.exports = { sendMail };
