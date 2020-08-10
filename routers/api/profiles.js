// @login & register
const express = require("express");
const router = express.Router();

const passport = require("passport");

const User =require("../../models/Profile");
// const { route } = require("./users");
const Profile = require("../../models/Profile");
const { route } = require("./users");

router.get("/test",(req,res)=>{
    res.json({msg:"profile works"})
})

//$route POST api/profiles/add
//@desc  創建訊息接口

router.post("/add",passport.authenticate("jwt",{session:false}),(req,res)=>{
    const profileFileds={};
    if(req.body.type) profileFileds.type =req.body.type;
    if(req.body.describe) profileFileds.describe =req.body.describe;
    if(req.body.income) profileFileds.income =req.body.income;
    if(req.body.expend) profileFileds.expend =req.body.expend;
    if(req.body.cash) profileFileds.cash =req.body.cash;
    if(req.body.remark) profileFileds.remark =req.body.remark;

    new Profile(profileFileds).save().then(profile => {
        res.json(profile);
    })
})

//$route  GET api/profiles/:id
//@desc  獲取單筆訊息
router.get("/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{
    Profile.findOne({_id:req.params.id})
    .then((profile)=>{
        if(!profile){
            return res.status(404).json("沒有任何內容");
        }
        res.json(profile)
    })
    .catch(err => res.status(404).json(err));
})

//$route  GET api/profiles
//@desc  獲取所有訊息

router.get("/",passport.authenticate("jwt",{session:false}),(req,res)=>{
    Profile.find()
    .then((profile)=>{
        if(!profile){
            return res.status(404).json("沒有任何內容");
        }
        res.json(profile)
    })
    .catch(err => res.status(404).json(err));
})

//$route  Post api/profiles/edit
//@desc   編輯訊息接口

router.post("/edit/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{
    const profileFileds={};
    if(req.body.type) profileFileds.type =req.body.type;
    if(req.body.describe) profileFileds.describe =req.body.describe;
    if(req.body.income) profileFileds.income =req.body.income;
    if(req.body.expend) profileFileds.expend =req.body.expend;
    if(req.body.cash) profileFileds.cash =req.body.cash;
    if(req.body.remark) profileFileds.remark =req.body.remark;

    Profile.findOneAndUpdate(
        {_id:req.params.id},
        {$set:profileFileds},//更新
        {new:true}
    ).then(profile => res.json(profile))
})


// @route  POST api/profiles/delete/:id
// @desc   删除信息接口
// @access Private
router.delete(
    "/delete/:id",
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      Profile.findOneAndRemove({ _id: req.params.id })
        .then(profile => {
          profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json('删除失败!'));
    }
  );
module.exports= router;