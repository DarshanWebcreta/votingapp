const mongoose = require('mongoose')

const mongooseUrl = 'mongodb://127.0.0.1:27017/VotingApp';

const mongo = mongoose.connect(mongooseUrl)

const db = mongoose.connection;

db.on('connected',()=>{
    console.log("Db connected ")
})

db.on('error',(err)=>{
    console.log("Db has error :",err)
})

db.on('disconnected',()=>{
    console.log("db disconnected")
});

module.exports = db;