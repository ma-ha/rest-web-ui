/*
Auth0 Wrapper for pong-security2 module

The MIT License (MIT)

Copyright (c) 2019 Markus Harms, ma@mh-svr.de

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. 
*/


function mSec_Login( params ) { 
  // https://auth0.com/docs/libraries/auth0js/v9
  var webAuth = new auth0.WebAuth({
    domain   : params.authDomain,
    clientID : params.clientId
  });
  var authParam = {
    responseType : 'token id_token',
    clientID     : params.clientId,
    redirectUri  : params.loginRedirect,
    state        : 234564678909890,   // TODO
    // scope        : 'read:all'
  }
  if ( params.audience ) {
    authParam.audience = params.audience
  }
  webAuth.authorize( authParam );
}

function mSec_isAuthenticated( params, token, callback ) {
  if ( ! token ) { return callback( null ); }
  // init the Auth0 lib
  var webAuth = new auth0.WebAuth({
    domain   : params.authDomain,
    clientID : params.clientId
  });
  // get user profile
  webAuth.client.userInfo( token.idToken, function( err, user ) {
    if ( err ) {
      console.log( err )
      callback( null, err );
    } else {
      callback( user, null )
    }
  });
}

function mSec_getIdTokenfromURL() {
  var idx = window.location.href.indexOf( 'id_token' )
  if (  idx > 0 ) {
    var tokenStr = window.location.href.substring( idx + 9 ) 
    if ( tokenStr.indexOf('&') > 0 ) { 
      tokenStr = tokenStr.substring( 0, tokenStr.indexOf('&') )
    }
    return tokenStr
  } else {
    return false
  }
}

function mSec_getAccessTokenFrmURL() {
  var idx = window.location.href.indexOf( 'access_token' )
  if (  idx > 0 ) {
    var tokenStr = window.location.href.substring( idx + 13 ) 
    if ( tokenStr.indexOf('&') > 0 ) { 
      tokenStr = tokenStr.substring( 0, tokenStr.indexOf('&') )
    }
    return tokenStr
  } else {
    return false
  }
}

function mSec_getUserId( userInfo ) {
  //console.log( userInfo );
  if ( userInfo && userInfo.name ) {
    return userInfo.name;
  } else {
    return '?';
  }
}

function mSec_Logout( params ) { 
  // https://auth0.com/docs/api/authentication#logout
  var loginURL = 'https://'+params.authDomain+'/v2/logout'
    + '?client_id=' + params.clientId
    + '&returnTo=' + params.logoutRedirect
  window.location.href = loginURL
}


function mSec_ChangePassword( params, userEmail ) {
  var webAuth = new auth0.WebAuth({
    domain   : params.authDomain,
    clientID : params.clientId
  });
  webAuth.changePassword({
    email      : userEmail,
    connection : 'Auth0'
  })
  alert( 'Auth0 will send you a link to change your password.\nPlease check your Emails!' )
}
