const rateLimit = require('express-rate-limit')

const rateLimiter = (action) => rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 2,
    message: {
        success: false,
        message: `Exceeded Limit: You can only ${action} certificate twice per hour!`,
    },
    keyGenerator: (req) => `${req.admin._id.toString()}:${action}`,
    skipFailedRequests: true
})

module.exports = rateLimiter
