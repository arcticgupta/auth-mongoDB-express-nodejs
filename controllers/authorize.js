const express = require('express');
const router = express.Router();
const userList = require('../models/userInfo');
const jwt = require('jsonwebtoken');


router.get('/',(req,res) => {
    userList.getAllUsers((err, infos)=> {
        if(err) {
            res.json({success:false, message: `Failed to load all infos. Error: ${err}`});
        }
        else {
            res.write(JSON.stringify({success: true, infos:infos},null,2));
            res.end();
        }
    });
});

router.post('/register', (req,res,next) => {
    var basicRole="normal"
    let newUser = new userList({
        username: req.body.username,
        password: req.body.password,
        role: basicRole
    });
    userList.addUser(newUser,(err, userInfo) => {
        if(err) {
            res.json({success: false, message: `Failed to create a new user. Error: ${err}`});
        }
        else{
            var token = generateJWT(userInfo, basicRole)
            res.status(200);
            res.json({
              "token" : token
            });
        }
    });
});

router.post('/login', (req,res,next) => {
    userList.getPassword(req.body.username,(err,userInfo) => {
          if(err) {
            res.json({success:false, message: `Failed to get the password. Error: ${err}`});
          }
          else if(userInfo&&userInfo[0].password===req.body.password) {
            var token= generateJWT(userInfo[0], userInfo[0].role)
            res.json({
              "token" : token
            });
          }
          else
            res.json({success: false});
      })
});

router.post('/delete/:id', (req,res,next) => {
    userList.deleteById(req.params.id,(err, userInfo) => {
        if(err) {
            res.json({success: false, message: `Failed to delete the user. Error: ${err}`});
        }
        else res.json({success: true, message: `User Deleted`});
    });
});

function generateJWT(userInfo, role){
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    var token = jwt.sign({
        _id: userInfo._id,
        username: userInfo.username,
        role: role,
        exp: parseInt(expiry.getTime() / 1000),
      }, "MY_SECRET");
    return token; 
}

module.exports = router;