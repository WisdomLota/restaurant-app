const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ message: 'Authentication required. No token provided.' });
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the user to the request object
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
};

module.exports = auth;
