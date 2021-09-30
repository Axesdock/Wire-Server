const express = require('express');
const router = express.Router();
var uniqid = require('uniqid'); 

const User = require('../models/user');

router.post('/login',function(req,res,next){
    var {username, password} = req.body;
    User.findOne({username:username}).then((user)=>{
        if(user == undefined || user.password != password){
            res.send({status:'failed'});
            return;
        }
        var token = uniqid();
        User.findOneAndUpdate({username:username},{token:token}).then();
        res.send({name:user.name, token:token, status:'success'});
    })
});

router.post('/logout',function(req,res,next){

});

router.post('/verify',function(req,res,next){
    var {token} = req.body
    User.findOne({token:token}).then((user)=>{
        if(user == undefined){
            res.send({status:'failed'});
        }else{
            res.send({name:user.name, status:'success'});
        }
    })
});


module.exports=router;



