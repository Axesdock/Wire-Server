const express = require('express');
const api = require('./api')
var cors = require('cors')
const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://admin:IW0BGph6eQOZRQLP@cluster0.unq25.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
mongoose.Promise = global.Promise;


// set up our express app
const app = express();
app.use(cors());
app.use(express.json());

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