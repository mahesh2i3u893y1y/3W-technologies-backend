const mongoose = require("mongoose")

const {Schema} = mongoose 

const mediaSchema = new Schema ({
    name:{
        type:String,
        required :true,
        minLenght:4,
        maxLength:30,
        trim:true
    },
    socialMediaHandle:{
        type:String,
        required :true,
        minLenght:4,
        maxLength:30,
        trim:true
    },
    images: {
        
        type: [String],
        required:true
    }
    },
    {timestamps:true}

)

const Submission = mongoose.model("Submission", mediaSchema) 

module.exports = Submission