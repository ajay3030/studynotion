const mongoose = require('mongoose')
const mailSender = require('../utils/mailSender.js')
const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    }
})

//function to send the mail

async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(email,"verification Email from StudyNotion", otp);
        console.log("mail send succesfully ",mailResponse);
    }
    catch(error)
    {
        console.log("this is error occur while sending mail",error)
        throw error
    }
}

OTPSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
})
module.exports= mongoose.model('OTP',OTPSchema)