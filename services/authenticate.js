const User = require('../models/user');

function authenticate(token)
{
    return new Promise((resolve, reject)=>{
        User.findOne({token:token}).then((user)=>{
            resolve(user);
        }).catch(err=>reject(err));
    });
}

module.exports = authenticate;