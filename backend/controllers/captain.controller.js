const captainService = require('../services/captain.service');
const captainModel = require('../models/captain.model');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blackListToken.model');

module.exports.registerCaptain = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password, vehicle, fullName } = req.body;
        const existingCaptain = await captainModel.findOne({ email });
        if (existingCaptain) {
            throw new Error('Email already exists');
        }
        const { firstName, lastName } = fullName;
        const { color, capacity, vehicleType, plate } = vehicle;
        const hashedPassword = await captainModel.hashPassword(password);
        const captain = await captainService.createCaptain({ email, password: hashedPassword, firstName, lastName, color, capacity, vehicleType, plate });
        const token = captain.generateAuthToken();
        res.status(201).json({ captain, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports.loginCaptain = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        const captain = await captainModel.findOne({ email }).select('+password');
        if (!captain) {
            throw new Error('Invalid email or password');
        }
        const isMatch = await captain.comparePassword(password, captain.password);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }
        const token = captain.generateAuthToken();
        res.cookie('token', token);
        res.status(200).json({ captain, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports.getCaptainProfile = async (req, res) => {
    try {
        const captain = await captainModel.findById(req.captain.id);
        res.status(200).json(captain);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports.logoutCaptain = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        await blackListTokenModel.create({ token });
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}