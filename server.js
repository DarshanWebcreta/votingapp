const express = require('express');
var bodyParser = require('body-parser')
const app = express();
require('dotenv').config()
const userRouter = require('./routes/user_route')
const candidate = require('./routes/candidate_route')
const db = require('./db')

app.use(bodyParser.json())



app.use('/user',userRouter);
app.use('/candidate',candidate);
app.listen(process.env.PORT||3000,()=>{
    console.log("Listening successfully")
})