const express = require('express');
var cors = require('cors')
const mongoose = require('mongoose');
const Device = require('./models/device');
const devices = require('./api/devices')
const auth = require('./api/auth')
mongoose.connect('mongodb+srv://admin:IW0BGph6eQOZRQLP@cluster0.unq25.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
mongoose.Promise = global.Promise;


const httpport=4011;
const wsport=8011;


// set up our express app
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('static'))

// Socketio
const http = require('http').Server(app);
var WebSocketServer = require('websocket').server;
var http2 = require('http');
 
var server = http2.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(wsport, function() {
    console.log('Websocket on port: '+wsport);
});
 
var connectedDevicesSocket = [];
var macSocketMapping = {};
 
 http.listen(httpport, function() {
    console.log('Dashboard and API on port:'+httpport);
 });

 wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});
 
function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed. 
  return true;
}

function device_connect(connection, data)
{
    var mac= data.mac;
    console.log("Connect msg from mac: ",mac)
    macSocketMapping[mac] = connection;
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
}

function closeConnection(connection)
{
    console.log('Got disconnect!');
    var i = connectedDevicesSocket.indexOf(connection);
    connectedDevicesSocket.splice(i, 1);
    for(var mac in macSocketMapping)
    {
        if(connection == macSocketMapping[mac])
        {
            console.log("here!!")
            console.log(mac);
            Device.findOneAndUpdate({mac:mac},{status:'DEAD', lastDisconnected:Date.now()}).then((d)=>{});
            delete macSocketMapping[mac];
            return;
        }
    }
}


wsServer.on('request', function(request) {
	
    if (!originIsAllowed(request.origin)) {
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('arduino', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    
	connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            var data = JSON.parse(message.utf8Data);
            if(data.event == 'connect')
            {
                device_connect(connection, data);
            }
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
           //connection.sendBytes(message.binaryData);
        }
    });
    
	connection.on('close', function(reasonCode, description) {
        closeConnection(connection);
    });
	
	connection.sendUTF("Hallo Client!");
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
    console.log(req.body);
    Device.findOne({name:name}).then((device)=>{
        mac = device.mac;
        // console.log("device"+device);
        // console.log(mac)
        if(macSocketMapping[mac] == undefined){
            res.status(404).send({});
        }else{
            var sendData = "{\"event\":\"control\",\"port\":"+port+",operation:\""+command+"\"}"
            macSocketMapping[mac].sendUTF(sendData);
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