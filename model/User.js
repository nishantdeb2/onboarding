
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema= new Schema({
  street: { type: String, default: null },
  pincode: { type: String, default: null },
},{ _id: false });
const UserSchema = new Schema({
    name:{ type: String },
    email:{ type: String },
    phone_number:{ type: String },
    country_code:{ type: String },
    address:{type:[addressSchema]},
    last_login:{type:Date,default:null},
    is_logedin:{ type: Number, default: 0},
    is_active :{ type: Number, default: 1},
    access_token:{ type: String ,default:null},
    password:{ type: String },
    user_id:{ type: String },
    device_type:{ type: String },
    device_token:{ type: String },
    is_deleted:{ type: Number, default: 0},
    is_access_token_valid:{ type: Number, default: 0},
 
},{ timestamps: { createdAt: 'created_at' ,
updatedAt:'updated_at'} });
UserSchema.pre('update', function() {
  const update = this.getUpdate();
  if (update.__v != null) {
    delete update.__v;
  }
  const keys = ['$set', '$setOnInsert'];
  for (const key of keys) {
    if (update[key] != null && update[key].__v != null) {
      delete update[key].__v;
      if (Object.keys(update[key]).length === 0) {
        delete update[key];
      }
    }
  }
  update.$inc = update.$inc || {};
  update.$inc.__v = 1;
});


module.exports =  mongoose.model('User', UserSchema)