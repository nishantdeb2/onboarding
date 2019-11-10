## Onboarding
Api's for user to onboard to a platform.

## to start server 
NODE_ENV='dev' nodemon app.js 

## Api Documentation

### Login:
  Method: POST
  Parameters: 
    email: <string>
    password: <string>
    device_type: <string>
    device_token: <string>
  endpoint:/login
  
### register
  Method: POST
  Parameters:
    name:<string>
    email:<string>
    password:<string>
    phone_number:<string>
    country_code:<string>
    street:<string>
    pincode:<string>
    device_type:<string>
    device_token:<string>
  endpoint:/register
  
### update_profile
  Method: PUT
  Parameters:
    access_token:<string>
    password:<string>
    phone_number:<string>
    country_code:<string>
    street:<string>
    pincode:<string>
    name:<string>
 endpoint:/update_profile
  
### view_profile
  Method: GET
  Parameters:
     access_token:<string>
     email:<string>
     name:<string>
  endpoint:/view_profile
  
 ### logout
  Method: POST
  Parameters:
    access_token:<string>
   endpoint:/logout
