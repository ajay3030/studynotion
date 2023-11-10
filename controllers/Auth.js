const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator')
const bcrypt = require('bcrypt');


//send otp to user before the signup
exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        //check the email exist or not
        const checkEmail = await User.findOne({ email });

        if (checkEmail) {
            return res.status(401).json({
                sucess: false,
                message: "user already exists"
            })
        }

        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })

        console.log("generated otp is ", otp);
        //check unique otp or not

        const result = await OTP.findOne({ otp: otp });

        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            })
            result = await OTP.findOne({ otp: otp });

        }

        const otpPayload = { email, otp }

        //create entry in db
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        res.status(200).json({
            sucess: true,
            message: "atp added in a db succesfully"
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            sucess: false,
            message: error.message
        })

    }
}

exports.signUp = async (req, res) => {
    try {
        //data fetch from the user body 
        const { firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;
        //validation

        if (!firstName || !lastName || !password || !confirmPassword || !otp) {
            return res.send.status(403).json({
                success: false,
                message: "All fields are required",
            })
        }
        //match both passwords 

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "passwords are not matching"
            })
        }
        // check user already exist or not 

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'user is already registered'
            });
        }

        //find most recent otp stored for the user 
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(recentOtp);
        //validate otp 
        if (recentOtp.length == 0) {
            //otp not found
            return res.status(400).json({
                sucess: false,
                message: 'OTP found'
            })
        } else if (otp !== recentOtp.otp) {
            //invalid OTP 
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
        }
        //hash password 
        const hashPassword = await bcrypt.hash(password, 10);

        //create entry in table db
        const ProfileDetails = await Profile.create({
            gender: null,
            dateOfBrth: null,
            about: null,
            contactNumber: null
        })
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashPassword,
            accountType,
            additionalDetails: ProfileDetails._id,
            image: `https://api.dicevear.com?5.x/initials/svg/?seed=${firstName} ${lastName}`
        })
        //return res
        return res.status(200).json 
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            sucess: false,
            message: error.message
        })
    }
}