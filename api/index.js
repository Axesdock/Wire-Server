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


// Fetch a specific device data
router.get('/devices/:name',function(req,res,next){
    Device.findOne({name:req.params.name}).then(function(devices){
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

router.get('/stats',function(req,res,next){
    let notRegistered = 0;
    let active = 0;
    let dead  = 0;
    let total = 0;
    Device.find({}).then((totalDevices)=>{
        total=totalDevices.length;
        Device.find({isRegistered:false}).then((notRegisteredDevices)=>{
            notRegistered = notRegisteredDevices.length;

            Device.find({status:'LIVE'}).then((activeDevices)=>{
                active = activeDevices.length;
                Device.find({status:'DEAD'}).then((deadDevices)=>{
                    dead = deadDevices.length;
                    res.send({notRegistered:notRegistered,active:active,dead:dead,total:total});
                })
            })
        })
    })
})

module.exports = router;