//Require mongoose package
const mongoose = require('mongoose');

//Define BucketlistSchema with title, description and category
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

//BucketList.find() returns all the lists
module.exports.getAllLists = (callback) => {
    BucketList.find(callback);
}

module.exports.getUserList = (username, callback) => {
    let query = {username: username};
    BucketList.find(query, callback);
}

//newList.save is used to insert the document into MongoDB
module.exports.addList = (newList, callback) => {
    newList.save(callback);
}

//Here we need to pass an id parameter to BUcketList.remove
module.exports.deleteListById = (id, callback) => {
    let query = {_id: id};
    BucketList.remove(query, callback);
}



//If you’re wondering about the lack of an id field, it’s because we’ll be using the default _id that will be created by Mongoose.