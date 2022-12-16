import nodemailer from 'nodemailer';

export function sendMail(
	senderMail: string,
	receiverMail: string,
	subject: string,
	mailHtml: string
) {
	const transporter = nodemailer.createTransport({
		host: 'pfadihue.mail.protection.outlook.com',
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

	transporter.sendMail(mailOptions, function (error: any, info: any) {
		if (error) {
			console.log(error);
		}
	});
}
