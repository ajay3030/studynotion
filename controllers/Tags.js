const Tags = require('../models/Tag');

exports.createTag = async (req,res)=>{
    try
    {
        const {name,description} = req.body
        //validation
        if(!name || !description)
        {
            return res.status(401).json({
                success:false,
                message:"fill all the require fields"
            })
        }
        //create entry in db 
        const tagDetails = await Tag.create({
            name:name,
            description:description
        })
        console.log(tagDetails);
        //return response 
        return res.json({
            success: true,
            message: 'Tag created succesfully'
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//get all tags 

exports.showAllTags = async (req,res)=>{
    try{
        const allTags = await Tag.find({},{name:true,description:true});
        return res.status(200).json({
            success: true,
            message: 'Tag created succesfully',
            allTags
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}