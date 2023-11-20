const Course = require('../models/Course');
const Tag = require('../models/Tag');
const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
require('dotenv').config();

//create course handler function
exports.createCourse = async (req, res) => {
    try {
        //fetch data
        const { courseName, courseDescription, whatYouWillLearn, price, tag } = req.body

        //get thumbnail
        const thumbnail = req.files.thumbnailImage;

        //vaidation
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        //check for instruction
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("instructor Details", instructorDetails);

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: 'instructor details not found'
            })
        }

        //check given tag is valid or not
        const tagDetails = await Tag.findById(tag);
        if (!tagDetails) {
            return res.status(4004).json({
                success: false,
                message: 'tag Details not found'
            })
        }

        //upload image top cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //create an entry for new course 
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            Instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail: thumbnailImage.secure_url
        })

        //add the new course to the user schema of instructor 
        await User.findByIdAndUpdate(
            { _id: instructorDetails._id },
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            { new: true },
        )

        //update the tag schema 

        // return response
        return res.status(200).json({
            success: true,
            message: "course created succesfully",
            data: newCourse
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "course created failed",
            error: error.message
        })
    }
}

//get all courses handler function

exports.showAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({}, {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentsEnrolled: true
        }).populate("instructor").exec()

        // return response
        return res.status(200).json({
            success: true,
            message: "course fetch succesfully",
            data: allCourses
        })
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "course fetch failed ",
            error: error.message
        })
    }
}