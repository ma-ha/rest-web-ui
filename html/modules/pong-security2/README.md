# Module "pong-security2" (preview)
This module generates a Login Button, which redirects to a login page (openID connect). 

A JS example for Auht0 as provider with some functions is provided.

## Usage:

  {
    "layout": {
      ...
        "header": {
          ...
          "modules" : [ 
             { "id": "Sec", "type": "pong-security2", 
               "param": { 
                  "requireJS": [ 
                    "https://cdn.auth0.com/js/auth0/9.11/auth0.min.js",
                    "https://cdn.auth0.com/js/change-password-1.5.1.min.js" 
                  ],
                  "moduleJS": "svc/test/sec2/sec2auth0.js",
                  "authDomain": "dev-ie96lzx0.eu.auth0.com",
                  "checkLoginInterval": "10000",
                  "loginRedirect": "http://localhost/mh/ws/rest-web-ui/html/index.html?layout=tests/sec2&",
                  "logoutRedirect": "http://localhost/mh/ws/rest-web-ui/html/index.html?layout=tests/sec2&",
                  
                  "resetPasswordURL": "svc/mock/sec/password",
                  "changePasswordURL": "svc/mock/sec/password",
                  "registgerURL": "index.php?layout=tests/sec/register",
                  
                  "domain": "dev-ie96lzx0.eu.auth0.com",
                  "clientId": "kG40JK0KKb9YXWyjnio1Djh1hPaJ6FAa",
                  
                  "userPages": {
                    "User Profile": "https://dev-ie96lzx0.eu.auth0.com/user"
                  }
               } 
            },
            ...
          ] 
        },
        ...
    }
  }

Parameter:
* `requireJS`: Array of external JS to load (URLs)
* `moduleJS`: URL of the security implementation module, needs to implement:
  * `mSec_Login( params )` perform a login redirect
  * `mSec_isAuthenticated( params, callback )` will `callback(user)` or `callbacl(null)`
  * `mSec_getAccessToken()` return token
  * `mSec_getUserId( userInfo )` return user name or ?
  * `mSec_Logout( params )` perform a logout redirect
  * `mSec_ChangePassword( params )` show a change password dialog
* `authDomain`: 
* `checkLoginInterval`: milliseconds to check if sessio has not been expired
* `loginRedirect`: page to show after login
* `changePasswordURL`: param is optional to show the _Change Password_ link
* `resetPasswordURL`: param is optional to show the _Reset_ link
* `registgerURL` param is optional to show the _Register_ link.
* `loginType` param is optional for Auth0: The name of a social identity provider 
  configured to your application, for example `google-oauth2` or `facebook`. 

You can implement your own `moduleJS`, 
however there is an [example JS for Auth0](../../svc/test/sec2/sec2auth0.js) 