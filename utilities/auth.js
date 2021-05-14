const jwt=require('jsonwebtoken');
require('dotenv').config();
const auth=(req,res,next)=>{
    const token=req.header('x-auth-token');
    if(!token) res.status(401).send('Access denied.No token provided')
    try {
        const decode= jwt.verify(token,process.env.TOKEN_SECRET);
        req.user=decode;
        next();
    } catch (error) {
        next(error);
    }
}
module.exports=auth;