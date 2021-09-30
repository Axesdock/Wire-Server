const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create student schema & model
const DeviceSchema = new Schema({
    name: {
        type: String,
    },
    mac:{
        type:String,
    },
    installAddress:{
        type:String,
    },
    ports:[{
        id:Number,
        comment:String,
        status:String
    }],
    status:String,
    isRegistered:Boolean,
    lastConnected: Date,
    lastDisconnected: Date,
    comment:String
});


const Device = mongoose.model('device',DeviceSchema);

module.exports = Device;