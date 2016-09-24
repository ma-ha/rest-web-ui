/*
The MIT License (MIT)

Copyright (c) 2014 Markus Harms, ma@mh-svr.de

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


function initSecurityHeaderHtml( divId, type , params ) {
	if ( userID == null ) {
		if ( params != null  && params.loginURL != null ) {
//      if ( params != null  && params.loginURL != null && params.rolesURL != null ) {
			ajaxOngoing++;
			$.post( params.loginURL, 
				function ( data ) {
					if ( data != "Unauthorized" ) {
						publishEvent( 'feedback', { text:'Login OK :-)' } )
						userID = data;	
						ajaxOngoing--;
//						$.post( params.rolesURL, 
//							function ( roles ) {
//						    publishEvent( 'feedback', { text:'Autorization roles loaded!' } )
//								pageInfo["userRoles"] = [];
//								for ( var i = 0; i < roles.length; i++ ) {
//									//console.log( roles[i] );
//									pageInfo["userRoles"].push( roles[i] );
//								}
//								ajaxOngoing--;
//							}
//						);
//						if ( getParam('role') != null  && getParam('role') != '' ) {
//							userRole = getParam('role'); 
//						}
					} else {
						log( "PoNG-Security", "Unauthorized...");
						ajaxOngoing--;
						publishEvent( 'feedback', { text:'Login failed!!' } );
						userRole = null;
					} 
				} 
			).fail( function() { ajaxOngoing--; } );
		}
	}
}

function addSecurityHeaderHtml( divId, type , params ) {
	log( "PoNG-Security", "start addSecurityHeaderHtml "+divId);
	
	var divHtml = [];
	
	divHtml.push( '<div id="SecurityHeader">' );
	//alert( userID );
	if ( userID == null ) {
		if ( params != null  ) {
			var makeLoginForm = false;
			if ( params.registgerURL != null && params.loginURL != null  ) {
				divHtml.push( '<a href="'+ params.registgerURL+'">'+ $.i18n('Register') + '</a>&nbsp;&nbsp;<a class="PongLogin" href="'+ params.loginURL+'">' +$.i18n('Login')+'</a>' );
				makeLoginForm = true;
			} else if ( params.loginURL != null ) {
				divHtml.push( '<a class="PongLogin" href="'+ params.loginURL+'">' +$.i18n('Login')+'</a>' );		
				makeLoginForm = true;
			}
			var lang = "";
			if ( getParam('lang') && getParam('lang') != '' ) {
				lang = "lang="+getParam('lang');
			}
			//alert( lang );
			
			if ( makeLoginForm ) {
				var cssClass = 'class="text ui-widget-content ui-corner-all"';
 				divHtml.push( '<div id="pongLoginDialog">' );
				divHtml.push( ' <form id="pongLoginDialogForm" action="'+params.loginURL+'" method="post"><fieldset>' );
				divHtml.push( '  <label for="userid">'+$.i18n('User ID')+'</label><br/>' );
				divHtml.push( '  <input id="useridInput" name="userid" type="text" class="'+cssClass+'/><br/>' );
				divHtml.push( '  <label for="password">'+$.i18n('Password')+'</label><br/>' );
				divHtml.push( '  <input id="passwordInput" name="password" type="password" class="'+cssClass+'/><br/>' );
				divHtml.push( '</form></fieldset><span id="loginResult"></span></div>' );
				divHtml.push( '<script>' );
				divHtml.push( '$( function() { $( "#pongLoginDialog" ).dialog( { ' );
				divHtml.push( '  autoOpen: false, height: 300, width: 300, modal: true, ' );
				divHtml.push( '  buttons: { "Login": function() { ' );
				divHtml.push( '      $.post( "'+params.loginURL+'", ' );
				divHtml.push( '         { userid: $( "#useridInput" ).val(), password: $( "#passwordInput" ).val() }, ' );
				divHtml.push( '         function( data ) { ' );
				divHtml.push( '             $( "#loginResult" ).html( $.i18n( data ) ); ' );
				if ( params.loginPage ) { 
					if ( lang != '' ) { lang = '&'+lang; }
					divHtml.push( '             if ( data == "Login OK" ) { window.location.href = "index.html?layout='+params.loginPage+lang+'"; } ' );
				} else {
					if ( lang != '' ) { lang = '?'+lang; }
					divHtml.push( '             if ( data == "Login OK" ) { window.location.href = "index.html'+lang+'"; } ' );					
				}
				divHtml.push( '         } ' );
                divHtml.push( '      ).fail(  ' );
                divHtml.push( '         function(){  $( "#loginResult" ).html( $.i18n( "Login failed" ) ); }' );
                divHtml.push( '      ); ' );
				divHtml.push( '      return false;' );
				divHtml.push( '  }, Cancel: function() { $( this ).dialog( "close" ); } } }); ' );
				divHtml.push( '});' );			
				divHtml.push( '$( ".PongLogin" ).click( ' );
				divHtml.push( '  function( ) { ' ); 
				divHtml.push( '         $( "#pongLoginDialog" ).dialog( "open" ); return false; ' );
				divHtml.push( '  } );' );
				divHtml.push( '</script>' );
			}
		}
	} else {
		divHtml.push( '<form id="SecurityHeaderFrom" action="index.html">' );
		divHtml.push( '<div id="SecurityHeaderUser">'+$.i18n('User')+':&nbsp;' );
		divHtml.push( '<span class="user-id" style="display:inline-flex">'+userID + '&nbsp;' );
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

//		divHtml.push( '<select id="SecurityHeaderRoleSelect" name="role" size="1">' );
//		var roles = pageInfo["userRoles"];
//		for ( var i = 0; i < roles.length; i++ ) {
//			if ( userRole == roles[i].role ) {
//				divHtml.push( '<option selected>'+ roles[i].role +'</option>' );			
//			} else {
//				divHtml.push( '<option>'+ roles[i].role +'</option>' );							
//			}
//		}
//		divHtml.push( '</select>&nbsp;');
        divHtml.push( '</form>' );

        if ( params.changePasswordURL != null  ) {
          divHtml.push( '<span class="SecurityHeaderPullDownItem"><a href="changePassword.htm" class="PongChPwd">'+$.i18n('Change Password')+'</a></span>' );
          //TODO
          var cssClass = 'class="text ui-widget-content ui-corner-all"';
          divHtml.push( '<div id="pongChPwdDialog">' );
          divHtml.push( ' <form id="pongChPwdDialogForm" action="'+params.loginURL+'" method="post"><fieldset>' );
          divHtml.push( '  <label for="oldPassword">'+$.i18n('Password')+'</label><br/>' );
          divHtml.push( '  <input id="oldPassword" name="oldPassword" type="password" class="'+cssClass+'/><br/>' );
          divHtml.push( '  <label for="newPassword">'+$.i18n('New Password')+'</label><br/>' );
          divHtml.push( '  <input id="newPassword" name="newPassword" type="password" class="'+cssClass+'/><br/>' );
          if ( params.changePasswordStrength ) {
            var hint = 'Password should \n * have at least 8 characters \n * contain upper and lower characters \n * contain a number \n * contain a special character !,@,#,$,%,^,&,*,?,_,~,+,-,(,)'
            divHtml.push( '  <div id="newPasswordStength" title="'+hint+'"></div>' );            
          }
          divHtml.push( '  <label for="newPassword2">'+$.i18n('Repeat New Password')+'</label><br/>' );
          divHtml.push( '  <input id="newPassword2" name="newPassword2" type="password" class="'+cssClass+'/><br/>' );
          divHtml.push( '</form></fieldset><span id="loginResult"></span></div>' );
          divHtml.push( '<script>' );
          divHtml.push( '$( function() { $( "#pongChPwdDialog" ).dialog( { ' );
          divHtml.push( '  autoOpen: false, height: 320, width: 300, modal: true, ' );
          divHtml.push( '  buttons: { "Change Password": function() { ' );          
          divHtml.push( '      if ( ! checkPwdStrength( $("#newPassword").val(),  $("#newPassword2").val(), '+params.changePasswordStrength+' ) ) { ' );          
          divHtml.push( '         alert( "'+$.i18n('Password to weak!')+'" ); ' );          
          divHtml.push( '         return false; };' );
          divHtml.push( '      if ( $( "#newPassword" ).val()  !=  $( "#newPassword2" ).val() ) { ' );          
          divHtml.push( '         alert( "'+$.i18n('Passwords do not match!')+'" ); ' );          
          divHtml.push( '         return false; };' );
          divHtml.push( '      $.post( "'+params.changePasswordURL+'", ' );
          divHtml.push( '         { oldPassword: $( "#oldPassword" ).val(), newPassword: $( "#newPassword" ).val() }, ' );
          divHtml.push( '         function( data ) { ' );
          divHtml.push( '             $( "#loginResult" ).html( $.i18n( data ) ); ' );
          divHtml.push( '         } ' );
          divHtml.push( '      ).fail(  ' );
          divHtml.push( '         function(){  $( "#loginResult" ).html( $.i18n( "Failed" ) ); }' );
          divHtml.push( '      ); ' );
          divHtml.push( '      return false;' );
          divHtml.push( '  }, Cancel: function() { $( this ).dialog( "close" ); } } }); ' );
          divHtml.push( '});' );    
          if ( params.changePasswordStrength ) {
            divHtml.push( '$(":button:contains(\'Change Password\')").prop("disabled", true).addClass("ui-state-disabled");' );
          }
          divHtml.push( '$( "#newPassword,#newPassword2" ).keyup( ' );
          divHtml.push( '  function( ) { ' ); 
          divHtml.push( '        checkPwdStrength( $("#newPassword").val(), $("#newPassword2").val(), '+params.changePasswordStrength+' ); return false; ' );
          divHtml.push( '  } );' );
          divHtml.push( '$( ".PongChPwd" ).click( ' );
          divHtml.push( '  function( ) { ' ); 
          divHtml.push( '         $( "#pongChPwdDialog" ).dialog( "open" ); return false; ' );
          divHtml.push( '  } );' );
          divHtml.push( '</script>' );
        }
		divHtml.push( '<span class="SecurityHeaderPullDownItem"><a href="logout.htm" class="PongLogout">'+$.i18n('Logout')+'</a></span>' );
		divHtml.push( '<script>' );
		divHtml.push( '  $( "#SecurityHeaderRoleSelect" ).change(function() { ');
		divHtml.push( '     $( "#SecurityHeaderFrom" ).submit();');
		divHtml.push( '  });');
		divHtml.push( '$( ".PongLogout" ).click( ' );
		divHtml.push( '  function( ) { ' ); 
		divHtml.push( '      $.post( "'+params.logoutURL+'" ) ' ); 
		divHtml.push( '      .always( function() { ' );
		if ( params.logoutPage ) { 
			if ( lang != '' ) { lang = '&'+lang; }
			divHtml.push( '           window.location.href = "index.html?layout='+params.logoutPage+lang+'"; ' );
		} else {
			if ( lang != '' ) { lang = '?'+lang; }
			divHtml.push( '           window.location.href = "index.html'+lang+'"; ' );
		}
		divHtml.push( '      } ); ' ); 
		divHtml.push( '      return false; ' );
		divHtml.push( '  } );' );
		divHtml.push( '      $( "#SecurityHeaderUser" ).click( function() { ' );
		divHtml.push( '        setTimeout( function(){ $( "#SecurityHeaderPullDown" ).hide( "blind" ); }, 5000 );' );
		divHtml.push( '        $( "#SecurityHeaderPullDown" ).toggle( "blind" ); } ); ' );
		divHtml.push( '      $( "#SecurityHeaderPullDown" ).hide(); ');
		divHtml.push( '</script>' );

		if ( params.userPages ) {
		  divHtml.push( '<hr/>' );
		  for ( label in params.userPages ) {
	          divHtml.push( '<span class="SecurityHeaderPullDownItem"><a href="index.html?layout='+
	              params.userPages[ label ]
	              +'" class="PongUserPage">'+$.i18n(label)+'</a></span>' );		    
		  }
		}
		
		divHtml.push( '</div>' );

	}
	divHtml.push( '</div>' );
	
	$( "#"+divId ).html( divHtml.join( "\n" ) );
}

function checkPwdStrength( pwd, pwd2, min ) {
  var score = 0;
  //alert( min )
  if ( pwd.length > 7 ) { score++  }
  if ( pwd.length > 9 ) { score++  }
  if ( ( pwd.match(/[a-z]/) ) && ( pwd.match(/[A-Z]/) ) ) { score++ }
  if ( pwd.match(/\d+/)) { score++ }
  if ( pwd.match(/.[!,@,#,$,%,^,&,*,?,_,~,+,-,(,)]/) ) { score++ }
  
  var bar = '<div id="PwdScore">'+$.i18n('Strength:')+'</div>'
  var cls = 'goodPwdScore'
  for ( var i = 0; i < min; i++ ) {
    if ( score <= i ) { cls = 'badPwdScore' }
    bar += '<div class="'+cls+'"></div>'
  }
  bar += '<br>'
  console.log( bar )
  $( '#newPasswordStength' ).html( bar )
  if ( score >= min  &&  pwd == pwd2 ) {
    $( ':button:contains("Change Password")').prop("disabled", false).removeClass("ui-state-disabled");
  }
  return ( score >= min )
}
