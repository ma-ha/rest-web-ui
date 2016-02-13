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
log( "Pong-EasyForm", "load module");

function pongEasyFormDivHTML( divId, resourceURL, params ) {
	log( "Pong-EaysForm",  "divId="+divId+" resourceURL="+resourceURL );

	if ( moduleConfig[ divId ] != null ) {
		moduleConfig[ divId ].resourceURL = resourceURL;
		pongEasyFormRenderHTML( divId, resourceURL, params, moduleConfig[ divId ]  );
	} else {
		$.getJSON( 
			resourceURL+"/pong-easyform", 
			function( pmd ) {
				moduleConfig[ divId ] = pmd;
				moduleConfig[ divId ].resourceURL = resourceURL;
				pongEasyFormRenderHTML( divId, resourceURL, params, pmd );
			}
		);					
	}	
}

var easyCheckboxNames = [];
var easyCheckboxVals = [];

function pongEasyFormRenderHTML( divId, resourceURL, params, pmd ) {
	log( "Pong-EaysForm", "start '"+pmd.description+"'");
	var contentItems = [];
	contentItems.push( '<div id="'+divId+'PongFormDiv" class="pongFormFrm">' );
	contentItems.push( '<form id="'+divId+'PongFormFrm">' );
	if ( pmd.label != null ) {				
		contentItems.push( '<fieldset>' );
		contentItems.push( '<legend>'+ $.i18n( pmd.label )  +'</legend>' );
	}
	var postLst = [];			
	var getLst = [];			
	var headerLst = [];
	easyCheckboxNames = [];
	easyCheckboxVals = [];
	var basicAuth = null;
	log( "Pong-EaysForm", "start fields" );
	if ( pmd.fieldGroups != null ) {
		for ( var i = 0; i < pmd.fieldGroups.length; i++ ) {
			contentItems.push( '<div class="pongFormInputGrp'+i+'">' );
			var grp = pmd.fieldGroups[i];
			if ( grp.fieldset != null ) {
				contentItems.push( '<fieldset>' );
				contentItems.push( '<legend>'+ $.i18n( grp.fieldset )  +'</legend>' );				
			}
			for ( var j = 0; j < grp.columns.length; j++ ) {
				contentItems.push( '<div class="pongFormInputCol pongFormInput'+divId+'Grp'+i+'Col'+j+'">' );
				var col = grp.columns[j];
				if ( col.fieldset != null ) {
					contentItems.push( '<fieldset>' );
					contentItems.push( '<legend>'+ $.i18n( col.fieldset )  +'</legend>' );				
				}
				for ( var k = 0; k < col.formFields.length; k++ ) {
					var field = col.formFields[k];
					contentItems = contentItems.concat( pongEasyFormRenderField( divId, field, 'G'+i+'C'+j ) );
					if ( field.type == 'checkbox' ) {
						if ( field.name != null ) { // normal checkbox operation
							log( "Pong-EaysForm", "checkbox "+field.name  );
							if ( ! easyCheckboxNames.inArray( field.name ) ) {
								log( "Pong-EaysForm", "checkboxNames "+field.name  );
	
								easyCheckboxNames.push( field.name ); 							
								postLst.push( field.name+": easyFormCheckboxVal('"+field.name+"' )" );					
							}
							easyCheckboxVals.push( { "name":field.name, "val":field.value, "id":divId+field.id } );
						} else { // stand alone checkbox
							log( "Pong-EaysForm", "stand alone checkbox "+field.id  );
							postLst.push( '"'+field.id+'"'+": $( '#"+divId+field.id+":checked' ).val()" );						
						}
						// TODO handle check boch with same name !!
//							postLst.push( field.id+": $( '#"+divId+field.id+":checked' ).val()" )						
					} else if ( field.type != 'separator' && field.type != 'label' ) {
						
						// check if this is 1:1 for http header
						if ( field.request != null ) {
							if ( field.request == "header" || field.request == "header+param") {
								headerLst.push( '"'+field.id+'"'+", $( '#"+divId+field.id+"' ).val()" );
							} else if ( field.request == "substitute" && field.defaultVal != null ) {
								var x = field.defaultVal;
								for ( var kk = 0; kk < col.formFields.length; kk++ ) {
									var fieldKK = col.formFields[kk];
									if ( fieldKK.request != null && fieldKK.request == "variable" ) {
										x = x.replace( "${"+fieldKK.id+"}", "$( '#"+divId+fieldKK.id+"' ).val()" );
									}
								}
								log( "Pong-EaysForm", field.id+"= "+x );
								postLst.push( '"'+field.id+'"'+": "+x );	
								//alert( JSON.stringify(x) );
								getLst.push( field.id + '='+x  );	
							} else if ( field.request == "variable"  ) {
								// ignoere here
							} else {
								postLst.push( '"'+field.id+'"'+": $( '#"+divId+field.id+"' ).val()" );	
							}
							
						// but might be a basic auth
						} else if ( field.basicAuth != null ) {
							if ( field.basicAuth == "user" ) {
								if ( basicAuth == null ) { basicAuth = {}; }
								basicAuth.user = field.id;		
								//alert( "U" );
							} else if ( field.basicAuth == "user+field" ) {
								if ( basicAuth == null ) { basicAuth = {}; }
								basicAuth.user = field.id;		
								postLst.push( '"'+field.id+'"'+": $( '#"+divId+field.id+"' ).val()" );	
								getLst.push( field.id + '=" + $( "#'+divId+field.id+'" ).val() +"' );	
								//alert( "U+f" );
							} else if ( field.basicAuth == "password" ) {
								if ( basicAuth == null ) { basicAuth = {}; }
								basicAuth.password = field.id;
								//alert( "P" );
							} else if ( field.basicAuth == "password+field" ) {
								if ( basicAuth == null ) { basicAuth = {}; }
								basicAuth.password = field.id;
								postLst.push( '"'+field.id+'"'+": $( '#"+divId+field.id+"' ).val()" );	
								getLst.push( field.id + '=" + $( "#'+divId+field.id+'" ).val() +"' );	
								//alert( "P+F" );
							}
						// no: normal form field, add to post list
						} else {							
							postLst.push( '"'+field.id+'"'+": $( '#"+divId+field.id+"' ).val()" );	
							getLst.push( field.id + '=" + $( "#'+divId+field.id+'" ).val() +"' );	
						}
					} 
				}
				if ( col.fieldset != null ) {
					contentItems.push( '</fieldset>' );
				}
				contentItems.push( '</div>' ); //pongFormInputGrpXColY	
			}
			if ( grp.fieldset != null ) {
				contentItems.push( '</fieldset>' );
			}
			contentItems.push( '</div>' ); //pongFormInputGrp
		}
	} else {
		log( "Pong-EaysForm", "easy legacy two column form" );
		if ( pmd.formFields2 != null ) {
			log( "Pong-EaysForm", "easy legacy two column form" );
			contentItems.push( '<div class="pongFormInput1">' );
			for ( var i = 0; i < pmd.formFields1.length; i++ ) {
				var field = pmd.formFields1[i];
				contentItems = contentItems.concat( pongEasyFormRenderField( divId, field, 1 ) );
				postLst.push( '"'+field.id+'"'+": $( '#"+divId+field.id+"' ).val()" )
			}
			contentItems.push( '</div>' );				
		}
		if ( pmd.formFields2 != null ) {
			contentItems.push( '<div class="pongFormInput2">' );
			for ( var i = 0; i < pmd.formFields2.length; i++ ) {
				var field = pmd.formFields2[i];
				contentItems = contentItems.concat( pongEasyFormRenderField( divId, field, 2 ) );
				postLst.push( '"'+field.id+'"'+": $( '#"+divId+field.id+"' ).val()" )
			}
			contentItems.push( '</div>' );						
		} 		
	}
	
	//postLst.push( field.id+": $( '#"+divId+field.id+":checked' ).val()" );					

	
	log( "Pong-EaysForm", "start actions");
	contentItems.push( '<div class="pongFormActions">' );
	var initData = null;
	if ( pmd.actions != null ) {
		for ( var i = 0; i < pmd.actions.length; i++ ) {
			var action = pmd.actions[i];
			if ( action.onInit != null ) {
				if ( action.onInit == 'GET' ) {
					initData = getUrlGETparams();
				} else {
					initData = action.onInit;					
				}
				//alert( "onInit GET: "+JSON.stringify( initData ) );	
			} else {
				contentItems = contentItems.concat( pongEasyFormRenderAction( divId, action, postLst, getLst, headerLst, basicAuth ) );			
			}
		}		
	}
	contentItems.push( '<div class="pongFormFrmField">' );
	
	contentItems.push( '</form>' );
	if ( pmd.label != null ) {				
		contentItems.push( '</fieldset>' );
	}
	contentItems.push( '</div>' );

	// output
	$( "#"+divId ).html( contentItems.join( "\n" ) );

	if ( initData != null ) {
		pongEasyFormUpdateData( divId, initData );
	} 
	log( "Pong-EaysForm", "end.");
}


