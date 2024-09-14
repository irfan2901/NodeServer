const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    // Extract token from 'Authorization' header
    const authHeader = req.header('Authorization');
    console.log('Authorization header:', authHeader);

    if (!authHeader) {
        console.log('No Authorization header');
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Extract token after 'Bearer ' prefix
    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token);

    if (!token) {
        console.log('Token is missing');
        return res.status(401).json({ msg: 'Token is not valid' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // Attach user data to request object
        console.log('Authenticated user:', req.user);
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
