const joi = require('joi');
module.exports={
  validatebody:(schemas)=>{
    return(req,res,next)=>{
    const result=joi.validate(req.body,schemas);
    if(result.error)
    {
      return res.status(400).json(result.error);
    }
    if(!req.value)
    {
      req.value={};
    }
    req.value ['body']=result.value;
    next();
  }
  },

schemas:{
  authschema:joi.object().keys({
    name:joi.string().required(),
    email:joi.string().email().required(),
    password:joi.string().required(),
    phone_number:joi.string().min(10).max(10).required(),
    country_code:joi.string().required(),
    street:joi.string().required(),
    pincode:joi.string().required(),
    device_type:joi.string().required().valid('ios', 'android','web'),
    device_token:joi.string().required(),
    
  }),
  loginschema:joi.object().keys({
    email:joi.string().email().required(),
    password:joi.string().required(),
    device_type:joi.string().required().valid('ios', 'android','web'),
    device_token:joi.string().required(),
  }),
  updateschema:joi.object().keys({
    password:joi.string(),
    phone_number:joi.string().min(10).max(10),
    country_code:joi.string(),
    street:joi.string(),
    pincode:joi.string(),
    name:joi.string()
  }),
  
}
}