// select checkbox vals for GET/POST/...
function easyFormCheckboxVal( name ) {
	log( "Pong-EaysForm", "checkboxVal: "+name);
	var result = '[';
	var first = true;
	for ( var i = 0; i < easyCheckboxVals.length; i++ ) {
		if ( easyCheckboxVals[i].name == name  ) {
			if ( $( "#"+easyCheckboxVals[i].id ).is(':checked') ) {
				if ( ! first ) { result += ','; }
				result += "'"+easyCheckboxVals[i].val+"'";
				log( "Pong-EaysForm", " val= "+easyCheckboxVals[i].val);

				first = false;
			}
		}
	}
	result += ']';
	return result;
}

function pongEasyFormRenderAction( divId, action, postLst, getLst, headerLst, basicAuth ) {
	log( "Pong-EaysForm", "action '"+action.actionName+"'");
	var contentItems = [];
	var method = "POST";
	var def = moduleConfig[ divId ];

	if ( action.method != null ) { method = action.method; }
	
	if ( action.onChange != null ) { // no button, but a onChange event is done for the form

		var onChngSelector = '.'+divId+'PongFormField';
		if ( action.onChange != "*" ) {
			//log( "Pong-EaysForm", "action.onChange: "+ action.onChange );
			
			var onCngElements = action.onChange.splitCSV();
			//log( "Pong-EaysForm", "onCngElements= "+ onCngElements.join('|') );
			onChngSelector = '';
			for ( var i = 0; i < onCngElements.length; i++ ) {
				if ( i != 0 ) { onChngSelector += ', '; } 
				onChngSelector += '#'+divId+onCngElements[i];
			}
		}

		log( "Pong-EaysForm", "selector: "+ onChngSelector );
		if ( action.actionURL != null ) {
			
			// do a aAJAX call on a change field event
			contentItems.push( '<script>' );
			contentItems.push( '  $( function() { ' );
			contentItems.push( '       $( "' +onChngSelector+ '" ).change(' );
			contentItems.push( '          function() { ' );
			contentItems.push( '              var actionUrl = easyParsePlaceHolders( "'+divId+'", "'+action.actionURL+'" );' );
			contentItems.push( '              $.ajax( ' );
			contentItems.push( '                 { url: actionUrl, type: "'+method+'", dataType: "json", ' );
			//alert ('headerLst.length '+headerLst.length );
			contentItems.push( '                   	   beforeSend: function (request) { ' );
			if ( action.oauth_scope != null ) {
				contentItems.push( '                          if ( sessionInfo["OAuth"]["access_token"] != null && sessionInfo["OAuth"]["access_token"] != "" ) {');
				contentItems.push( '                   	        request.setRequestHeader( "Authorization", "Bearer "+sessionInfo["OAuth"]["access_token"] ); } ');
			}
			if ( headerLst.length != 0 ) { 
				for ( var i = 0; i < headerLst.length; i++ ) {
					contentItems.push( '                   	      request.setRequestHeader( ' +headerLst[i]+ ');   ');
				}
			}
			contentItems.push( '                   },');
			contentItems.push( '                   data: { '+ postLst +' } ' );
			contentItems.push( '              } ).done(  ' );
			contentItems.push( '                 function( dta ) { ' );
			if ( action.target != null ) {
				contentItems.push( '                       $( "#'+action.target+'Content" ).html( dta );  ' );						
			}
			if ( ( action.update != null ) && ( action.update.length != null ) ) {
				for ( var i = 0; i < action.update.length; i++ ) {
					//contentItems.push( '                   udateModuleData( "'+action.update[i].resId+'Content", { "'+def.id+'": $( "#'+divId+def.id+'" ).val() } );' );
					contentItems.push( '                   udateModuleData( "'+action.update[i].resId+'Content", { '+postLst+' } );' );					
				}
			}
			contentItems.push( '                       return false;' ); 
			contentItems.push( '                  }  ' );
			contentItems.push( '              ).error( function( jqXHR, textStatus, errorThrown) { alert( textStatus+": "+jqXHR.responseText ); } ); ');
			contentItems.push( '              return false;' ); 
			contentItems.push( '          }' );
			contentItems.push( '       ); ' );
			contentItems.push( '  } ); ' );
			contentItems.push( '</script>' );
			
		} else if ( ( action.update != null ) && ( action.update.length != null ) ) {
			
			contentItems.push( '<script>' );
			contentItems.push( '  $( function() { ' );
			contentItems.push( '       $( "' +onChngSelector+ '" ).change(' );
			contentItems.push( '          function() { ' );
			for ( var i = 0; i < action.update.length; i++ ) {
				//contentItems.push( '             udateModuleData( "'+action.update[i].resId+'Content", { "'+def.id+'": $( "#'+divId+def.id+'" ).val() } );' );
				contentItems.push( '                   udateModuleData( "'+action.update[i].resId+'Content", { '+postLst+' } );' );					

			}
			contentItems.push( '              return false;' ); 
			contentItems.push( '          }' );
			contentItems.push( '       ); ' );
			contentItems.push( '  } ); ' );
			contentItems.push( '</script>' );
			
		}  
		
	} else if ( ( action.updateButton != null ) && ( action.updateButton.length != null ) ) {

		contentItems.push( '<button id="'+divId+'Bt'+action.id+'">'+  $.i18n( action.name ) +'</button>' );
		contentItems.push( '<script>' );
		contentItems.push( '  $(function() { ' );
		contentItems.push( '       $( "#'+divId+'Bt'+action.id+'" ).click(' );
		contentItems.push( '          function() { ' );
		for ( var i = 0; i < action.updateButton.length; i++ ) {
			contentItems.push( '                   udateModuleData( "'+action.updateButton[i].resId+'Content", { '+postLst+' } );' );	
		}
		contentItems.push( '              return false;' ); 
		contentItems.push( '          }' );
		contentItems.push( '       ); ' );
		contentItems.push( '  } ); ' );
		contentItems.push( '</script>' );
		
	} else if ( action. afterUpdate != null ) {
		// do nothing
		
	} else if ( action.link != null && action.linkURL != null ) { // simple link with id-field as GET parameter
		log( "Pong-EaysForm", "link: "+ action.id );

		var target = "_blank";
		if ( action.target == null ) {
			target = "_blank";
		} else if ( action.target == '_parent' ) {
			target = "_parent";
		} else if ( action.target == '_blank' ) {
			target = "_blank";
		} else if ( action.target == '_self' ) {
			target = "_self";
		} 
		var url = action.linkURL;
		// TODO: must be on change
		
		if ( action.getParams != null ) {
			for ( var i = 0; i < action.getParams.length; i++ ) {
				contentItems.push( '<script>' );
				contentItems.push( '  $(function() { ' );
				contentItems.push( '       $( "#'+divId+action.getParams[i]+'" ).on( "change", ' );
				contentItems.push( '         function() { ' );
				contentItems.push( '            var url = "'+action.linkURL+'"; ' );
				for ( var j = 0; j < action.getParams.length; j++ ) {
					contentItems.push( '            url +=  ( ( url.indexOf("?") > -1 ) ? "&" : "?" );' );
					var valStr = '"#'+ divId + action.getParams[j] +'"';
					contentItems.push( '            url += "'+action.getParams[j]+'="+ $( '+valStr+' ).val();' );
				}
				contentItems.push( '            $( "#'+divId+'Lnk'+action.id+'" ).attr( "href", url );' );
				contentItems.push( '         } ' );
				contentItems.push( '       );	 ' );
				contentItems.push( '  } ); ' );
				contentItems.push( '</script>' );
//				url +=  ( ( url.indexOf('?') > -1 ) ? '&' : '?' );
//				url += '"'+action.getParams[i]+'"='+"$( '#"+divId+action.getParams[i]+"' ).val()";				
			}  
			
		}
		
		log( "Pong-EaysForm", "   url= "+ url );
		//alert( url );
		
		contentItems.push( '<a href="'+url+'" id="'+divId+'Lnk'+action.id+'" target="'+target+'">'+  $.i18n( action.link ) +'</a>' );			
		
	} else if ( action.actionName != null ) { // normal button action
	
		log( "Pong-EaysForm", "action: "+ action.id );
		// render a button
		contentItems.push( '<button id="'+divId+'Bt'+action.id+'">'+  $.i18n( action.actionName ) +'</button>' );
		contentItems.push( '<script>' );
		contentItems.push( '  $(function() { ' );
		contentItems.push( '       $( "#'+divId+'Bt'+action.id+'" ).click(' );
		contentItems.push( '          function() { ' );
		//contentItems.push( '              var obj = jQuery.parseJSON( \'[ { "name": "John" } ]\' ); alert( "oooh "+obj[0].name ); ' );
		//contentItems.push( '              var obj = jQuery.parseJSON( \'[{"Command":"/docker-entrypoint.sh postgres","Created":1431680184,"Id":"061c3c918707342c924865d06c3572b46652f21030092bdda57e1ca5a7038b0c","Image":"postgres:latest","Labels":{},"Names":["/evil_mayer"],"Ports":[{"PrivatePort":5432,"Type":"tcp"}],"Status":"Exited (0) 4 weeks ago"},{"Command":"/controller","Created":1431583964,"Id":"49f0a75f9fc8123a0cf4c96ca0a1b1a6673c641bb6f3aef13252b42c5e497475","Image":"shipyard/shipyard:latest","Labels":null,"Names":["/shipyard"],"Ports":[{"IP":"0.0.0.0","PrivatePort":8080,"PublicPort":8080,"Type":"tcp"}],"Status":"Exited (0) 4 weeks ago"},{"Command":"/usr/bin/rethinkdb --bind all","Created":1431583884,"Id":"936198bb2ea96fb437bb4e0729d29d1fbae3edc587682e67b7ce9878b3e2e7f3","Image":"shipyard/rethinkdb:latest","Labels":null,"Names":["/shipyard/rethinkdb","/shipyard-rethinkdb"],"Ports":[{"IP":"0.0.0.0","PrivatePort":29015,"PublicPort":32769,"Type":"tcp"},{"IP":"0.0.0.0","PrivatePort":8080,"PublicPort":32770,"Type":"tcp"},{"IP":"0.0.0.0","PrivatePort":28015,"PublicPort":32768,"Type":"tcp"}],"Status":"Exited (0) 4 weeks ago"},{"Command":"/bin/bash -l","Created":1431583671,"Id":"c4d35097087b8915f3ae190e3d21a99d521e943b33391c711fadc77823e4e8d2","Image":"shipyard/rethinkdb:latest","Labels":null,"Names":["/shipyard-rethinkdb-data"],"Ports":[{"PrivatePort":28015,"Type":"tcp"},{"PrivatePort":29015,"Type":"tcp"},{"PrivatePort":8080,"Type":"tcp"}],"Status":"Exited (0) 4 weeks ago"},{"Command":"apache2 -D FOREGROUND","Created":1431189130,"Id":"622334cf6ff473151ee89fae441ea189138b7d3e2080af5062625b2143b7a38f","Image":"apache2:latest","Labels":null,"Names":["/angry_hypatia"],"Ports":[{"IP":"0.0.0.0","PrivatePort":8880,"PublicPort":88,"Type":"tcp"}],"Status":"Exited (0) 4 weeks ago"}]\' ); alert( "oooh "+obj[0].Command ); ' );
		/*
		contentItems.push( ' 	             var request = createCORSRequest( "GET", "http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&GLOBAL-ID=EBAY-DE&SERVICE-VERSION=1.12.0&SECURITY-APPNAME=MaHa2cd74-4cc1-4c27-b657-c4bd01b8554&RESPONSE-DATA-FORMAT=JSON&keywords=Sinar%20Case" );' );
		contentItems.push( ' 	             request.onload = function(){ alert("Uiii"); alert( this.responseText ); }; ' );
		contentItems.push( ' 	             request.send();');
		*/
		
		//TODO fix CORS logic
		contentItems.push( '              var actionUrl = easyParsePlaceHolders( "'+divId+'", "'+action.actionURL+'" );' );
		contentItems.push( '              var request = $.ajax( { url: actionUrl, type: "'+method+'", ' );
		contentItems.push( '                       crossDomain: true, ' );
		contentItems.push( '                   	   beforeSend: function ( request ) { ' );
		if ( basicAuth != null ) {
		//	alert()
			var basicAuthStr = 'btoa( $( "#'+divId+basicAuth.user+'" ).val() + ":" + $( "#'+divId+basicAuth.password+'" ).val() )';
			contentItems.push( '                   	      request.setRequestHeader( "Authorization", "Basic "+'+basicAuthStr+' );' );
		} else 
		if ( action.oauth_scope != null ) {
			contentItems.push( '                             if ( sessionInfo["OAuth"]["access_token"] != null && sessionInfo["OAuth"]["access_token"] != "" ) {');
			contentItems.push( '                   	             request.setRequestHeader( "Authorization", "Bearer "+sessionInfo["OAuth"]["access_token"] ); ');
			contentItems.push( '                   	             request.setRequestHeader( "oauth-token", sessionInfo["OAuth"]["access_token"] ); '); // huuhaaaaa SugarCRM special -- hope it won't hurt elsewhere!!
			contentItems.push( '                   	         } ');
		}
		for ( var i = 0; i < headerLst.length; i++ ) {
			contentItems.push( '                   	         request.setRequestHeader( ' +headerLst[i] + '); ');
		}
		contentItems.push( '                   	   },' )
		if ( ( action.dataEncoding != null ) || ( action.dataEncoding == "GETstyle")  ) { // funny request, but some standard
			var dataStr = "";
			dataStr = getLst.join("&");
			contentItems.push( '                       data: "'+dataStr+'" ' );
		} else { // default: JSON data encoding
			contentItems.push( '                 data: { '+ postLst +' } ' );			
		}
		//contentItems.push( '                     xhr: function() {return new window.XMLHttpRequest({mozSystem: true});}, beforeSend: function(xhr){  xhr.withCredentials = true; } ');
		contentItems.push( '              } ).done(  ' );
		contentItems.push( '                 function( dta ) {  ' );
		contentItems.push( '                    if ( dta != null && ( dta.error != null || dta.error_message != null ) ) {  alert( "ERROR: "+ dta.error +": "+ dta.error_message );}   ' );
		if ( action.target != null ) {
			if ( action.target == '_parent' ) {
				contentItems.push( '                       window.location.replace( dta );');
			} else if ( action.target == '_blank' ) {
				contentItems.push( '                       window.open( dta );');
			} else if ( action.target == 'modal' ) {
				contentItems.push( '                       alert( dta );  ' );
			} else {
				contentItems.push( '                       $( "#'+action.target+'Content" ).html( dta );  ' );
			}
		}
		if ( ( action.update != null ) && ( action.update.length != null ) ) {
			for ( var i = 0; i < action.update.length; i++ ) {
				//contentItems.push( '                   udateModuleData( "'+action.update[i].resId+'Content", { "'+def.id+'": $( "#'+divId+def.id+'" ).val() } );' );					
				contentItems.push( '                   udateModuleData( "'+action.update[i].resId+'Content", { '+postLst+' } );' );					
			}
		}
		if ( ( action.setData != null ) && ( action.setData.length != null ) ) {
			for ( var i = 0; i < action.setData.length; i++ ) {
				log( "Pong-EaysForm", "action: "+ action.id + " setResponse hook "+action.setData[i].resId );
				if ( action.setData[i].dataDocSubPath != null ) {
					contentItems.push( '                   setModuleData( "'+action.setData[i].resId+'Content", dta, "'+action.setData[i].dataDocSubPath+'" );' );										
				} else {
					contentItems.push( '                   setModuleData( "'+action.setData[i].resId+'Content", dta, null );' );									
				}
			}			
		}
		contentItems.push( '                       return false;' ); 
		contentItems.push( '                  }  ' );
		contentItems.push( '              ).error( function( jqXHR, textStatus, errorThrown) { alert( textStatus+": "+jqXHR.responseText ); } ); ');

		if ( action.target == 'modal' ) {
			contentItems.push( '               request.fail(  function(jqXHR, textStatus) { alert( "Failed: "+textStatus ); } ); ' );
		}		

		contentItems.push( '              return false;' ); 
		contentItems.push( '          }' );
		contentItems.push( '       ); ' );
		contentItems.push( '  }); ' );
		contentItems.push( '</script>' );

	}
	return contentItems;
}

