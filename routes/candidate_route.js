const app = require('express');
const router  = app.Router();
const Candidate = require('./../models/candidate_model')
const User = require('./../models/user_model')
const {jwtMiddleWare} = require('../jwt')



const checkAdminRole = async(id)=>{
    try{
        const isCheck = await User.findById(id)
    
        console.log('check user admin :',isCheck)
        if(isCheck && isCheck.role ==='admin'){
            console.log('im admin')
            return true;
        }
        else{
            console.log('im not admin')
            return false;
        }
    }
    catch(err){
        return false;
    }
}
router.post('/addCandidate',jwtMiddleWare,async(req,res)=>{
    try{
        const candidate = Candidate(req.body)
        const ischeck =  await checkAdminRole(req.userData.id)
        if(!ischeck){
            res.status(400).json({status:false,message:"Only admin can perform this task",data:null})
        }
       else if(candidate){
            const canData = await candidate.save();
            res.status(200).json({status:true,message:"Candidate Added SuccessFully",data:canData})
        }
        else{
            res.status(200).json({status:false,message:"somthing went wrong",data:null})
        }
    }
    catch(err){
        console.log(err)
        res.status(400).json({status:false,message:"somthing went wrong",data:null})
    }
})



router.get('/:id',jwtMiddleWare,async (req,res)=>{
    try{
        const canID = req.params.id;
       const check =  await checkAdminRole(req.userData.id)
        if(!check){
            res.status(400).json({status:false,message:"Only admin can perform this task",data:null})
        }
        const user = await Candidate.findById(canID)
        if(user==null) res.status(200).json({status:false,message:'Something went wrong',data :null})
        res.status(200).json({status:true,message:"Profile data loaded successfull",data:user})
        
    }
    catch(err){
        console.log(err)
        res.status(404).json({status:false,message:'Something went wrong',data :err})
    }
})


router.post('/deletecanDidatebyID',jwtMiddleWare,async (req,res)=>{
    try{
        const canID = req.body.id;
       const check =  await checkAdminRole(req.userData.id)
        if(!check){
            res.status(400).json({status:false,message:"Only admin can perform this task",data:null})
        }
        const user = await Candidate.findByIdAndDelete(canID)
        if(user==null) {
            res.status(200).json({status:false,message:'No candidate found',data :null})
        }
        else{
              
        res.status(200).json({status:true,message:"Delete successfull",data:user})
        }
      
        
    }
    catch(err){
        console.log(err)
        res.status(404).json({status:false,message:'Something went wrong',data :err})
    }
})

router.post('/updateByID/:id',jwtMiddleWare,async (req,res)=>{
    console.log('call')
    try{
        const data = req.body;
        const canID = req.params.id
       const check =  await checkAdminRole(req.userData.id)
        if(!check){
            res.status(400).json({status:false,message:"Only admin can perform this task",data:null})
        }
        const user = await Candidate.findByIdAndUpdate(canID,data, {
            new: true, // Return the updated document
            runValidators: true, // Run Mongoose validation
        })
        if(user==null) {
            res.status(200).json({status:false,message:'No candidate found',data :null})
        }
        else{
              
        res.status(200).json({status:true,message:"Updated successfull",data:user})
        }
      
        
    }
    catch(err){
        console.log(err)
        res.status(404).json({status:false,message:'Something went wrong',data :err})
    }
})
router.post('/seevotes',jwtMiddleWare,async (req,res)=>{
    console.log('call')
    try{
      const candidate = await Candidate.find().sort({voteCount:'desc'})
      //   const candidate = await Candidate.find({},'party count').sort({voteCount:'desc'})
      if(!candidate){
        res.status(200).json({status:true,message:"No voting data available ",data:[]})
      }
      else{
        const voteList = candidate.map((data)=>{
             
            return {
                    party:data.party,
                    count:data.voteCount,
                }
            
        })
        res.status(200).json({status:true,message:"Vote List",data:voteList})

      }
      //
        
    }
    catch(err){
        console.log(err)
        res.status(404).json({status:false,message:'Something went wrong',data :err})
    }
})
router.post('/givevote/:id',jwtMiddleWare,async (req,res)=>{
 
    try{

        const canID = req.params.id
        const uid = req.userData.id;

       const check =  await checkAdminRole(req.userData.id)
       const userData = await User.findById(uid)
       const canData = await Candidate.findById(canID)

        if(check){
            res.status(400).json({status:false,message:"Only user can perform this task",data:null})
        }
        else if(userData){
            if(userData.isVoted){
                res.status(200).json({status:false,message:"You have already gave vote",data:null})
            }
            else if(!canData){
                res.status(200).json({status:false,message:"No candidate found",data:null})
            }
            else{
                canData.votes.push({user:canID})
                canData.voteCount++;
               await canData.save()

               userData.isVoted = true
               await userData.save();

               res.status(200).json({status:true,message:"Voted successfully",data:null})
       
            }

        }
        else{
            res.status(200).json({status:false,message:"No User found",data:null})
        }


      
        
    }
    catch(err){
        console.log(err)
        res.status(404).json({status:false,message:'Something went wrong',data :err})
    }
})
router.get('/', async (req, res) => {
    try {
        // Find all candidates and select only the name and party fields, excluding _id
        const candidates = await Candidate.find({}, 'username party _id');

        // Return the list of candidates
        res.status(200).json(candidates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;