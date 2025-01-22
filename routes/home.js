const express = require('express');
const router = express.Router();
const User = require('../model/User'); // Import User model

// Render the home page with user data
router.get('/', async (req, res) => {
    const userSession = req.session.user;

    if (!userSession) {
        return res.redirect('/login'); // Redirect to login page if no session
    }

    try {
        const user = await User.findById(userSession.id); // Find the user by ID

        if (!user) {
            return res.status(404).send('User not found!');
        }

        res.render('home', {
            title: 'Home Page',
            user: user || null, // Pass the user data to home.ejs
        });
    } catch (error) {
        console.error('Error fetching user data:', error.message);
        res.status(500).send('Error loading home page');
    }
});

module.exports = router;