/** replaces ${xyz} in str by the value of the input text field with ID xyz */
function easyParsePlaceHolders( divId, str ) {
	//TODO
	var pmd = moduleConfig[ divId ];
	log( "Pong-EaysForm",  "Start value: "+ str );
	if ( pmd.fieldGroups != null ) {
		for ( var i = 0; i < pmd.fieldGroups.length; i++ ) {
			var grp = pmd.fieldGroups[i];
			for ( var j = 0; j < grp.columns.length; j++ ) {
				var col = grp.columns[j];
				for ( var k = 0; k < col.formFields.length; k++ ) {
					var field = col.formFields[k];
					if ( field.type = 'text' ) {
						str = str.replace( '${'+field.id+'}', $( '#'+divId+field.id ).val() );
					}
				}
			}
		}
	}
	log( "Pong-EaysForm", "Processed value: "+ str );
	return str;
}

/*
function createCORSRequest(method, url){
    var xhr = new XMLHttpRequest({mozSystem: true});
    if ("withCredentials" in xhr){
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined"){
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        xhr = null;
    }
    return xhr;
}
*/
function pongEasyFormUpdateData( divId, paramsObj ) {
	log( "Pong-EaysForm",  'update '+divId );
	var def = moduleConfig[ divId ];
	log( "Pong-EaysForm", JSON.stringify( def ) );
	if ( def.resourceURL != null ) {
		$.getJSON( 
				def.resourceURL, 
				paramsObj,
				function( data ) { 	
					//salert( data );
					pongEasyFormSetData( divId, data );
//					if ( def.dataDocSubPath == null ) {
//						// table is the root of the doc
//						log( "Pong-EaysForm",  'no tbl.dataDocSubPath' );
//						// TODO add update code
//						//alert( "Update form with dataDocSubPath..." );
//						pongEasyFormUpdFieldsDta( divId, data ); 
//					} else {
//						log( "Pong-EaysForm",  'tbl.dataDocSubPath='+def.dataDocSubPath );
//						// table is somewhere in the DOM tree
//						var pathToken = def.dataDocSubPath.split('.');
//						log( "Pong-EaysForm",  'pathToken[0] ' + pathToken[0] );
//						var subdata = data[ pathToken[0] ];
//						for ( i = 1; i < pathToken.length; i++ ) {
//							log( "Pong-EaysForm", 'pathToken['+i+'] ' + pathToken[i] );	
//							subdata = subdata[ pathToken[i] ];
//						}
//						// console.log( ' subdata = ' + JSON.stringify( subdata ) );
//						//poList[ divId ].pongListData = subdata;
//						// TODO add update code
//						//alert( "Update form w/o dataDocSubPath..." );
//						pongEasyFormUpdFieldsDta( divId, subdata ); 
//					}
					
					// for cascading update config: afterUpdate
					if ( def.actions != null ) {
						for ( var i = 0; i < def.actions.length; i++ ) {
							var action = def.actions[i];
							if ( action.afterUpdate != null ) {
								if ( action.update != null ) {
									for ( var i = 0; i < action.update.length; i++ ) {
										//alert( "afterUpdte > update "+action.update[i].resId );
										udateModuleData( action.update[i].resId+'Content', paramsObj );
									}
								}
							}
						}
					}
					
				} 
		);			
	} else {
		alert( "No Update!!" );
	}
}

