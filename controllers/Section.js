const Section = require('../models/Section');
const Course = require('../models/Course');

exports.createSection = async (req, res) => {
    try {
        // fetch data 
        const { sectionName, courseId } = req.body;
        //validate date 
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "someting is missing"
            })
        }
        //create section
        const newSection = await Section.create({ sectionName })

        //update the course table with course ID 
        const updateCourseDetails = await Course.findByIdAndUpdate(courseId,
            {
                $push: {
                    courseContent: newSection._id
                }
            },
            { new: true })
        //return response 
        return res.status(200).json({
            success: true,
            message: "section creates succesfully",
            updateCourseDetails,
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: true,
            message: error.message
        })
    }
}

exports.updateSection = async (req, res) => {
    try {
        //fetch data
        const { sectionName, sectionId } = req.body
        //validate data
        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "someting is missing on update section"
            })
        }
        //update section
        const section = await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true })
        //return response
        return res.status(200).json({
            success: true,
            message: "section updated succesfully",
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

exports.deleteSection = async (req, res) => {
    try {
        //get the id assuming that we send it ina param
        const { sectionId } = req.param
        //use findbyidanddlete 
        await Section.findByIdAndDelete(sectionId)
        //return response 
        return res.status(200).json({
            success: true,
            message: "section deleted succesfully",
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