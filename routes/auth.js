const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!email || !password || !username) {
        return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    try {
        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = await User.create({ username, email, password });

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                console.error('JWT Error:', err);
                return res.status(500).json({ msg: 'Server error' });
            }
            res.json({ token });
        });
    } catch (err) {
        console.error('Server Error:', err.message);
        res.status(500).send('Server error');
    }
});

//Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please provide both email and password' });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        console.log('Input Password:', password);
        console.log('Stored Password Hash:', user.password);
        console.log('Password Match Result:', isMatch);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                console.error('JWT Error:', err);
                return res.status(500).json({ msg: 'Server error' });
            }
            res.json({ token });
        });
    } catch (err) {
        console.error('Server Error:', err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;
