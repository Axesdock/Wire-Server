const authenticate = require("../services/authenticate");


function authenticateMiddleware(req,res,next){
    authenticate(req.header)
}