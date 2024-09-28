const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config(); 

// Middleware function to authenticate requests
const authMiddleware = (req, res, next) => {
    // Extract token from the Authorization header
    const token = req.headers['authorization'];

    // Check if token is provided
    if (!token) return res.status(403).json({ error: 'No token provided' });

    // Verify the token using the secret
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        // If verification fails, return unauthorized error
        if (err) return res.status(401).json({ error: 'Unauthorized' });
        
        // If successful, attach user ID to the request object
        req.userId = decoded.id;
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = authMiddleware; // Export the middleware function
