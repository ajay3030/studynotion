const { response } = require('express');
const Profile = require('../models/Profile');
const User = require('../models/User');

exports.updateProfile = async (req, res) => {
    try {
        //fetch data 
        const { gender, dateOfBirth = "", about = "", contactNumber } = req.body;
        //get userId
        const id = req.user.id;
        //validate data 
        if (!gender || !id || !contactNumber) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }


        //find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        //update profile 
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber
        await profileDetails.save();

        //return response 
        return res.status(200).json({
            success: true,
            message: "profile updated succesfully",
            profileDetails,
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.deleteAccount = async (req, res) => {
    try {
        //get id 
        const id = req.user.id;
        //validation
        const userDetails = await User.findById(id);
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        //delete profile
        await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });
        //delete user 
        await User.findByIdAndDelete({ _id: id });
        //return response 

        return res.status(200).json({
            success: true,
            message: "profile deleted succesfully",

        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
exports.getAllUserDetails = async (req, res) => {
    try {
        //get id 
        const id = req.user.id;

        //validation and get user details 
        const userDetails = await findById(id).populate("additionalDetails").exec();

        //return response
        return res.status(200).json({
            success: true,
            message: "user data fetch succesfully",

        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