/** hook and used by update hook */
function pongEasyFormSetData( divId, data ) {
	log( "Pong-EaysForm",  'set data hook: '+divId );
	var def = moduleConfig[ divId ];
	if ( def.dataDocSubPath == null ) {
		// table is the root of the doc
		log( "Pong-EaysForm",  'no tbl.dataDocSubPath' );
		// TODO add update code
		//alert( "Update form with dataDocSubPath..." );
		pongEasyFormUpdFieldsDta( divId, data ); 
	} else {
		log( "Pong-EaysForm",  'tbl.dataDocSubPath='+def.dataDocSubPath );
		// table is somewhere in the DOM tree
		var pathToken = def.dataDocSubPath.split('.');
		log( "Pong-EaysForm",  'pathToken[0] ' + pathToken[0] );
		var subdata = data[ pathToken[0] ];
		for ( i = 1; i < pathToken.length; i++ ) {
			log( "Pong-EaysForm", 'pathToken['+i+'] ' + pathToken[i] );	
			subdata = subdata[ pathToken[i] ];
		}
		log( "Pong-EaysForm", ' subdata = ' + JSON.stringify( subdata ) );
		//poList[ divId ].pongListData = subdata;
		// TODO add update code
		//alert( "Update form w/o dataDocSubPath..." );
		pongEasyFormUpdFieldsDta( divId, subdata ); 
	}
}


