const mongoose = require('mongoose');

const BucketlistSchema = mongoose.Schema({
    username: String,
    title: {
        type: String,
        required: true
    },
    description: String,
    category: {
        type: String,
        required: true,
        enum: ['High', 'Medium', 'Low']
    }
});

const BucketList = module.exports = mongoose.model('BucketList', BucketlistSchema );

module.exports.getAllLists = (callback) => {
    BucketList.find(callback);
}

module.exports.getUserList = (username, callback) => {
    let query = {username: username};
    BucketList.find(query, callback);
}

module.exports.addList = (newList, callback) => {
    newList.save(callback);
}

module.exports.deleteListById = (id, callback) => {
    let query = {_id: id};
    BucketList.remove(query, callback);
}

