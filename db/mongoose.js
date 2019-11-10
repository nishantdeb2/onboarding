
const mongoose = require('mongoose');
const dbConfig = require('config')
mongoose.Promise= global.Promise;
const credential = dbConfig.Mongo;
const url =  `mongodb://${credential.user ? credential.user + ':' + credential.password + '@': ''}${credential.host}:${credential.port || 27017}/${credential.db}`;
// const url ="mongodb://localhost:27017/assignment"; // for my local testing
    mongoose.connect(url);
    console.log("Connected to mongo db")
    
    
 

 module.exports = {
  mongoose
 }
