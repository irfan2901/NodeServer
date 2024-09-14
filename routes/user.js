const express = require('express');
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all users
router.get('/', auth, async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get current user
router.get('/me', auth, async (req, res) => {
    try {
        // Ensure req.user is set by the middleware
        if (!req.user || !req.user.id) {
            return res.status(401).json({ msg: 'User not authenticated' });
        }

        // Fetch user from the database
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.put('/update/:id', auth, async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Find user by primary key
        let user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Prepare updates
        const updates = {};
        if (username) updates.username = username;
        if (email) updates.email = email;
        if (password) {
            // Hash password
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(password, salt);
        }

        // Log the updates for debugging
        console.log('Updates:', updates);

        // Perform update
        await user.update(updates);
        
        // Fetch the updated user
        user = await User.findByPk(req.params.id);
        
        // Respond with updated user
        res.json(user);
    } catch (err) {
        console.error('Update Error:', err.message);
        res.status(500).send('Server error');
    }
});


// Delete user
router.delete('/delete/:id', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        await user.destroy();
        res.json({ msg: 'User removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
