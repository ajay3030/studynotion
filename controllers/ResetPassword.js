const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require('bcrypt')
//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
    try {
        //get mail from req body
        const email = req.body.email;
        //check User of this mail 
        const user = await User.findOne({ email: email });
        if (!user) {
            console.log(error);
            return res.status(401).json({
                success: false,
                message: 'something went wrong in finding user reseting password generate token '
            })
        }
        //generate token 
        const token = crypto.randomUUID();
        //update user by token and expiration date 
        const updateDetails = await User.findOneAndUpdate({ email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000,
            }, { new: true })
        //create url
        const url = `http://localhost:3000/update-password/${token}`;
        //send mail contaninning url
        await mailSender(email, "password Reset Link ", `passord Reset Link:${url}`);
        // return response 
        return res.json({
            success: true,
            message: 'email not send succesfully '
        })

    }
    catch (error) {
        cosnole.log(error);
        return res.status(500).json({
            success: false,
            message: 'something went wrong in reseting password generate token '
        })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        //date fetch 
        const { password, confirmPassword, token } = req.body;
        //validation 
        if (password !== confirmPassword) {
            return res.status(401).json({
                success: false,
                message: 'password is not matching '
            })
        }
        //get userdetials from db using token
        const userDetails = await User.findOne({ token: token });
        //if no entry - invalif token 
        if (!userDetails) {
            return res.status(401).json({
                success: false,
                message: 'user not found in reset password api '
            })
        }
        // token expiration check
        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.status(401).json({
                success: false,
                message: 'token expires '
            })
        }
        //password hash
        const hashedPassword = await bcrypt.hash(password, 10);

        //password update 
        await User.findOneAndUpdate(
            { token: token },
            { password: hashedPassword },
            { new: true },
        )
        // return response 
        return res.json({
            success: true,
            message: 'password updated succesfully'
        })
    }
    catch (error) {
        cosnole.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}