import nodemailer from 'nodemailer';
export function sendMail(senderMail, receiverMail, subject, mailHtml) {
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
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
    });
}