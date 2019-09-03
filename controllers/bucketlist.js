const express = require('express');
const router = express.Router();
const bucketlist = require('../models/list');
const userInfo = require('../models/userInfo');


router.get('/allLists', (req,res) => {
    bucketlist.getAllLists((err, list)=> {
        if(err) {
            res.json({success:false, message: `Failed to load all lists. Error: ${err}`});
        }
        else {
            res.json({success: true, list:list});
            res.end();
    }
    });
});

router.post('/user/view/:user', userInfo.profileRead, (req,res) => {
    let username = req.params.user;
    bucketlist.getUserList(username,(err, info)=> {
        if(err) {
            res.json({success:false, message: `Failed to load user list. Error: ${err}`});
        }
        else {
            res.json({success: true, info:info});
            res.end();
        }
    });
});

router.post('/user/add/:user', userInfo.profileRead, (req,res,next) => {
    let newList = new bucketlist({
        username: req.body.username,
        title: req.body.title,
        description: req.body.description,
        category: req.body.category
    });
    bucketlist.addList(newList,(err, list) => {
        if(err) {
            res.json({success: false, message: `Failed to create a new list. Error: ${err}`});
        }
        else
            res.json({success:true, message: "Added successfully."});

    });
});

router.post('/user/delete/:id', userInfo.profileRead, (req,res,next)=> {
      let id = req.params.id;
      bucketlist.deleteListById(id,(err,list) => {
          if(err) {
              res.json({success:false, message: `Failed to delete the list. Error: ${err}`});
          }
          else if(list) {
              res.json({success:true, message: "Deleted successfully"});
          }
          else
              res.json({success:false});
      })
  });

module.exports = router;