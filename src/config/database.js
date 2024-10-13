const mongoose = require("mongoose")

const connectDb = async () => {
    await mongoose.connect("mongodb+srv://mahesh20:Mahesh2943@projectx.p5ou9.mongodb.net/3W-database" )

}

module.exports = {connectDb}