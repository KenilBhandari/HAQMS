const rateLimit=require("express-rate-limit");
  
const limiter = rateLimit({
    windowMs:15*60*1000,
    max:5
});

module.exports=limiter;

// Usage in routes:
// const limiter = require('../utils/rateLimiter');
// router.post('/login', limiter, async (req, res) => { ... });
// router.post('/register', limiter, async (req, res) => { ... });

// Example of applying to all routes in app.js:
// const limiter = require('./utils/rateLimiter');
// app.use(limiter); // Apply to all routes
