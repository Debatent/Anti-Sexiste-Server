/** A middleware for middleware, wrapper **/

// Handle async middleware
const wrapAsync = (fn) => {
    return (req, res, next) => {
        const fnReturn = fn(req, res, next);
        return Promise.resolve(fnReturn).catch(next);
    }
};

module.exports.wrapAsync = wrapAsync;
