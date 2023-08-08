import rateLimit from 'express-rate-limit';
var Logger;
(function (Logger) {
    Logger.error = (message) => {
        console.error(message);
    };
})(Logger || (Logger = {}));
export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
export const errorHandler = (err, _req, res, _next) => {
    Logger.error(err.message);
    const status = err.status || 400;
    res.render('error', {
        user: _req.user,
        page: status,
        errorcode: status,
        message: err.message,
    });
};