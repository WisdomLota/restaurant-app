const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        console.log('Authorization Header:', authHeader); // Log the header for debugging

        const token = authHeader?.replace('Bearer ', '');
        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded); // Log the decoded token
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Invalid token:', error.message);
        res.status(401).json({ message: 'Authentication required' });
    }
};


module.exports = auth;
