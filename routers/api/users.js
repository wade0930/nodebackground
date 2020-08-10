// @login & register
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const passport = require("passport");

const User =require("../../models/User");
const Key =require("../../config/keys");
const { Passport, session } = require("passport");



//$route POST api/users/post
//@desc 返回請求的json
router.post("/register",(req,res)=>{
     console.log(req.body);

   //查詢數據庫中是否有郵箱
   User.findOne({email:req.body.email})
       .then((user)=>{
           if(user){
               return res.status(400).json("郵箱已經被註冊!")
           }
           else{
                const avatar = gravatar.url(req.body.email, {s: '200', r: 'g', d: 'mm'});
                const NewUser =new User({
                   name:req.body.name,
                   email:req.body.email,
                   avatar,
                   password:req.body.password,
                   identity:req.body.identity
               })
               //加密
               bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(NewUser.password, salt,(err,hash) => {
                    if(err) throw err; //錯誤拋出

                    NewUser.password = hash; //加密

                    NewUser.save()
                           .then(user => res.json(user))
                           .catch(err=>console.log(err));
                });
            });
               
           }
       })
})


//$route POST api/users/login
//@desc 返回 token jwt passport
router.post("/login",(req,res)=>{
    const email = req.body.email;
    const password =req.body.password;

    //查詢數據庫
    User.findOne({email})
        .then(user =>{
            if(!user){
                return res.status(404).json("用戶不存在!");
            }
            //密碼匹配
            bcrypt.compare(password, user.password)
                  .then(isMatch => {
                      if(isMatch){
                          const rule ={
                              id:user.id,
                              name:user.name,
                              avatar:user.avatar,
                              identity:user.identity
                            };
                          jwt.sign(rule,Key.SecretKey,{expiresIn:3600},(err,token)=>{
                            if(err) throw err;  
                            res.json({
                                  success:true,
                                  token:"Bearer "+token //必須是Bearer才可以驗證過
                              });
                          })
                        //res.json({msg:"Sucess"})
                      }
                      else{
                          return res.status(400).json("密碼錯誤");
                      }
                  })
        })
})


//$route GET api/users/current
//@desc  return current user

router.get("/current",passport.authenticate("jwt",{session:false}),(req,res)=>{ //驗證
    res.json({
        id:req.user.id,
        name:req.user.name,
        email:req.user.email,
        identity:req.user.identity
    });
});



module.exports= router;