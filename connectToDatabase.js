const mongoose=require('mongoose');
const uri='mongodb://localhost:27017/Logistic_hackathon'
const connectToMongoose=async()=>{
    await mongoose.connect(uri)
    
        console.log("connectd to mongoose");

}
module.exports=connectToMongoose;