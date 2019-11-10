
const md5 = require('md5');
const JWT = require('jsonwebtoken');
const secret = 'NeverShareYourSecret';
const common_function = require('../utill/commonfunction')

module.exports = {
  // check mail for signup
  checkemail: async (email, cb) => {
    console.log("check mail for signup");
    try {
      let user = await common_function.user_get_data({ email: email }, {});
      if (user && user.length) {
        cb("Email id already exist");
      }
      else {
        cb(null, true);
      }

    } catch (err) {
      cb(err);
    }


  },
  //check phone for signup
  checkphone: async (phone, cb) => {
    console.log("check phone for signup");
    try {
      let user = await common_function.user_get_data({ phone_number: phone }, {});
      if (user && user.length) {
        cb("Phone number already associated with other account");
      }
      else {
        cb(null, true);
      }

    } catch (err) {
      cb(err);
    }


  },
  // add user after validation of unique mail and phone 
  addUser: async (body, cb) => {
    console.log("Add user to db for signup");

    let userData = {
      name: body.name,
      email: body.email,
      password: md5(body.password),
      auth: body.auth,
      phone_number: body.phone_number,
      country_code: body.country_code,
      address: {
        street: body.street,
        pincode: body.pincode
      },
      user_id: body.name,
      device_type: body.device_type,
      device_token: body.device_token,
    };
    try {
      let user = await common_function.user_save_data(userData);
      cb(null, user);

    } catch (err) {
      cb(err);
    }

  },
  // check mail id for user existance
  checkmailforlogin: async (email, cb) => {
    console.log("check mail for login");
    try {
      let user = await common_function.user_get_data({ email: email }, {});
      if (user && user.length) {
        cb(null, true);
      }
      else {
        cb("User not registered");
      }

    } catch (err) {
      cb(err);
    }

  },
  // check user password and update accesstoken 
  checkpass: async (data, cb) => {
    console.log("check password")
    let pass = md5(data.password);
    let mail = data.email;
    try {
      let user = await common_function.user_get_data({ email: mail }, {});
      if (pass === user[0].password) {
        data = {
          email: mail,
          name: user[0].name
        }
        cb(null, data);
      }
      else {
        cb("Incorrect password");
      }

    } catch (err) {
      cb(err);
    }

  },
  //to set acces_stoken after login
  set_token: async (data, cb) => {
    let mail = data.email;
    try {
     
        const token = JWT.sign({email: data.email }, secret);
        await common_function.user_update_data({ email: mail }, { last_login: new Date(), access_token: token, is_access_token_valid: 1, is_logedin: 1, device_type: data.device_type, device_token: data.device_token });
        data = {
          access_token: token
        }
        cb(null, data);
      

    } catch (err) {
      cb(err);
    }

  },
  // check id to update 
  checkid: async (email, cb) => {
    try {
      // const decoded = jwtDecode(token);
      let user = await common_function.user_get_data({ email: email }, {});
      if (user && user.length) {
        cb(null, true);
      }
      else {
        cb("User not registered");
      }
    } catch (err) {
      cb(err);
    }
  },
  // update data of id checked
  update: async (email, data, cb) => {
    try {
      let to_update = {}
      if (data.country_code && !data.phone_number) {
        cb("Phone number is reqired with country code")
      }
      if (data.name) {
        to_update.name = data.name
      }
      if (data.phone_number) {
        if (!data.country_code) {
          cb("Country code is required with phone number")
        }
        let user = await common_function.user_get_data({ phone_number: data.phone_number }, {});
        if (user && user.length) {
          cb("Phone number already associated with other account");
        } else {
          to_update.phone_number = data.phone_number
          to_update.country_code = data.country_code
        }

      }
      if (data.password) {
        data.password = md5(data.password);
        to_update.password = data.password
      }
      if (data.street) {
        to_update.address.street = data.street
      }
      if (data.pincode) {
        to_update.address.pincode = data.pincode
      }

      await common_function.user_update_data({ email: email }, to_update);
      cb(null, to_update)

    } catch (err) {
      cb(err)
    }
  },

  view_profile: async (email, body, cb) => {
    let queryObj = {}
    if (body.email) {
      queryObj.email = body.email
    } else if (body.name) {
      queryObj.name = body.name
    } else {
      queryObj.email = email
    }
    try {
      let used = await common_function.user_get_data(queryObj, { _id: 0, name: 1, email: 1, address: 1, phone_number: 1, country_code: 1, last_login: 1 })
      cb(null, used)
    } catch (err) {
      cb(err)
    }
  },
  is_logedin: async (email,cb) => {
    try {
      let user = await common_function.user_get_data({ email: email }, { is_logedin: 1, _id: 0, is_access_token_valid: 1 });
      if (user[0].is_logedin && user[0].is_access_token_valid) {
        cb(null, user)
      }
      else {
        cb("user loged out. Login again to perform action")
      }
    } catch (err) {
      cb(err)
    }
  },
  logout: async (email, cb) => {
    try {
      let to_update={
        is_logedin:0,
        is_access_token_valid:0
      }
      let used = await common_function.user_update_data({ email: email }, to_update);

      cb(null, "User loged out")
    } catch (err) {
      cb(err)
    }
  },
}
