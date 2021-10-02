const express = require('express');
var cors = require('cors')
const mongoose = require('mongoose');
const Device = require('./models/device');
const devices = require('./api/devices')
const auth = require('./api/auth')
mongoose.connect('mongodb+srv://admin:IW0BGph6eQOZRQLP@cluster0.unq25.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
mongoose.Promise = global.Promise;


// set up our express app
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('static'))

// Socketio
const http = require('http').Server(app);
const io = require('socket.io')(http,{
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

var connectedDevicesSocket = [];
var macSocketMapping = {};

io.sockets.on('connection', function(socket) {
    connectedDevicesSocket.push(socket);
    console.log("Device Connected!!")
    socket.on('connect_device',function(data){
        if(data.mac == undefined) return;
        var mac= data.mac;
        console.log("Connect msg from mac: ",mac)
        macSocketMapping[mac] = socket;
        Device.find({mac:mac}).then((device)=>{
            console.log(device);
            if(device.length == 0)
            {
                console.log("in");
                Device.create({name:mac,mac:mac,isRegistered:false, status:'LIVE', lastConnected:Date.now()})
            }else{
                Device.findOneAndUpdate({mac:mac},{status:'LIVE', lastConnected:Date.now()}).then((d)=>{})
            }
        })
    });

    socket.on('disconnect', function() {
        console.log('Got disconnect!');
        var i = connectedDevicesSocket.indexOf(socket);
        connectedDevicesSocket.splice(i, 1);
        for(var mac in macSocketMapping)
        {
            if(socket == macSocketMapping[mac])
            {
                console.log("here!!")
                console.log(mac);
                Device.findOneAndUpdate({mac:mac},{status:'DEAD', lastDisconnected:Date.now()}).then((d)=>{});
                delete macSocketMapping[mac];
                return;
            }
        }
    });
});

 
 http.listen(4011, function() {
    console.log('listening on *:3000');
 });


// initialize routes
app.use('/api/devices',devices);
app.use('/api/auth',auth);
app.get('/api/stats',function(req,res,next){
    let notRegistered = 0;
    let active = 0;
    let dead  = 0;
    let total = 0;
    console.log("stats")
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

// API to control the device
app.post('/control', (req,res)=>{
    var {name,port,command} = req.body;
    Device.findOne({name:name}).then((device)=>{
        mac = device.mac;
        if(macSocketMapping[mac] == undefined){
            res.status(404).send({});
        }else{
            macSocketMapping[mac].emit('control',{port:port,command:command});
            portData = device.ports;
            for(var p in portData){
                console.log(p);
                if(portData[p].id == port)
                {
                    portData[p].status=command;
                }
            }
            console.log(portData);
            Device.findOneAndUpdate({name:name},{ports:portData}).then();
            res.send();
        }
    })
});
// error handling middleware
app.use(function(err,req,res,next){
    //console.log(err);
    res.status(422).send({error: err.message});
});

// listen for requests
app.listen(process.env.port || 4004, function(){
    console.log('Ready to Go!');
});