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
log( "PoNG-OAuth", "Loading Module");


/**
	'param' => array(
		'scope'         => $page_tbl_rec[ 'page_oauth_scope' ],
		'tokenURL'      => $page_tbl_rec[ 'page_oauth_tokenurl' ],
		'exit_page'     => $page_tbl_rec[ 'page_oauth_exit_page' ],
		'grandtype'     => $page_tbl_rec[ 'page_oauth_grandtype' ],
		'auth_page'     => $page_tbl_rec[ 'page_oauth_auth_page' ],
		'basicauth'     => $page_tbl_rec[ 'page_oauth_basicauth' ],
		'client_id'     => $page_tbl_rec[ 'page_oauth_client_id' ],
		'client_secret' => $page_tbl_rec[ 'page_oauth_client_secret' ]
	)
*/
function initOAuthHeaderHtml( divId, type , params ) {
	log( "PoNG-OAuth", "initOAuthHeaderHtml");
	if ( sessionInfo["OAuth"] == null ) {
		sessionInfo["OAuth"] = {
			'scope': '',
			'tokenURL': '',
			'access_token': '',
			'refresh_token': '',
			'token_type': ''
		}
		if ( params != null  &&  params.tokenURL != null && params.scope != null) {
			sessionInfo["OAuth"]['scope'] = params.scope; 
			sessionInfo["OAuth"]['tokenURL'] = params.tokenURL; 
		}
	}
}


function addOAuthHeaderHtml( divId, type , params ) {
	log( "PoNG-OAuth", "addOAuthHeaderHtml ");
	initOAuthHeaderHtml( divId, type , params );
	if ( sessionInfo["OAuth"]["access_token"] == null || sessionInfo["OAuth"]["access_token"] == '' ) {
		var divHtml = [];	
		if ( params.grandtype == 'password' ) {
			divHtml.push( '<div id="OAuthLoginDialog" style="width:530px height:300px">' );
			divHtml.push( '  <fieldset><legend>'+$.i18n('Login')+' ('+$.i18n('Scope')+': '+params.scope+')</legend>' );
			divHtml.push( '    <p><label for="oauthUser">'+$.i18n('User ID')+'</label>' ); 
			divHtml.push( '      <input id="oauthUser" class="text ui-widget-content ui-corner-all OAuthPongFormField" type="text" name="oauthUser"></input>' );
			divHtml.push( '    </p>' );	
			divHtml.push( '    <p><label for="oauthPwd">'+$.i18n('Password')+'</label>' );
			divHtml.push( '      <input id="oauthPwd" class="text ui-widget-content ui-corner-all OAuthPongFormField" type="password" name="oauthPwd"></input>' );
			divHtml.push( '    </p>' );	
			divHtml.push( '  </fieldset>' );	
			divHtml.push( '</div>' );	
			divHtml.push( '<script>' );	
			divHtml.push( '   $(function() { mkLoginDialog( '+ JSON.stringify( params ) 	+' ); } ); ' );			
			divHtml.push( '</script>' );	
		} else {
			// TODOD implement oauth authorization_code handling
		}
		$( "#"+divId ).html( divHtml.join( "\n" ) );
	}
}


function mkLoginDialog ( params ) {
	log( "PoNG-OAuth", "mkLoginDialog "+params.tokenURL );
	$( "#OAuthLoginDialog" ).dialog( { 
				autoOpen: true, 
				modal: true, 
				width: 500, height: 300,
				buttons: {  
					"OK":  function() { 
						// do oatuh call
						log( "PoNG-OAuth", "call "+params.tokenURL	 );
						$.ajax( { 
							url: params.tokenURL, 
							type: "POST",
							beforeSend: function ( request, settings  ) {
								request.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded"	 );
								if ( params.basicauth != null && params.basicauth != '' ) {
									request.setRequestHeader( "Authorization", "Basic "+params.basicauth );
								}
								log( "PoNG-OAuth", "set headers ... "	 );
								if ( params.client_id != null && params.client_id != '' ) {
									settings.data += "&client_id="+params.client_id+"&client_secret="+params.client_secret;
								}
							},
							data: { 
								"grant_type":"password",
								"username": $( '#oauthUser' ).val(),
								"password": $( '#oauthPwd' ).val(),
								"scope":"TNT" 
							 }
						} ).done(
							function( dta ) {
								if ( dta.access_token != null ) {
									sessionInfo["OAuth"]["access_token"]  = dta.access_token;
									sessionInfo["OAuth"]["refresh_token"] = dta.refresh_token;
									sessionInfo["OAuth"]["token_type"]    = dta.token_type;	
									alert( "Login successful" );
									$("#OAuthLoginDialog" ).dialog('close'); 
									return false;
								} else {
									alert( "Login Error!" );									
									return false;
								}
							}
						);
					},				
					Cancel:  function() { 
						$( this ).dialog( "close" );
						alert( "close" );
						if ( params.exit_page != null ) { 
							window.location.replace( params.exit_page ); 
						}
					},
					close: function () { // TODO
						alert( "close evt" );
					} 
				} 
			}
		);
}

