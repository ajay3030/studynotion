const Section = require('../models/Section');
const Course = require('../models/Course');

exports.createSection = async (req, res) => {
    try{
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
        success:true,
        message:"section creates succesfully",
        updateCourseDetails,
    })
    }
    catch(error)
    {   
        console.log(error);
        return res.status(500).json({
            success:true,
            message:error.message
        })
    }
}