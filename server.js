const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require('passport');

const app = express();

//引入users.js
const users= require("./routers/api/users");
const profiles= require("./routers/api/profiles");

//DB config
const db =require("./config/keys").mongoURI;

//使用body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//passport初始化
app.use(passport.initialize());

//引入passport
require("./config/passport")(passport);

//連接mongoDB
mongoose.connect(db,{ useUnifiedTopology: true , useFindAndModify: false})
.then(()=>console.log('mongoDB connected'))
.catch(err => console.log(err));

// app.get("/",(req,res)=>{
//     res.send("hello how are you");
// })

//routers
app.use("/api/users",users);
app.use("/api/profiles",profiles);

const port = process.env.port || 5000;

app.listen(port,()=>{
    console.log('test');
})