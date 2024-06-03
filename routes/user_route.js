const app = require('express');
const router  = app.Router();
const userModel = require('./../models/user_model')
const {creatToken,jwtMiddleWare} = require('../jwt')

router.post('/signup',async(req,res)=>{
    try{
        const user = userModel(req.body)
        if(user!=null){
            const userData = await user.save();
            const payload  = {
                id : userData.id
            }
            const token  = creatToken(payload) 
            res.status(200).json({status:true,message:"User signup SuccessFully",data:userData,token:token})
        }
        else{
            res.status(200).json({status:false,message:"somthing went wrong",data:null})
        }
    }
    catch(err){
        res.status(400).json({status:false,message:"somthing went wrong",data:err})
    }
})
// 

router.post('/login',async(req,res)=>{
    try{
        const {addharNo,password} = req.body;
         if(req.body==null)
            {res.status(404).json({status:false,message:'Something went wrong',data :null})}

            const user = await userModel.findOne({addharNo:addharNo})
            if(!user || !await(user.checkPassWord(password)))
                {

                res.status(401).json({status:true,message:'Invalid Cred',data :user==null?"dj null":user})
                }
                else{
            const payload = {
                id:user.id,
            }

                const token = await creatToken(payload);
                res.status(200).json({status:true,message:"Login successfull",token:token,data:user})
        }

    }
    catch(err){
       res.status(404).json({status:false,message:'Something went wrong',data :null})
    }
})

router.get('/profile',jwtMiddleWare,async (req,res)=>{
    try{
        const userdata = req.userData;
        console.log(userdata)
        const user = await userModel.findById(userdata.id)
        if(user==null) res.status(200).json({status:false,message:'Something went wrong',data :null})
        res.status(200).json({status:true,message:"Profile data loaded successfull",data:user})
        
    }
    catch(err){
        console.log(err)
        res.status(404).json({status:false,message:'Something went wrong',data :err})
    }
})


router.post('/profile/password',jwtMiddleWare,async (req,res)=>{

    try{
        const {newpass,oldpass} = req.body;
        const userdata = req.userData;
    
        
        const user = await userModel.findById(userdata.id)
        const match  =await   user.checkPassWord(oldpass);

        if(match){

            user.password = newpass;
            const savedData = await user.save();
        res.status(200).json({status:true,message:"Password changed successfully",data:savedData})
        
        }
        else{
            res.status(200).json({status:false,message:'Wrong passoword',data :null})
        }
    }
    catch(err){
        console.log(err)
        res.status(404).json({status:false,message:'Something went wrong',data :err})
    }
})

module.exports = router;