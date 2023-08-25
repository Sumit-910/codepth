const jwt = require('jsonwebtoken');

const { UnauthenticatedError } = require('../errors');
const { User } = require('../models/user');

const authentication = async (req, res, next) => {
    let token;

    try {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(" ")[1];
        }

        // console.log("token = "+token);

        if (!token) {
            throw new UnauthenticatedError('Not signedin');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new UnauthenticatedError('Not signedin');
        }

        req.user = user;
        next();

    } catch (err) {
        next(err);
    }
}

module.exports = authentication;