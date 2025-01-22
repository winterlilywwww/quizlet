const express = require('express');
const router = express.Router();
const User = require('../model/User');

// Render form to create a new user
router.get('/silog', (req, res) => {
    res.render('silog');
});

// CREATE a new user
router.post('/', async (req, res) => {
    try {
        const userData = req.body;
        
        // Save user to the database
        const user = new User(userData);
        await user.save();

        // Set the user in the session after saving
        req.session.user = user;

        console.log('Session Data:', req.session.user);

        res.redirect(`/users/${user._id}`); // Redirect to the user's view page
    } catch (err) {
        console.error('Error creating user:', err.message);
        res.status(400).send('Error creating user: ' + err.message);
    }
});


router.post('/submit', async (req, res) => {
    const { score } = req.body;

    // Retrieve user data from session
    const userSession = req.session.user;

    console.log(userSession);

    if (!userSession) {
        return res.status(404).send('No user session found!');
    }

    try {
        // Ensure userSession.id is an ObjectId when querying
        const user = await User.findById(userSession.id);

        if (!user) {
            return res.status(404).send('User not found in the database!');
        }

        // If the user exists, update their score
        user.score = score;
        await user.save();

        console.log('Updated user score:', user);
        res.redirect('/home'); // Redirect to home page after updating score
    } catch (error) {
        console.error('Error updating score:', error.message);
        res.status(500).send('An error occurred while saving your score.');
    }
});



// READ a single user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('view', { user });
    } catch (err) {
        res.status(500).send('Error fetching user: ' + err.message);
    }
});

// UPDATE a user by ID (this will include updating the score)
router.post('/:id/update', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.redirect(`/users/${user._id}`); // Redirect to the updated user view page
    } catch (err) {
        res.status(400).send('Error updating user: ' + err.message);
    }
});

// UPDATE the score of a user (separate route for updating only the score)
router.post('/:id/update-score', async (req, res) => {
    try {
        const { score } = req.body;  // Get the score from the request body

        // Validate that score is a number (or other validation rules)
        if (typeof score !== 'number') {
            return res.status(400).send('Invalid score');
        }

        // Find the user by ID and update their score
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        user.score = score;  // Update the score
        await user.save();  // Save the updated user

        res.redirect(`/users/${user._id}`);  // Redirect to the user's view page
    } catch (err) {
        res.status(500).send('Error updating score: ' + err.message);
    }
});

// DELETE a user by ID
router.delete('/:id/delete', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.redirect('/'); // Redirect to home after deleting
    } catch (err) {
        res.status(500).send('Error deleting user: ' + err.message);
    }
});

module.exports = router;
