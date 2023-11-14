const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//auth

exports.auth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.body.token || req.header("Autherisation").replace("Bearer", "");
        //if token missing , then return response 
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "token is missing"
            }) 
        }
        //verify the token 
        try{
            const decode =  jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode
        }
        catch(error){
            //verification issue
            return res.status(401).json({
                success: false,
                message: "token is invalid"
            }) 
        }
        next()
    }

    catch (error) {
        return res.status(500).json({
            success: false,
            message: "something went wrong while validation"
        }) 
    }
    
}

exports.isStudent = async(req,res,next)=>{
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"this is protected route for the studensts only "
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "user role cannot validate , somthing went wrong "
        }) 
    }
}
exports.isInstructor = async(req,res,next)=>{
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"this is protected route for the Instructor only "
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "user role cannot validate , somthing went wrong "
        }) 
    }
}

exports.isAdmin = async(req,res,next)=>{
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"this is protected route for the admin only "
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "user role cannot validate , somthing went wrong "
        }) 
    }
}