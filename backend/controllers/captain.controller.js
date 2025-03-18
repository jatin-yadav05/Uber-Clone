const captainService = require('../services/captain.service');
const captainModel = require('../models/captain.model');
const { validationResult } = require('express-validator');

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