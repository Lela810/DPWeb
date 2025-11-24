import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../types/error';

namespace Logger {
	export const error = (message: string) => {
		console.error(message);
	};
}

export const limiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 200,
	standardHeaders: true,
	legacyHeaders: false,
});

export const errorHandler = (
	err: Error,
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	// Log full stack when available to aid debugging
	Logger.error(err.stack || err.message);
	const status = (err as HttpError).status || 500;
	res.status(status);
	res.render('error', {
		user: _req.user,
		page: status,
		errorcode: status,
		message: err.message,
		stack: (process.env.DEV === 'true') ? (err as any).stack : undefined,
	});
};
