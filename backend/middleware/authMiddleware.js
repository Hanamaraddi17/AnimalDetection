const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Retrieve the token from the Authorization header
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Error 001: Access denied, no token provided' });
    }

    try {
        // Extract the token value, assuming format "Bearer <token>"
        const tokenValue = token.startsWith("Bearer ") ? token.split(" ")[1] : token;

        if (!tokenValue) {
            return res.status(400).json({ message: 'Error 002: Malformed token format, expected "Bearer <token>"' });
        }

        // Verify the token
        const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);

        // Attach decoded user info to the request object
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ message: 'Error 003: Invalid token' });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Error 004: Token expired, please login again' });
        }

        // Unexpected verification error
        res.status(500).json({ message: 'Error 005: Something went wrong during token verification' });
    }
};
