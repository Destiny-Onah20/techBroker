const userModel = require("../models/user");
const adminModel = require("../models/admin");
const dotenv = require("dotenv");
dotenv.config({path: "../config/cofig.env"});
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mailSender = require("../helpers/email")


exports.signUpUs = async(req,res)=>{
  try {
    const { username,fullname, email, phoneNumber, password, conPass, country, refferals   } = req.body;
    const checkUser = await userModel.findOne({username});
    if(checkUser){
      return res.status(400).json({
        message: `Please this username ${username} has already been used by another user.`
      });
    }else{
      const checkEmail = await userModel.findOne({email});
      if(checkEmail){
        return res.status(400).json({
          message: `Please this email ${email} already exist..`
        });
      }else{
        const re =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        const matcher = email.match(re)
        if(!matcher){
          return res.status(400).json({
            message: "The email format is incorrect, please check."
          })
        }else{
          const saltPass = await bcrypt.genSalt(5);
          const hassPass = await bcrypt.hash(password, saltPass);
          const checkPass = await password.match(conPass);
          if(!checkPass){
            return res.status(400).json({
              message: "The passwords does not match please check."
            })
          }else{
            const reff = await adminModel.findOne({refferals});
            if(!reff){
              return res.status(400).json({
                message: "Invalid refferal code, please check again."
              })
            }else{
              const created = {
                username,
                fullname,
                email,
                phoneNumber,
                password: hassPass,
                conPass: hassPass,
                country,
                refferals
              };
              const newUser = new userModel(created);
              const genToken = jwt.sign({
                username: newUser.username,
                refferals: newUser.refferals
              },process.env.MYSECT,{expiresIn: "1h"});
              newUser.token = genToken;
              newUser.admin = reff;
              await newUser.save();
              reff.adminUser.push(newUser);
              await reff.save();
              const verify = `${req.protocol}://${req.get("host")}/api/verify/${newUser._id}`;
              const message = `welcome cheif ${newUser.username} use this link to verify your account ${verify}`;
              mailSender({
                email: newUser.email,
                subject: "Kindly Verify account",
                message
              })
              res.status(201).json({
                message: "sucessful",
                data: newUser
              })
            }
          }
        }
      }
    }
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  };
};


exports.loginUser = async(req,res)=>{
  try {
    const { email , password } = req.body;
    const checkEmail = await userModel.findOne({email});
    if(!checkEmail){
      return res.status(400).json({
        message: "Email doesn't exists pleaase check.."
      })
    }else{
      const checkPass = await bcrypt.compare(password, checkEmail.password);
      if(!checkPass){
        return res.status(400).json({
          message: "Password incorrect pleaase check.."
        })
      }else{
        const genToken = await jwt.sign({
          username : checkEmail.username,
          refferals: checkEmail.refferals
        },process.env.MYSECT,{expiresIn: "1h"});
        checkEmail.token = genToken;
        await checkEmail.save();
        res.status(200).json({
          message: "Logged in ",
          data: checkEmail
        })
      }
    }

  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
};

exports.verifyUser = async(req,res)=>{
  try {
    const userId = req.params.userId;
    const verifyUserId = await userModel.findById(userId);
    await userModel.findByIdAndUpdate(verifyUserId, {
      verify : true,
    },{
      new : true
    });
    res.status(200).json({
      message: "You are now verified.."
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
};

exports.forgotPassword = async(req,res)=>{
  try {
    const { email } = req.body;
    const checkEmail = await userModel.findOne({email});
    if(!checkEmail){
      return res.status(401).json({
        message: `The Email is not registered or incorrect..`
      })
    }else{
      const changepwd = `${req.protocol}://${req.get("host")}/api/chnagepwd/${checkEmail._id}`;
      const message = `Hello ${checkEmail.username} use this link here to change your password ${changepwd}`;
      mailSender({
        email: checkEmail.email,
        subject: "Change of password.",
        message
      })
    }
    res.status(200).json({
      message: "Please check your email for link"
    })
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
};

exports.changePassword = async(req,res)=>{
  try {
    const userId = req.params.userId;
    const { password , conPass } = req.body;
    const confirmPassword = password.match(conPass);
    if(!confirmPassword){
      return res.status(400).json({
        message: "Password does not match please check."
      })
    }else{
    const saltPassword = await bcrypt.genSalt(10);
    const hassPassword = await bcrypt.hash(password, saltPassword);
    const findUser = await userModel.findById(userId);
    await userModel.findByIdAndUpdate(findUser,{
      password: hassPassword,
      conPass: hassPassword
    },{
      new: true
    });
  }
  res.status(200).json({
    message: "Password successfully changed."
  })
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
};
