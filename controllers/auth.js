const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const { BadRequestError, UnauthenticatedError } = require('../errors');

const createUser = async (req, res, next) => {

    try {
        const {
            name,
            email,
            phone,
            password
        } = req.body;

        if (!name || !email || !phone || !password) {
            // res.status(400).send("Provide all the details");
            throw new BadRequestError('Please provide all the details');
        }

        //*hash password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        //* otp
        let digits = '0123456789';
            OTP="";
            for(let i=0;i<4;i++){
                OTP+=digits[Math.floor(Math.random()*10)];
            }

        //* saving details in the user model
        const user = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            otp: OTP
        });

        //* saving the user in db
        const createdUser = await user.save();
        res.status(200).json(createdUser);

    } catch (err) {
        // res.status(500).send(err);
        next(err);
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (err) {
        next(err);
    }
}

const userVerify = async (req, res, next) => {
    const otp = req.body;

    const token = jwt.sign(
        { firstname: existingUser.firstname, lastname: existingUser.lastname, id: existingUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "3 days" }
    )
    res.status(200).send(token);

}

const getUser = async (req, res, next) => {
    try {
        const user = req.user;

        res.status(200).send(user);


    } catch (err) {
        next(err);
    }
}

module.exports = {
    createUser,
    loginUser,
    userVerify,
    getUser,
    getAllUsers
}