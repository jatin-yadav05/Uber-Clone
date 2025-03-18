const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const blackListTokenModel = require('../models/blackListToken.model');

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
        const hashedPassword = await userModel.hashPassword(password);
        console.log(firstName, lastName, email, password);
        const user = await userService.createUser({ firstName, lastName, email, password: hashedPassword });
        const token = user.generateAuthToken();
        res.cookie('token', token);
        res.status(201).json({user, token});
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isMatch = await user.comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const token = user.generateAuthToken();
        res.cookie('token', token);
        res.status(200).json({user, token});
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token');
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];
        await blackListTokenModel.create({ token});
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { registerUser, loginUser, getUserProfile, logoutUser };