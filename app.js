const express = require('express');
const createError = require('http-errors');
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
app.use(bodyParser.urlencoded({extended:true})); //defines if nested queries can be parsed
app.use(bodyParser.json());
app.use('/bucketlist',bucketlist);
app.use("/auth",authorize)
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req,res) => {
    res.send("Empty Endpoint");
})

app.use(function(req, res, next) {// catcher
    next(createError(404));
  });

app.use(function(err, req, res, next) {// handler
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {}; //only works in development
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
      });
  });

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
};
mongoose.connect(config.database/*, options*/, function(error) {
    // Check error in initial connection. There is no 2nd param to the callback.
});

app.listen(port, () => {
    console.log(`Starting the server at port ${port}`);
});

