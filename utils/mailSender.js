const nodemailer = require("nodemailer");
require('dotenv').config();
const mailSender = async (email,title,body)=>{
    try{
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth: {
                user: 'candice.christiansen97@ethereal.email',
                pass: 'rsZRYSusTBJUfRSgXS'
            }
        })

        let info = await transporter.sendMail({
            from:'studyNotion',
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        })
        console.log(info);
        return info;
    }
    catch{
        console.log("error in mainsender",error.message)
    }
}

module.exports = mailSender;