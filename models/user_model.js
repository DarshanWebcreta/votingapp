const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userModel = mongoose.Schema({
    username:{
        type:String,
    },
    mobile:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    addharNo:{
        type:String,
        required:true,

    },
    address:{
        type:String,
        required:true,

    },
    age:{
        type:Number,
        required:true,

    },
    role:{
        type:String,
        enums:["admin","voter"],
        required:true,
        default:"voter"
     
    },
    isVoted:{
        type:Boolean,
        default:false

    },

})

userModel.pre('save',async function(next){
    const user = this;
    if(!user.isModified('password')) next()
    try{
      const salt  = await bcrypt.genSalt(10)
      const pass = await bcrypt.hash(user.password,salt);
      user.password = pass;
      next();
    }
    catch(err){
        console.log('erro come here');
        next(err);
    }
})

userModel.methods.checkPassWord = async function(pass){
    try{
        const ismatch  = await bcrypt.compare(pass,this.password);
        console.log("is match",ismatch)
        return ismatch;
    }
    catch(err){
        console.log("is match err",err)
        throw err;
    }
}

const User = mongoose.model('User', userModel);
//User a table bnse 
module.exports = User;