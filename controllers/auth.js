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
        OTP = "";
        for (let i = 0; i < 4; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
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

const loginUser = async (req, res, next) => {

    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            // res.status(400).send("provide all details");
            throw new BadRequestError('Please provide all the details');
        }

        //*checking if email exists in db
        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            // res.status(400).send("Invalid Credentials");
            throw new UnauthenticatedError('Invalid Credentials');
        }

        //*checking password
        const match = await bcrypt.compare(password, existingUser.password);

        //*loging in the user i.e. creating jwt token
        if (match) {
            let digits = '0123456789';
            let OTP = "";
            for (let i = 0; i < 4; i++) {
                OTP += digits[Math.floor(Math.random() * 10)];
            }

            await User.findOneAndUpdate({ email }, { otp: OTP });
            const messageText = `OTP for user with email ${email} is ${OTP}`;
            client.messages
                .create({
                    body: messageText,
                    from: process.env.twilioPhoneNumber,
                    to: existingUser.phone
                })
                .then(message => console.log(`SMS sent successfully. SID: ${message.sid}`))
                .catch(error => console.error(`An error occurred: ${error.message}`));

            await User.findOneAndUpdate({ email }, { otp: OTP });
            res.status(200).json({ email: existingUser.email });
        }
        else {
            // res.status(400).send("wrong credentials");
            throw new UnauthenticatedError('Invalid Credentials');
        }


    } catch (err) {
        // res.status(500).send(err);
        next(err);
    }
}

const userVerify = async (req, res, next) => {
    try {
        const { otp, email } = req.body;

        const existingUser = await User.findOne({ email });
        if (otp === existingUser.otp) {

            const token = jwt.sign(
                { firstname: existingUser.firstname, lastname: existingUser.lastname, id: existingUser._id },
                process.env.JWT_SECRET,
                { expiresIn: "3 days" }
            )
            res.status(200).send(token);
        }
        else {
            res.status(400).json({ message: "Incorrect otp!" });
        }
    } catch (error) {
        console.error(error);
    }

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