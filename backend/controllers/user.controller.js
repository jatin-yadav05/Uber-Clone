const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { fullName, email, password } = req.body;
        const { firstName, lastName } = fullName;
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(firstName, lastName, email, password);
        const user = await userService.createUser({ firstName, lastName, email, password: hashedPassword });
        const token = user.generateAuthToken();
        res.status(201).json({user, token});
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            throw new Error('Invalid email or password');
        }
        const isMatch = await user.comparePassword(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }
        const token = user.generateAuthToken();
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { registerUser, loginUser };