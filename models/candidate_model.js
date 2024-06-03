const mongoose = require('mongoose');

const candidateModel = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    party:{
        type:String,
        required:true,
        unique:true
    },
    age:{
        type:Number,
        required:true
    },
    votes:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",//kyathi aavse ana mate chhe atle aapde aaya  table nu name devanau 
                required:true
            },
            votedAt:{
                type:Date,
                default:Date.now()
            }
        }
    ],
    voteCount:{
        type:Number,
        default:0
    }

})

const Candidate = mongoose.model('Candidate',candidateModel);

module.exports = Candidate;