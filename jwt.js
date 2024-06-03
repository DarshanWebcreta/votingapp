const jwt = require('jsonwebtoken')


const creatToken =  (userData)=>{
    try{
        const token  =   jwt.sign(userData,process.env.JWT_SEC_KEY,{expiresIn:30000})
        return token;
    }
    catch(err){

    }
}

const jwtMiddleWare = (req,res,next)=>{
    try{
        const auth = req.headers.authorization;
        if(!auth) res.status(404).json({status:false,message:'No authorities',data :null})
            const authtoken = auth.split(' ')[1]
            if(!authtoken){ res.status(404).json({status:false,message:'No token found',data :null})}

            const token  = jwt.verify(authtoken,process.env.JWT_SEC_KEY)

            req.userData = token;
            console.log(token)
            next()
    }
    catch(err){
        res.status(404).json({status:false,message:'Something went wrong',data :err})
    }
}

module.exports = {creatToken,jwtMiddleWare}