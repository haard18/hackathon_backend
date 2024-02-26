const mongoose = require('mongoose');
const {Schema} = mongoose;

const orderSchema = new Schema({
    projectName:{
        type:String,
        required:true
        // string
    },
    coordinates:{
        startLat:{ type:String},
        startLong:{type:String},
        endLat:{type:String},
        endLong:{type:String},
        // startLan startLong endLan endLong
    },
    coordinatesTravelled:[
       {
        lat:{type:String},
        long:{type:String}
       } // 
    ],
    orderAmount:{
        type:Number,
        required:true
    },
    orderDetails:{
        type:String,
    },
    orderStatus:{
        type:String,
        enum:['pending','accepted','rejected'],
        default:'pending'
        // pending,accepted,rejected
    },
    orderDelivered:{
        type:Boolean,
        required:true,
        default:false
        // true fase    
    },
    orderEnterprise:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Enterprise'
        // 
    },
    orderDriver:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Driver'
        // 
    }
})

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;