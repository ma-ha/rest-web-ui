/*
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
log( "PoNG-Security", "Loading Module");

const COOKIE = 'pongSec2Tkn';
var pongSec2Params  = null; 

function initSec2SecurityHeaderHtml( divId, type, params ) {
  pongSec2Params  = params;
  sec2ChkCookie();
  // load external libs, if requried
  if ( pongSec2Params.requireJS  && pongSec2Params.requireJS instanceof Array) {
    for ( var i = 0; i < pongSec2Params.requireJS.length; i++ ) {
      ajaxOngoing++;
      $.getScript( pongSec2Params.requireJS[ i ] )
        .done( function( script, textStatus ) { ajaxOngoing--; } )
        .fail( function( jqxhr, settings, exception ) { ajaxOngoing--; } );
    }
  }
  // load the implementation module
  ajaxOngoing++;
    $.getScript( pongSec2Params.moduleJS )
      .done( function( script, textStatus ) { ajaxOngoing--; } )
      .fail( function( jqxhr, settings, exception ) { ajaxOngoing--; } );
}


function addSec2SecurityHeaderHtml( divId, type , params ) {
  log( "PoNG-Security", "start addSecurityHeaderHtml "+divId);
  if ( ! params ) { return }
  var divHtml = [];
  if ( mSec_isAuthenticated ) {
    var accessToken = sec2GetToken(); 
    mSec_isAuthenticated( params, accessToken, (user) => {
      //console.log( user )
      divHtml.push( '<div id="SecurityHeader">' );
      if ( user ) {
        sec2handleSession( user );
        // Show User Id an pull down with logout, change password etc.
        divHtml.push( '<form id="SecurityHeaderFrom" action="index.html">' );
        divHtml.push( '<div id="SecurityHeaderUser">'+$.i18n('User')+':&nbsp;' );
        divHtml.push( '<span class="user-id" style="display:inline-flex">'+ mSec_getUserId( user ) +'&nbsp;' );
        divHtml.push( '<span id="SecurityHeaderTriangle" class="ui-icon ui-icon-triangle-1-s"></span></span></div>' );
        divHtml.push( '<div id="SecurityHeaderPullDown">' );
        if ( getParam('layout') != null && getParam('layout') != '' ) {
          divHtml.push( '<input type="hidden" name="layout" value="'+getParam('layout')+'"/>' );      
        }
        var lang = "";
        if ( getParam('lang')  && getParam('lang') != '' ) {
          divHtml.push( '<input type="hidden" name="lang" value="'+getParam('lang')+'"/>' );
          lang = "?lang="+getParam('lang');
        }
        divHtml.push( '</form>' );
        // logout 
        divHtml.push( '<span class="SecurityHeaderPullDownItem"><a href="logout.htm" class="PongLogout">'+$.i18n('Logout')+'</a></span>' );
        // change password
        if ( params.changePasswordURL != null  ) {
          divHtml.push( '<span class="SecurityHeaderPullDownItem"><a href="changePassword.htm" class="PongChPwd">'+$.i18n('Change Password')+'</a></span>' );
        }
        // other user related links, e.g. profile or notification settings
        if ( params.userPages ) {
          divHtml.push( '<hr/>' );
          for ( label in params.userPages ) {
            divHtml.push( '<span class="SecurityHeaderPullDownItem">'
              + '<a href="index.html?layout=' + params.userPages[ label ]
              + '" class="PongUserPage">'+$.i18n(label)+'</a></span>' );        
          }
        }
        // divHtml.push( '<span class="SecurityHeaderPullDownItem">'
        // + '<a href="https://' + params.authDomain + '/#/account">'+$.i18n('Auth0 Account')+'</a></span>' );   

        divHtml.push( '<script>' );
        divHtml.push( '$( function() {' );
        divHtml.push( '  $( "#SecurityHeaderUser" ).click( function() { ' );
        divHtml.push( '    setTimeout( function(){ $( "#SecurityHeaderPullDown" ).hide( "blind" ); }, 5000 );' );
        divHtml.push( '    $( "#SecurityHeaderPullDown" ).toggle( "blind" ); } ); ' );
        divHtml.push( '  $( "#SecurityHeaderPullDown" ).hide(); ');
        divHtml.push( '  $( ".PongChPwd" ).click(  function() { sec2ChangePassword("'+user.email+'"); return false; } );' );
        divHtml.push( '  $( ".PongLogout" ).click( function() { sec2Logout(); return false; } );' );
        divHtml.push( '});' );
        divHtml.push( '</script>' );
    
        divHtml.push( '</div>' );

        // Check, if session has expired
        var checkLoginInterval = 60*1000;
        if ( params.checkLoginInterval  ) {
          var n = Number.parseInt( params.checkLoginInterval );
          if ( ! isNaN( n ) ) {
            checkLoginInterval = params.checkLoginInterval;
          }
        }
        setInterval( sec2checkLogout, checkLoginInterval );

      } else { // unauthenticated
        for ( var param in params ) {
          if ( param == 'authDomain') {
            divHtml.push( '<div id="SecLogin">' );
            divHtml.push( '<button id="PongSecLoginBtn" class="PongSecBtn" onclick="sec2Login()">'+$.i18n('Login')+'</button>' );
            divHtml.push( '</div>' );
          }
          if ( param == 'registgerURL') {
            divHtml.push( '<div id="SecRegistgerURL">' );
            divHtml.push( '<a class="PongRegister" href="'+ params.registgerURL+'">'+$.i18n('Sign up')+'</a>' );
            divHtml.push( '</div>' );
            divHtml.push( '<script>' );
            divHtml.push( '$( function() {' );
            divHtml.push( '  $( ".PongRegister" ).click( function() { sec2Login(); return false; } );' );
            divHtml.push( '});' );
            divHtml.push( '</script>' );
          }
          if ( param == 'resetPasswordURL') {
            divHtml.push( '<div id="SecResetPwdURL">' );
            divHtml.push( '<a class="PongResetPwd" href="'+ params.resetPasswordURL+'">' +$.i18n('Forgot Password')+'</a>' );
            divHtml.push( '</div>' );
            divHtml.push( '<script>' );
            divHtml.push( '$( function() {' );
            divHtml.push( '  $( ".PongResetPwd" ).click( function() { sec2Login(); return false; } );' );
            divHtml.push( '});' );
            divHtml.push( '</script>' );
        
              }
        }
      }
      divHtml.push( '<div id="SecurityChangePasswordDiv"></div>' );
      divHtml.push( '</div>' );
      $( "#"+divId ).html( divHtml.join( "\n" ) );
    })
  } else {
    divHtml.push( '<div id="SecurityHeader">' );
    divHtml.push( 'Sec module missing</div>' );
    $( "#"+divId ).html( divHtml.join( "\n" ) );
  }
}


// functions link to specific implementation

function sec2Login() {
  mSec_Login( pongSec2Params );
}

function sec2ChangePassword( userEmail ) {
  mSec_ChangePassword( pongSec2Params, userEmail );
}

function sec2Logout() {
  sec2writeCookie( COOKIE, '', -1 );
  mSec_Logout( pongSec2Params );
}

function sec2checkLogout() {
  if ( mSec_isAuthenticated ) {
    var accessToken = sec2GetToken(); 
    mSec_isAuthenticated( pongSec2Params, accessToken, (user, err) => { 
      //console.log( err )
      if ( ! user && err && err.tatusText == 'Unauthorized' ) { // login expired 
        sec2writeCookie( COOKIE, '', -1 );
        delete headers.Authorization;
        var lang = '';
        if ( getParam('lang') && getParam('lang') != '' ) {
          lang = "?lang=" + getParam('lang');
        }
        window.location.href = 'index.html' + lang; 
      } else {
       //console.log( 'still logged in' )
      }
    })
  }
}

/*
exampleErr = {
  "original": {
    "original": null,
    "response": {
      "req": {
        "method": "GET",
        "url": "https://dev-ie96lzx0.eu.auth0.com/userinfo", 
        "headers": {
           "content-type": "application/json", 
           "auth0-client": "eyJuYW1lIjoiYXV0aDAuanMiLCJ2ZXJzaW9uIjoiOS4xMS4zIn0=", 
           "authorization": "Bearer LWUuUL9Bawc4ZBX_UCNTFY2fjCAvsOJo" }
      }, 
      "xhr": {}, 
      "text": "Unauthorized",
       "statusText": "Unauthorized", 
       "statusCode": 401, "status": 401, 
       "statusType": 4, "info": false, "ok": false, 
       "redirect": false, "clientError": true, 
       "serverError": false, 
       "error": { 
         "status": 401, "method": "GET", 
         "url": "https://dev-ie96lzx0.eu.auth0.com/userinfo" }, 
         "created": false, "accepted": false,
         "noContent": false, 
         "badRequest": false, 
         "unauthorized": true, 
         "notAcceptable": false, "forbidden": false, 
         "notFound": false, "unprocessableEntity": false, 
         "headers": { 
           "cache-control": "private, no-store, no-cache, must-revalidate, post-check=0, pre-check=0, no-transform", "content-type": null }, 
           "header": { "cache-control": "private, no-store, no-cache, must-revalidate, post-check=0, pre-check=0, no-transform", "content-type": null }, "type": "", "links": {}, "body": null
    }, 
    "status": 401
  }, 
  "statusCode": 401, 
  "statusText": "Unauthorized", 
  "code": 401, 
  "description": null, 
  "name": "Error"
}
*/

