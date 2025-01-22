const express = require('express');
const router = express.Router();
const User = require('../model/User'); // Import User model

// Render registration page
router.get('/', (req, res) => {
    res.render('index'); // Render the registration form
});

// Handle registration
router.post('/home', async (req, res) => {
    const { name, email, section } = req.body;

    try {
        // Save the user in the database
        const newUser = new User({ name, email, section });
        await newUser.save();

        console.log('User registered:', newUser);

        console.log('Session before setting user:', req.session);

        // Ensure the session is initialized before setting data
        req.session.user = {
            id: newUser._id,
            email: newUser.email,
            name: newUser.name,
            section: newUser.section,
            score: newUser.score || 0, // Default score to 0 if it's not defined
        };

        console.log('Session after setting user:', req.session.user);

        console.log('Session Data:', req.session.user);

        // Redirect to home page with the user's ID as a query parameter
        res.redirect(`/home?id=${newUser._id}`);
    } catch (error) {
        console.error('Error saving user:', error.message);

        // Handle errors (e.g., duplicate email)
        if (error.code === 11000) {
            res.status(400).send('Email already registered!');
        } else {
            res.status(500).send('An error occurred while registering. Please try again.');
        }
    }
});



module.exports = router;
