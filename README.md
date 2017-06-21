# node-oauth
a simple node.js app using fanapium oauth implemented with express.js and passport.js

About SSO
----------
In this sample app authorization code flow is implemented, first you redirect to _/oauth2/authorize_ endpoint with parameters like table below to input their username and password:
 
Request | Response (redirect)
------- | --------
https://auth2server.com/oauth2/authorize | https://example.com/oauth/callback
?client_id=$CLIENT_ID | ?code=$AUTHORIZATION_CODE
&response_type=code |  &state=$STATE
&redirect_uri=$CLIENT_REDIRECT_URI |

For prompting sign up form just add prompt=signup parameter to the above request.                               
Then you must use the returned code to request token, this time you send a request to _/oauth2/token_ endpoint like table below:

Request | Response
------- | --------
POST https://auth2server.com/oauth2/token | {
  ?grant_type=authorization_code | "access_token": "$ACCESS_TOKEN",
  &code=$AUTH_CODE | "token_type": "Bearer",
  &redirect_uri=$REDIRECT_URI | "expires_in": 3600,
  &client_id=$CLIENT_ID | "scope": "profile email",
  &client_secret=$CLIENT_SECRET |  "refresh_token": "$REFRESH_TOKEN",
  &nbsp;| "id_token": "$JWT_TOKEN"
   &nbsp;| }
   
You can use the retrieved token to access user information by sending GET request to the _/user_ endpoint: 

```http
https://auth2server.com/user
```
the token must be sent using header like this:

Key | Value
--- | -----
Authorization | Bearer _THE_TOKEN_STRING_

for study more about Oauth2 concept see the link below:
https://aaronparecki.com/oauth-2-simplified/ 


How to use this project
-----------------------

This project is built using node, and authentication is handled by passport.js on top of express.js microframework. After cloning or downloading this project you must run `npm start` in the main directory of it then you have to edit `config.js` and insert real values in right place:

```javascript
    module.exports = {
    sso:'__http://SERVICE.ENDPOINT/oauth__',
    sso_service:'__http://SERVICE.ENDPOINT/_',
    client_id:'__CLIENT_ID__"',
    client_secret:'__CLIENT_SECRET__',
    home:'http://WHERE_THIS_CODE_DEPLOYED/',

};
```