function pongEasyFormUpdFieldsDta( divId, dta ) {
	log( "Pong-EaysForm",  'pongEasyFormUpdFieldsDta: DIV='+divId );
	var pmd = moduleConfig[ divId ];
	if ( pmd.fieldGroups != null ) {
		for ( var i = 0; i < pmd.fieldGroups.length; i++ ) {
			var grp = pmd.fieldGroups[i];
			for ( var j = 0; j < grp.columns.length; j++ ) {
				var col = grp.columns[j];
				for ( var k = 0; k < col.formFields.length; k++ ) {
					var field = col.formFields[k];
					var fieldId = '#'+divId+field.id; 
					if ( ( field.type == "text" ) || ( field.type == "email" ) || ( field.type == "password" ) ) {
						log( "Pong-EaysForm",  'pongEasyFormUpdFieldsDta text: '+field.id+' '+dta[field.id] );
						if ( dta[field.id] != null ) {
							$( fieldId ).val( dta[field.id] );							
						} else if ( field.map != null &&  dta[ field.map ] != null ) { 
							$( fieldId ).val( dta[ field.map ] );							
						} else {
							$( fieldId ).val( "" );
						}
					} else if ( field.type == "checkbox" ) {
						//TODO update checkbox value
					} else if ( field.type == "checkboxList" ) {
						//TODO update checkboxList value
					} else if ( field.type == "select" ) {
						log( "Pong-EaysForm",  'pongEasyFormUpdFieldsDta select: '+field.id+' '+dta[field.id] );
						if ( dta[field.id] != null ) {
							$( fieldId ).val( dta[field.id] );							
						}else {
							$( fieldId ).val( -1 );
						}
						//TODO update select value
					} else {
						log( "Pong-EaysForm", "ERROR '"+fieldDd+"': Can't update "+field.type);

					}

					//alert("trigger change: "+fieldId );
					$( fieldId ).trigger( "change" ); 
				}
			}
		}
	}
} 


