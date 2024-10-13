const express = require("express")
const cors = require("cors")
const path = require("path")
const multer = require("multer") 
const bcrypt = require("bcrypt")

const app = express()
app.use(express.json())
app.use(cors())
const {connectDb} = require('./config/database')
const Submission = require("./model/social") 
const Admin = require("./model/admin")
app.use("/uploads",express.static("uploads"))

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,"uploads/")

    },
    filename: function(req,file,cb){
            let ext = path.extname(file.originalname)
            cb(null, Date.now() + ext)
    }

});
const upload = multer({
     storage: storage ,
     fileFilter:function(req,file,callback){
        if(
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg"
        ){
            callback(null,true)
        }else{
            console.log("only jpg and png images are supported!!")
            callback(null,false)
        }
     },
     limits :{
        fileSize : 1024 *1024 * 10
     }
    }
    );

app.post('/submit', upload.array('images',10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
          }
        
          
          const filePaths = req.files.map(file => {
            return file.path;
          });
        const submission = new Submission({
            name: req.body.name,
            socialMediaHandle: req.body.socialMediaHandle,
            images: filePaths,
        });

       

        await submission.save();
        res.status(200).json({ message: 'Submission successful!' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting data', error });
    }
});

app.get('/users', async (req,res) => {
    try{
    const result = await Submission.find({})
    if(!result){
        throw new Error("Data not Available")
    }
    res.send(result)
    }catch(err){
        res.status(500).json({ message: 'Not found', err });
    }
})

app.post("/admin", async (req,res) => {
   try{
    const {name,password} = req.body 
    const hashedPassword = await bcrypt.hash(password,10)
    const admin = new Admin({name,password:hashedPassword})
    await admin.save() 
    res.send("Admin Added succesfully!!")
   }catch(err){
    res.status(500).json({ message: 'Not found', err });
   }

})

app.post("/admin-login" , async (req,res) => {
    try{
        const {name,password} = req.body 

    const admin = await Admin.findOne({name:name}) 
    if(!admin){
        throw new Error("Admin not available !!")
    }
    const isPassword = await bcrypt.compare(password,admin.password) 

    if(isPassword){
        res.send("Admin login sucessfully !!")
    }else{
        throw new Error("Something went wrong")
    }
    }catch(err){
        res.status(500).send("ERROR :" + err.message );
    }
})

connectDb().then(()=>{
    console.log("database connected succesfully !!")
    app.listen(3000 , () =>{
        console.log("server running on http://localhost:3000/")
    })
}).catch(() =>{
    console.log("Falied to connect !!")
})