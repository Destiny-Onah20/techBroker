const adminModel = require("../models/admin");
const dotenv = require("dotenv");
dotenv.config({path: "../config/cofig.env"});
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const refferalCode = require("referral-codes")


exports.signUpAd = async(req,res)=>{
  try {
    const { username, password } = req.body;
    const checkUser = await adminModel.findOne({username});
    if(checkUser){
      return res.status(400).json({
        message: `this username ${username} has already been used sorry.`
      })
    }else{
      const saltPass = await bcrypt.genSalt(10);
      const hassPass = await bcrypt.hash(password, saltPass);
      const created = {
        username,
        password: hassPass
      };
      const createAd = new adminModel(created);
      const referralGen = refferalCode.generate({
        length: 8,
        charset: refferalCode.charset("alphanumeric")
      });
      const realCode = referralGen.toString();
      let upperCode = realCode.toUpperCase()
      createAd.refferals = upperCode;
      const genToken = await jwt.sign({
        username : createAd.username,
        refferals: createAd.refferals
      },process.env.MYSECT,{expiresIn: "1h"});
      createAd.token = genToken;
      await createAd.save();
      return res.status(201).json({
        message: 'Successful',
        data: createAd
      })
    }
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  };
};

exports.loginAd = async(req,res)=>{
  try {
    const { username, password} = req.body;
    const checkUser = await adminModel.findOne({username});
    if(!checkUser){
      return res.status(400).json({
        message: "Username doesn't exists pleaase check.."
      })
    }else{
      const checkPass = await bcrypt.compare(password, checkUser.password);
      if(!checkPass){
        return res.status(400).json({
          message: "Password incorrect pleaase check.."
        })
      }else{
        const genToken = await jwt.sign({
          username : checkUser.username,
          refferals: checkUser.refferals
        },process.env.MYSECT,{expiresIn: "1h"});
        checkUser.token = genToken;
        await checkUser.save();
        res.status(200).json({
          message: "Logged in ",
          data: checkUser
        })
      }
    };
    
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
};

exports.oneAdmin = async(req,res)=>{
  try {
    const userId = req.params.userId;
    const theAdmin = await adminModel.findById(userId).populate("adminUser");
    res.status(200).json({
      AllUsers: theAdmin.adminUser.length,
      data: theAdmin
    })
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}