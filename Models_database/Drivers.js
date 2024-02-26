const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  licenseInformation: {
    type: String,
    required: true,
  },
  vehicleInformation: {
    type: String,
    required: true,
  },
  shiftAvailability: {
    type: Boolean,
    default: true,
  },
  locationData: {
    type: [Number], // Use appropriate type for storing location data
    required:true,
  },
  password:{
    type:String,
    required:true,
  }
  // Additional driver-specific fields
});

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
