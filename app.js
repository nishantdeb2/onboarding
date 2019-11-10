const express = require('express');
const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server, { wsEngine: 'ws' });
const config = require('config')
const bodyparser = require('body-parser');
const common_function = require('./utill/commonfunction')

const  controller = require('./controller/user.js');
app.use(bodyparser.urlencoded({extended:true}));
const {validatebody,schemas} =require('./route/user.js')
const port=config.PORT;

io.on('connection', async function  (socket) {
  let array =[]
  
  socket.on('active_user', (data) => {// listner for active user
    array.push(data)
  });
  socket.emit('active_users',array);// emits array of active user
});

app.post('/register',validatebody(schemas.authschema),controller.register); //register user to sytem 
app.post('/login',validatebody(schemas.loginschema),controller.login); // loging using user_id/phone_number/email_id and password
app.put('/update_profile',validatebody(schemas.updateschema),controller.update); // input access_token  and fileds to be updated 
app.get('/view_profile',controller.view_profile); // if email/name sent then profile of that user else self profile 
app.post('/logout',controller.logout) // logout using accesstoken and user_id 
server.listen(port,(err)=>{
  if(err) {
    console.log('Failed to start server');
  }
  console.log("Server started on port :-",port);
});