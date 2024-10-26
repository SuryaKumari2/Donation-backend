const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const dotenv = require('dotenv');
dotenv.config(); 

// Sign up
exports.signUp = async (req, res) => {
    const { username, email, password} = req.body; // Destructure user data from the request body

    try {
        // Check if the user already exists
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' }); // Respond with error if user exists
        }
        

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await User.create({ username, email, password: hashedPassword }); // Create new user
        res.status(201).json({ message: 'User created successfully', user: newUser }); // Respond with success
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message }); // Handle server errors
        
    }
};

// Sign in
exports.signIn = async (req, res) => {
    const { email, password } = req.body; // Destructure email and password from the request body

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' }); // Respond if user not found

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' }); // Respond if credentials are invalid

        // Create a JWT token for the user
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user }); // Respond with token and user data
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle server errors
    }
};
