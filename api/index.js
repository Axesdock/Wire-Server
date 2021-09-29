const express = require('express');
const router = express.Router();


const Device = require('../models/device');

// List all devices in dashboard
/*
{
    name:String,
    mac:String,
    status:String,
    installAddress:String,
    isRegistered:Boolean,
    lastConnected: Date,
    lastDisconnected: Date,
    comments:String,
    ports:[
        {
            id:Number,
            comment:String,
            status:String
        }
    ]
}
*/
router.get('/devices',function(req,res,next){
    Device.find({}).then(function(devices){
        res.send(devices);
    }).catch(next);
});


/*
Create a new device
{
    name:String,
    mac:String,
    status:String,
    installAddress:String,
    isRegistered:Boolean,
    lastConnected: Date,
    lastDisconnected: Date,
    comments:String,
    ports:[
        {
            id:Number,
            comment:String,
            status:String
        }
    ]
}
*/


router.post('/devices',function(req,res,next){
    Device.create(req.body).then(function(device){
        res.send(device);
    }).catch(next);
});

/*
Update a device
{
    mac:String,
    status:String,
    installAddress:String,
    isRegistered:Boolean,
    lastConnected: Date,
    lastDisconnected: Date,
    comments:String,
    ports:[
        {
            id:Number,
            comment:String,
            status:String
        }
    ]
}
*/
router.put('/devices/:name',function(req,res,next){
    Device.findOneAndUpdate({name: req.params.name},req.body).then(function(device){
        console.log(device);
        Device.findOne({_id: device._id}).then(function(device){
            res.send(device);
        });
    });
});

module.exports = router;