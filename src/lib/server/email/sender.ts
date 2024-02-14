import { SMTP_DEFAULT_FROM, SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } from '$env/static/private';
import nodemailer from 'nodemailer';
import type { Options } from 'nodemailer/lib/mailer';

const transporter = nodemailer.createTransport(
	{
		host: SMTP_HOST,
		port: parseInt(SMTP_PORT, 10),
		secure: false,
		auth: {
			user: SMTP_USER,
			pass: SMTP_PASS
		}
	},
	{
		from: SMTP_DEFAULT_FROM
	}
);

export const sendMail = async (mail: Options) => {
	await transporter.sendMail(mail);
};
