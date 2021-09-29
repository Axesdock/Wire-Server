const express = require('express');
const api = require('./api')
var cors = require('cors')
const mongoose = require('mongoose');
const Device = require('./models/device');

mongoose.connect('mongodb+srv://admin:IW0BGph6eQOZRQLP@cluster0.unq25.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
mongoose.Promise = global.Promise;


// set up our express app
const app = express();
app.use(cors());
app.use(express.json());

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

    socket.on('connect_device',function(data){
        var mac= data.mac;
        macSocketMapping[mac] = socket;
        Device.find({mac:mac}).then(())
    });

    socket.on('disconnect', function() {
        console.log('Got disconnect!');
        var i = connectedDevicesSocket.indexOf(socket);
        connectedDevicesSocket.splice(i, 1);
    });
});

 
 http.listen(4009, function() {
    console.log('listening on *:3000');
 });


// initialize routes
app.use('/api',api);

// error handling middleware
app.use(function(err,req,res,next){
    //console.log(err);
    res.status(422).send({error: err.message});
});

// listen for requests
app.listen(process.env.port || 4004, function(){
    console.log('Ready to Go!');
});