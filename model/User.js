const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    section: { type: String, required: true },
    score: { type: Number, default: 0 }, // Default score is 0
});

// This schema will be used to create and update documents
const User = mongoose.model('user', userSchema);

module.exports = User;
