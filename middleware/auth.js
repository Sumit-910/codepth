const jwt=require('jsonwebtoken');

const { UnauthenticatedError } = require('../errors');
const { User } = require('../models');

export const authentication = async (req, res , next) => {
    let token;

    try {
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1];
    }

    // console.log("token = "+token);

    if(!token){
        throw new UnauthenticatedError('Not signedin');
    }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if(!user){
            throw new UnauthenticatedError('Not signedin');
        }

        req.user = user;
        next();
        
    } catch (err) {
        next(err);
    }
}

export const loginUser = async (req, res, next) => {

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
            OTP="";
            for(let i=0;i<4;i++){
                OTP+=digits[Math.floor(Math.random()*10)];
            }

            await User.findOneAndUpdate({email},{otp: OTP});

            await client.verify.v2.services('VA38891662bcc7fc8b9415b98c3302821d')
            .verifications
            .create({body: `OTP for user with email ${email} is ${OTP}`,to: existingUser.phone, channel: 'sms'})
            .then(verification => console.log(verification.status));
            next({OTP,existingUser});
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