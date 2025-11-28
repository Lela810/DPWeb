import rateLimit from 'express-rate-limit';
var Logger;
(function (Logger) {
    Logger.error = (message) => {
        console.error(message);
    };
})(Logger || (Logger = {}));
export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
});
export const errorHandler = (err, _req, res, _next) => {
    // Log full stack when available to aid debugging
    Logger.error(err.stack || err.message);
    const status = err.status || 500;
    res.status(status);
    res.render('error', {
        user: _req.user,
        page: status,
        errorcode: status,
        message: err.message,
        stack: (process.env.DEV === 'true') ? err.stack : undefined,
    });
};