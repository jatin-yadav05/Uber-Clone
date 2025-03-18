const captainModel = require('../models/captain.model');

module.exports.createCaptain = async ({ email, password, firstName, lastName, color, capacity, vehicleType, plate }) => {
    if (!email || !password || !firstName || !lastName || !color || !capacity || !vehicleType || !plate) {
        throw new Error('All fields are required');
    }
    const captain = new captainModel({
        email,
        password,
        fullName: {
            firstName,
            lastName
        },
        vehicle: {
            color,
            capacity,
            vehicleType,
            plate
        }
    });
    return await captain.save();
}