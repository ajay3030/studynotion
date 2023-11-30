const SubSection = require("../models/SubSection")
const Section = require("../models/Section");
require('.env').config();
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// create subsection

exports.createSubSection = async (req,res) =>{
    try{
        //fetch data from req body
        const {sectionId,title,timeDuration,description}= req.body
        //extract file/video
        const video = req.files.videoFile;
        //validation
        if(!sectionId || !title || !timeDuration || description || !video)
        {
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })}
        //upload video cloudinary 
        const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        //create subsection
        const SubSectionDetails = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url
        })
        //update section with this sub section objectId
        const updateSection = await Section.findByIdAndUpdate({_id:sectionId},
            {
                $push:{
                    subSection:SubSectionDetails._id,
                }
            },{new:true})
        //return response 
        return res.status(200).json({
            success: true,
            message: "sub section created succesfully",
            updateSection,
        })
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    
    }
}