function pongEasyFormRenderField( divId, field, col ) {
	log( "Pong-EaysForm", "field '"+field.id+"' ("+ field.type+")");
	var contentItems = [];
	contentItems.push( '<div class="pongFormField pongFormField'+col+'">' );
	
	if ( field.type == "separator" ) {
		contentItems.push( '<hr/>' );
	} else if ( field.type == "label" ) {
		contentItems.push( '<span class="pongFormLabelField">'+$.i18n( field.label )+'</span>' );
	} else {
		
		var title      = ""; if ( field.descr != null ) { title = ' title="'+field.descr+'" '; }
		var defaultVal = ""; if ( field.defaultVal != null ) { defaultVal = ' value="'+field.defaultVal+'" '; }

		var nameAndClass = 'id="'+divId+field.id+'" class="text ui-widget-content ui-corner-all '+divId+'PongFormField"'; 
		if ( field.type == "checkbox"  && field.name != null ) {
			nameAndClass = 'name="'+field.name+'" ' + nameAndClass; 
		} else {
			nameAndClass = 'name="'+field.id+'" ' + nameAndClass; 			
		}

		if ( field.hidden != null && field.hidden == 'true' ) { 
			nameAndClass += ' hidden'; 
		} else {
			contentItems.push( '<p>' );
			if ( field.label != null && field.label != '' ) {
				contentItems.push( '<label for="'+divId+field.id+'">'+ $.i18n( field.label ) +'</label>' );				
			} else {
				contentItems.push( '<label for="'+divId+field.id+'"></label>' );								
			}
		}
		
		if ( field.type == "text" ) {
			var modifier = '';
			if ( field.readonly != null && field.readonly == 'true') { modifier += ' disabled="disabled"'; }

			if ( field.rows != null ) { 
				contentItems.push( '<textarea type="text" '+nameAndClass + title + ' rows="'+field.rows+'">'+ defaultVal +'</textarea>' );
			} else {
				contentItems.push( '<input type="text" '+nameAndClass + title + defaultVal + modifier+'/>' );				
			}
			
		} else if ( field.type == "email" ) {

			var modifier = '';
			if ( field.readonly != null && field.readonly == 'true') { modifier += ' disabled="disabled"'; }
			contentItems.push( '<input type="email" '+nameAndClass + title + defaultVal + modifier+'/>' );				
			
		} else if ( field.type == "password" ) {
			
			contentItems.push( '<input type="password" '+nameAndClass + title +'/>' );
			
		} else if ( field.type == "checkbox" ) {
			
			var cbValue = 'value="'+field.id+'" '; // default value=title
			if ( field.value != null ) { cbValue = 'value="'+field.value+'" '; }
			var modifier = '';
			if ( field.defaultVal != null && field.defaultVal == 'true') { modifier += ' checked'; }
			if ( field.readonly != null && field.readonly == 'true') { modifier += ' disabled'; }
			contentItems.push( '<input type="checkbox" '+ cbValue + nameAndClass + title + modifier +'/>' );
			
		} else if ( field.type == "checkboxList" ) {

			$.ajaxSetup({'async': false});
			$.getJSON( 
					field.resourceURL, 
					function( optData ) {
						for ( var i = 0; i < optData.length; i++ ) {
							var cbValue = 'value="'+optData[i][field.valueField]+'" '; // default value=title
							var modifier = '';
							if ( field.defaultValField != null && optData[i][field.defaultValField] == 'true') { 
								modifier += ' checked'; 
							}
							contentItems.push( '<input type="checkbox" '+ cbValue + nameAndClass + title + modifier +'/>' );
						}
					}
				);					
			$.ajaxSetup({'async': true});				

		} else if ( field.type == "select" ) {
			
			contentItems.push( '<select ' + nameAndClass  + title + '>' );
			if ( field.options != null ) {
				for ( var i = 0; i < field.options.length; i++ ) {
					var optValue = '';
					if ( field.options[i].value != null  ) {
						optValue = 'value="'+field.options[i].value+'"';
					} else {
						optValue = 'value="'+field.options[i].option+'"';						
					}
					contentItems.push( '<option '+optValue+'>'+ $.i18n( field.options[i].option )+'</option>' );	
				} 		
			} else 	if ( field.optionsResource != null ) {
				$.ajaxSetup({'async': false});
				$.getJSON( 
						field.optionsResource.resourceURL, 
						function( optData ) {
							for ( var i = 0; i < optData.length; i++ ) {
								contentItems.push( '<option value="'+optData[i][ field.optionsResource.optionValue ]+'">'+
										 $.i18n( optData[i][ field.optionsResource.optionField ] ) +'</option>' );
							}
						}
					);					
				$.ajaxSetup({'async': true});				
			}

			contentItems.push( '</select>' );
			
		} else { 
			contentItems.push( '<input type="text" '+ nameAndClass  + title + defaultVal +'/>' );			
		}
		// TODO: support other form input types 
		contentItems.push( '</p>' );		
	}		
	contentItems.push( '</div>' );	
	return contentItems;
}

