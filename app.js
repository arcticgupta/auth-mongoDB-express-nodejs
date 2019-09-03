const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/database');

const bucketlist = require('./controllers/bucketlist');
const authorize = require('./controllers/authorize');


const app = express();

const port = 3000;


app.use(cors());

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use('/bucketlist',bucketlist);
app.use("/auth",authorize)

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req,res) => {
    res.send("Empty Endpoint");
})

mongoose.connect(config.database);

app.listen(port, () => {
    console.log(`Starting the server at port ${port}`);
});

