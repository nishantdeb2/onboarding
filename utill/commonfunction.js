const {mongoose} = require('../db/mongoose');
const User=require('../model/User');

 let  user_save_data= async ( objToSave)=> {
    return new User(objToSave).save();
  }
  let  user_update_data= async ( condition,updatevalue)=> {
    return User.updateOne(condition,updatevalue);
  }
  let  user_get_data = async (criteria,projection)=> {
    return User.find(criteria, projection);
  }


module.exports = {
    user_save_data:user_save_data,
    user_update_data:user_update_data,
    user_get_data:user_get_data
    
}