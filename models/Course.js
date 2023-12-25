const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String
    },
    courseDescription: {
        type: String
    },
    Instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    whatYouWillLearn: {
        type: String
    },
    courseContent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
            required: true
        }
    ],
    ratingAndReviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RatingAndReview",
            required: true
        }
    ],
    price: {
        type: Number
    },
    thumbnail: {
        type: String
    },
    tag:{
        type: [String],
        ref: "Tag",
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    studentsEnrolled:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ],
    instruction : {
        type:[String]
    },
    status:{
        type:String,
        enum:['Drafts','Published'],
    }

})

module.exports = mongoose.model("Course", courseSchema);