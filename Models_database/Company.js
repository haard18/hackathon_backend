const mongoose = require('mongoose');
const { Schema } = mongoose;
const enterpriseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true,
    },
    password:{
        type:String,
        required:true,

    },
    domainOfWork: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    location: {
        type: [Number],
        required: true,
    },
})
const Enterprise = mongoose.model('Enterprise', enterpriseSchema);

module.exports = Enterprise;