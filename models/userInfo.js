//Require mongoose package
const mongoose = require('mongoose');
var jwt = require('jwt-simple');

//Define BucketlistSchema with title, description and category
const UserInfoSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: String,
    role: String
});

const UserInfos = module.exports = mongoose.model('UserInfos', UserInfoSchema );

//BucketList.find() returns all the lists
module.exports.getAllUsers = (callback) => {
    UserInfos.find({ role: "normal" },callback);
}

module.exports.getPassword = (username, callback) => {
    let query = {username: username};
    UserInfos.find(query, callback);
}

module.exports.getExpiry = (id, callback) => {
    let query = {_id: id};
    UserInfos.find(query, callback);
}

//newList.save is used to insert the document into MongoDB
module.exports.addUser = (newUser, callback) => {
    newUser.save(callback);
}

//Here we need to pass an id parameter to BUcketList.remove
module.exports.deleteById = (id, callback) => {
    let query = {_id: id};
    UserInfos.remove(query, callback);
}

module.exports.profileRead = function(req, res,next) {
    if (req.body.token) {
        var decoded = jwt.decode(req.body.token,"MY_SECRET");
        let query = {_id: decoded._id};
        module.exports.getExpiry(decoded._id,(err,user) => {
            if(err) {
                res.status(401).json({success:false, message: `Token not processed`});
            }
            else{
                var exp= decoded.exp;
                var cur= new Date();
                if (exp>cur.getTime()/1000){
                    next()
                }else {
                    if (decoded.username==="superAdmin") next()
                    res.status(401).json({success:false, message:"Timed Out"});
                }
            }
        })
    } else{
        res.status(401).json({success:false, message: `Unauthorized`});
    }
  };



//If you’re wondering about the lack of an id field, it’s because we’ll be using the default _id that will be created by Mongoose.