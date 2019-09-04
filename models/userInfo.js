const mongoose = require('mongoose');
var jwt = require('jwt-simple');

const UserInfoSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: String,
    role: String
});

const UserInfos = module.exports = mongoose.model('UserInfos', UserInfoSchema );

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

module.exports.addUser = (newUser, callback) => {
    newUser.save(callback);
}

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
                var superUser = "donald";
                var exp= decoded.exp;
                var cur= new Date();
                if (exp>cur.getTime()/1000){
                    if (req.params.user===decoded.username) next()
                    else if (decoded.username===superUser) next()
                    else res.status(401).json({success:false, message:"User not Authorized"}); 
                }
                else {
                    res.status(401).json({success:false, message:"Timed Out"});
                }
            }
        })
    } else{
        res.status(401).json({success:false, message: `User could not be authenticated`});
    }
  };
