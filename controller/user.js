const async = require('async');
const JWT = require('jsonwebtoken');
const secret = 'NeverShareYourSecret';
// const jwtDecode = require('jwt-decode');


const Services = require('../service/user.js');
const response = require('../utill/constant')
// Resgister user
register = (req, res, cb) => {
  let body = req.body;

  async.series([
    (cb) => {
      Services.checkemail(body.email, (err, result) => {
        if (err) {
          cb(err)
        }
        else {
          cb(null, true);
        }
      });
    },
    (cb) => {
      Services.checkphone(body.phone_number, (err, result) => {
        if (err) {
          cb(err)
        }
        else {
          cb(null, true);
        }
      });
    },
    (cb) => {
      Services.addUser(body, (err, result) => {
        if (err) {
          cb(err)
        }
        else {
          cb(null, result);
        }
      });
    }


  ],
    (error, result) => {
      if (error) {
        res.send({ status: response.errorMessage.status, message: response.errorMessage.message, data: error });
      }
      else {
        res.send({ status: 200, message: "User registed succesfully", data: { name: result[2].name, email: result[2].email } });

      }
    }
  )
}
// user login 
login = (req, res, cb) => {
  let data = req.body;

  async.series([
    (cb) => {
      Services.checkmailforlogin(data.email, (err, result) => {
        if (err) {
          cb(err)
        }
        else {
          cb(null, true);
        }
      });
    },
    (cb) => {
      Services.checkpass(data, (err, result) => {
        if (err) {
          cb(err);
        }
        else {
          cb(null, result);
        }
      });

    },
    (cb) => {
      Services.set_token(data, (err, result) => {
        if (err) {
          cb(err);
        }
        else {
          cb(null, result);
        }
      });

    }
  ],
    (error, result) => {
      if (error) {
        res.send({ status: response.errorMessage.status, message: response.errorMessage.message, data: error });
      }
      else {
        res.send({ status: 200, message: "Log in succesfully", data: { name: result[1].name, email: result[1].email, access_token: result[2].access_token } });
      }
    }
  )
}
update = (req, res, cb) => {

  let body = req.body;
  let token = ''
  if (req.headers.access_token) {
    token = req.headers.access_token;
  } else {
    res.send({ status: 400, message: "access_token is required" })
  }
  JWT.verify(token, secret, (err, decoded) => {
    if (err) {
      res.send({ status: 400, message: "User unauthorsed to perform action" })
    }
    else {
      async.series([

        (cb) => {
          Services.checkid(decoded.email, (err, result) => {
            if (err) {
              cb(err)
            }
            else {
              cb(null, result);
            }

          })
        },
        (cb) => {
          Services.is_logedin(decoded.email, (err, result) => {
            if (err) {
              cb(err)
            } else {
              cb(nul, result)
            }
          })
        },
        (cb) => {
          Services.update(decoded.email, body, (err, result) => {
            if (err) {
              cb(err)
            }
            else {
              cb(null, result);
            }
          })
        }
      ],
        (error, result) => {
          if (error) {
            res.send({ status: response.errorMessage.status, message: response.errorMessage.message, data: error });
          }
          else {
            res.send({ status: 200, message: "User profile updated", data: result[2] });
          }
        }
      )
    }
  });
}
view_profile = (req, res) => {

  let token = ''
  if (req.headers.access_token) {
    token = req.headers.access_token;
  } else {
    res.send({ status: 400, message: "access_token is required" })
  }
  JWT.verify(token, secret, function (err, decoded) {
    if (err) {
      res.send({ status: 400, message: "User unauthorsed to perform action" })
    }
    else {
      async.series([
        (cb) => {
          Services.is_logedin(decoded.email, (err, result) => {
            if (err) {
              cb(err)
            } else {
              cb(null, result)
            }
          })
        },
        (cb) => {
          Services.view_profile(decoded.email, req.query, (error, result) => {
            if (error) {
              cb(err)
            }
            else {
              cb(null, result)
            }
          })
        }
      ],
        (error, result) => {
          if (error) {
            res.send({ status: response.errorMessage.status, message: response.errorMessage.message, data: error });
          }
          else {
            res.send({ status: 200, message: "Profile detail", data: result[1] });
          }
        }
      )
    }
  });
}
logout = (req, res, cb) => {
  let token = ''
  if (req.headers.access_token) {
    token = req.headers.access_token;
  } else {
    res.send({ status: 400, message: "access_token is required" })
  }
  JWT.verify(token, secret, function (err, decoded) {
    if (err) {
      res.send({ status: 400, message: "User unauthorsed to perform action" })
    }
    else {
      Services.logout(decoded.email, (error, result) => {
        if (error) {
          res.send({ status: response.errorMessage.status, message: response.errorMessage.message, data: error });
        }
        else {
          res.send({ status: 200, message: "User Loged out" });
        }
      });
    }
  });
}
module.exports = {
  register: register,
  update: update,
  login: login,
  view_profile: view_profile,
  logout: logout
}
