const express = require('express');
const router = express.Router();
const User = require('../model/User'); // Import User model

/* GET quiz page. */
router.get('/', function (req, res, next) {
  res.render('quiz');  // This renders the quiz.ejs file
});

router.post('/submit', async (req, res) => {
    const { score } = req.body;

    // Retrieve user session data
    const userSession = req.session.user;

    if (!userSession || !userSession.id) {
        return res.status(404).send('No user session or user ID found!'); // Check for valid session data
    }

    try {
        // Check if the user exists in the database by using session user ID
        const user = await User.findById(userSession.id);  // Use `id` instead of `_id`
        if (!user) {
            return res.status(404).send('User not found in the database!');
        }

        // Update the user's score in the database
        user.score = score;
        await user.save();

        // Update session with the new score (optional)
        req.session.user = {
            ...userSession,
            score: user.score,  // Save the updated score to the session
        };

        console.log('Updated user score:', user);

        // Redirect to home page after updating score
        res.redirect('/home');
    } catch (error) {
        console.error('Error updating score:', error.message);
        res.status(500).send('An error occurred while saving your score.');
    }
});

module.exports = router;  // Use this line at the end