// ============================================================================

function sec2handleSession( user ) {
  // check for old login
  if ( mSec_getUserId( user ) == '?' ) {
    sec2Logout(); // hard terminate this login
  }
}

var sec2token = null;
function sec2ChkCookie() {
  // ... ok, check if we have already an access_token
  var tokenFrmCookie = sec2readCookie( COOKIE );
  if ( tokenFrmCookie ) {
    headers['Authorization'] = "Bearer " + tokenFrmCookie; 
    $.ajaxSetup({ headers: headers });
    sec2token = tokenFrmCookie;
  }
}

function sec2GetToken() {
  // check if we have an access_token in the URL
  if ( sec2token ) {
    return sec2token;
  } else if ( mSec_getAccessTokenFrmURL ) {
    var access_token = mSec_getAccessTokenFrmURL();
    if ( access_token !== false ) {
      sec2writeCookie( COOKIE, access_token, 2 );
      headers['Authorization'] = "Bearer " + access_token; 
      $.ajaxSetup({ headers: headers });
      sec2token = access_token;
      return access_token
    }
  }
  return null;
}

// ----------------------------------------------------------------------------
// helper
function sec2writeCookie( name, value, expireHrs ) {
  var expires = "";
  if ( expireHrs ) {
    var date = new Date();
    date.setTime( date.getTime() + ( expireHrs *60*60*1000 ) );
    expires = "; expires=" + date.toGMTString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

function sec2readCookie( name ) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for ( var i = 0; i < ca.length; i++ ) {
    var c = ca[i];
    //console.log( 'Cookie '+c )
    while ( c.charAt(0) == ' ' ) {
      c = c.substring( 1, c.length );
    }
    if ( c.indexOf( nameEQ ) == 0 ) {
      return c.substring( nameEQ.length, c.length );
    }
  }
  return null;
}