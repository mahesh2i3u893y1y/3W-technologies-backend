const mongoose = require("mongoose")

const {Schema} = mongoose 

const adminPortal = new Schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
    },
    {timestamps : true}
) 

const Admin = mongoose.model("Admin", adminPortal) 

module.exports = Admin
