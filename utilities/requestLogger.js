const fs = require('fs');

const requestLogger=(req,res,next)=>{
    let data=`Date- ${new Date()}  Method=${req.method} Url=${req.url}\n`;
    fs.appendFile("requestLogger.txt",data,(err)=>{
        if(err)
        return next(err);
    })
    next();
}
module.exports=requestLogger;