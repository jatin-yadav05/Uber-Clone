const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const blackListTokenModel = require('../models/blackListToken.model');
const captainModel = require('../models/captain.model');
dotenv.config();

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const isBlackListed = await blackListTokenModel.findOne({token});

    if(isBlackListed) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTimestamp) {
            return res.status(401).json({ error: 'Token has expired' });
        }

        const user = await userModel.findOne({ _id: decoded.id });
        if (!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }
        res.status(401).json({ error: 'Please authenticate' });
    }
}

module.exports.authCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const isBlackListed = await blackListTokenModel.findOne({token});

    if(isBlackListed) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTimestamp) {
            return res.status(401).json({ error: 'Token has expired' });
        }
        const captain = await captainModel.findOne({ _id: decoded.id });
        if (!captain) {
            throw new Error();
        }
        req.token = token;
        req.captain = captain;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }
        res.status(401).json({ error: 'Please authenticate' });
    }
}