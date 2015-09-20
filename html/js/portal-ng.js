/*
The MIT License (MIT)

Copyright (c) 2015 Markus Harms, ma@mh-svr.de

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

/*
 Library: Portal-NG (PoNG)
 http://mh-svr.de/mw/index.php/PoNG
*/
var labeldefs = new Array();
labeldefs['PONGVER'] = '0.5.17';
var PONGVER = '0.5.17';

var moduleMap = {};
var reqModules = {};
var moduleConfig = new Array();

/** resMap[0] = resId / resMap[1] = resourceURL / resMap[2] = type / resMap[3] = resourceParam */
var resMap = new Array(); 	

/** */
var decorConfig = new Array();

var callbackMap = new Array();

var dlgMap = new Array();
var ajaxOngoing = 0;
var step = "load-lang";

// stores content of the structure file
var layout = null;

pageInfo = new Array();

// will be transfered from one page to another 
sessionInfo = {};

// Security Variables
pageInfo["userRoles"] = [];
pageInfo["layout"] = -1;
var userID = null;
var userRole = "";

var mode = '';
var directPage = 'main'; 

/** Because ajax loads are asynchronous, 
    we have to wait for all calls to be sinished to load HTML into DIV
    and then we have to wait to do all the callbacks */
function inits() {
	log( "init", "step="+step+" ajaxOngoing="+ajaxOngoing );
	if ( ajaxOngoing == 0 ) { 
		if ( step == "load-lang" ) {
			ajaxOngoing++;
			log( 'init', 'Start to load module list...');
			loadLang();
			step = "loadmodulemap";
		} else if ( step == "loadmodulemap" ) {
			ajaxOngoing++;
			log( 'init', 'Start to load module list...');
			loadModuleList();
			step = "loaddecor";
		} else if ( step == "loaddecor" ) {
			ajaxOngoing++;
			log( 'init', 'Start to load decor config...');
			loadDecorList();
			step = "loadstructure";
		} else	if ( step == "loadstructure" ) {
			ajaxOngoing++;
			log( 'init', 'Load Structure File ...');
			loadStructure();
			step = "loadmodules";
		} else if ( step == "loadmodules" ) {
			ajaxOngoing++;
			log( 'init', 'Start to load JS modules ...');
			loadModules();
			step = "initmodules";
		} else	if ( step == "initmodules" ) {
			ajaxOngoing++;
			log( 'init', 'Load Structure File ...');
			initModules( layout );
			step = "buildstructure";
		} else	if ( step == "buildstructure" ) {
			ajaxOngoing++;
			log( 'init', 'Start to build HTML ...');
			buildStructure( layout );
			step = "loadres-ht";
		} else	if ( step == "loadres-ht" ) {
			ajaxOngoing++;
			log( 'init', 'Start to load resources HTML ...');
			loadResourcesHT();
			step = "call-hooks";
		} else	if ( step == "call-hooks" ) {
			log( 'init', 'Call module hooks ...');
			callHooks();
			step = "loadres-js";
		} else	if ( step == "loadres-js" ) {
			ajaxOngoing++;
			log( 'init', 'Start to load resources JS ...');
			loadResourcesJS();
			step = "callbacks";
		} else	if ( step == "callbacks" ) {
			log( 'init', 'Start callback methods for resources...');
			resourceCallbacks();
			step = "dialogs";
		} else	if ( step == "dialogs" ) {
			log( 'init', 'Start load dialogs for resources...');
			resourceDialogs();
			clearInterval( initTimerId );
			step = "done";
		}
	}	
}

//=====================================================================================================
var cssPath = 'css/';
var jsPath  = ' js/';
var modulesPath  = 'modules/';
var themeCssPath = 'css/';

function loadCSS( cssFile ) {
	var cssLnk = document.createElement( 'link' );
	cssLnk.setAttribute( 'rel', 'stylesheet' );
	cssLnk.setAttribute( 'type', 'text/css' );
	cssLnk.setAttribute( 'href', cssPath+cssFile );
	document.getElementsByTagName( 'head' )[0].appendChild( cssLnk );
}

function loadThemeCSS( cssFile ) {
	var cssLnk = document.createElement( 'link' );
	cssLnk.setAttribute( 'rel', 'stylesheet' );
	cssLnk.setAttribute( 'type', 'text/css' );
	cssLnk.setAttribute( 'href', themeCssPath+cssFile );
	document.getElementsByTagName( 'head' )[0].appendChild( cssLnk );
}

//=====================================================================================================


function loadLang() {
	var locale = getParam( 'lang' );
	pageInfo["layout"] = getParam( 'layout' );
	if ( locale == '' ) { locale = "EN"; }

	$.i18n( { locale: locale } );

	var langMap = 'i18n/'+locale+'.json';
    if( mode == "php"  &&  pageInfo["layout"] != '' ) {
    	langMap = "svc/backend/i18n?locale="+locale+'&layout='+pageInfo["layout"];
    	$.getJSON( langMap, 
    			function( langMapDta ) {
			    	$.i18n().load( 
			    			langMapDta, 
			    			locale 
			    		).done( 
			    			function(){ ajaxOngoing--; } 
			    		);
    			}
    	);
    } else {
    	// do it static
    	$.i18n().load( 
    			langMap, 
    			locale 
    		).done( 
    			function(){ ajaxOngoing--; } 
    		);    	
    }

    $.extend( $.i18n.parser.emitter, {
    	// Handle PONGVER keywords
    	pongver: function () {
    		return PONGVER;
    	}
    } );

    /* hook vor init call back to define other i18n extends */
    if (typeof initI18n === "function") { 
        // safe to use the function
    	initI18n();
    }
    
	pageInfo["lang"] = locale;
}

/** build up the HTML structure of nested DIVs*/
function loadStructure() {
	var pPage = getParam( 'layout' );
	if ( pPage == '' ) {
		pPage = "main";
	}
	pageInfo[ 'layout' ] = pPage;

	var pEdit = '';
	if ( getParam( 'edit' ) == 'true' ) {
		pEdit = "&edit=true";
	}
	
	var structureURL = "svc/layout/"+pPage+"/structure";
    if( mode == "php" ) {
    	structureURL = "svc/layout.php?page="+pPage+pEdit;
    } else if ( mode == 'direct' ) {
    	structureURL =  "svc/layout/"+directPage+"/structure";
    }
	console.log("loadStructure: "+structureURL);
	$.getJSON( structureURL, 
		function( d ) {
			layout = d.layout;
			
			// load includes ...
			if ( d.layout.includeHeader != null && d.layout.includeFooter != null &&  d.layout.includeHeader == d.layout.includeFooter ) {
				// optimize to one additional load
				ajaxOngoing++;
				var inclHeaderURL = "svc/layout/"+d.layout.includeHeader+"/structure";
			    if( mode == "php" ) {
			    	inclHeaderURL = "svc/layout.php?page="+d.layout.includeHeader;
			    }
				$.getJSON( inclHeaderURL, 
					function( di ) {
						layout.header = di.layout.header;		
						layout.footer = di.layout.footer;		
						ajaxOngoing--;
					}
				);	
			} else 	{
				if ( d.layout.includeHeader != null ) {
					ajaxOngoing++;
					var inclHeaderURL = "svc/layout/"+d.layout.includeHeader+"/structure";
				    if( mode == "php" ) {
				    	inclHeaderURL = "svc/layout.php?page="+d.layout.includeHeader;
				    }
					$.getJSON( inclHeaderURL, 
						function( di ) {
							layout.header = di.layout.header;		
							ajaxOngoing--;
						}
					);
				}
				if ( d.layout.includeFooter != null ) {
					ajaxOngoing++;
					var inclFooterURL = "svc/layout/"+d.layout.includeFooter+"/structure";
				    if( mode == "php" ) {
				    	inclFooterURL = "svc/layout.php?page="+d.layout.includeFooter;
				    }
					$.getJSON( inclFooterURL, 
						function( di ) {
							layout.footer = di.layout.footer;		
							ajaxOngoing--;
						}
					);
				}
			}
		}
	).fail(
		function( jqxhr, textStatus, error ) {
			var err = textStatus + ", " + error;
			console.log( "Request Failed: " + err );
		}
	).always(
		function() {
			ajaxOngoing--;
		}
	);
}

/** build up the HTML structure of nested DIVs*/
function buildStructure( d ) {
	$( "title" ).html( d.title );
	// crunch layout into html divs
	var contentItems = layoutToHTML( d );			
	var pagename = "";
	if ( d.page_name != null ) {
		pagename = " page"+d.page_name.replace( " ","_" );
	} 
	$( "<div/>", 
		{ "id": "maindiv", "class": "page-width" + pagename, html: contentItems.join( "" ) } 
	).appendTo( "body" );
	loadHeaderFooter( d );
	ajaxOngoing--;
}

//=====================================================================================================
function loadDecorList() {
	$.getScript( jsPath+"portal-ng-decor.js" )
		.done(
			function( script, textStatus ) {
				log( 'loadDecorList', textStatus );
				ajaxOngoing--;
			}
		)
		.fail(
			function( jqxhr, settings, exception ) {
				logErr( 'loadDecorList', exception );
				ajaxOngoing--;
			}
		);
}
//=====================================================================================================
// Modules Loading

/* all modules are defined in additional js files: */
function loadModuleList() {
	$.getScript( modulesPath+"portal-ng-modules.js" )
		.done(
			function( script, textStatus ) {
				log( 'loadModuleList', textStatus );
				ajaxOngoing--;
			}
		)
		.fail(
			function( jqxhr, settings, exception ) {
				logErr( 'loadModuleList', exception );
				ajaxOngoing--;
			}
		);
}


// load modules
function loadModules() {
	checkModules( );
	for ( var module in reqModules ) {
		log( 'loadModules', modulesPath+module+'/'+module+".js  "+modulesPath+'/'+module+'/'+module+'.css' ); 		
		if ( module != 'pong-XX' ) { // just to exclude modules, for debugging it's better to include them hardcoded in index.html 
			jQuery('head').append('<link rel="stylesheet" rel="nofollow" href="'+modulesPath+module+'/'+module+'.css" type="text/css" />');
			ajaxOngoing++;
		    $.getScript( modulesPath+module+'/'+module+".js" )
			.done(
				function( script, textStatus ) {
					log( 'loadModules', textStatus );
					ajaxOngoing--;
				}
			)
			.fail(
				function( jqxhr, settings, exception ) {
					log( 'loadModules', exception );
					ajaxOngoing--;
				}
			);
		    // TODO: include from modules-map
		    if ( ( moduleMap[ module ] != null ) && ( moduleMap[ module ].loadCSS != null ) && 
		    	 ( moduleMap[module].loadCSS.lenght != null ) && ( moduleMap[module].loadCSS.lenght > 0 ) ) {
		    	alert( "loadCC" );
		    	for ( var cssUrl in moduleMap[module].loadCSS ) {
			    	alert( "load CSS: "+csssUrl );
					jQuery('head').append('<link rel="stylesheet" rel="nofollow" href="'+cssUrl+'" type="text/css" />');		    		
		    	}
		    }
		    if ( ( moduleMap[ module ] != null ) && ( moduleMap[ module ].loadJS != null ) && 
			    	 ( moduleMap[module].loadJS.lenght != null ) && ( moduleMap[module].loadJS.lenght > 0 ) ) {
		    	alert( "loadJS" );
		    	for ( var jsUrl in moduleMap[module].loadCSS ) {
			    	alert( "load JS: "+jsUrl );
				    $.getScript( jsUrl )
		    	}
		    }

		    
		}
	}
	ajaxOngoing--;
}


function checkModules() {
	log( 'checkModules', 'checkModules' );
	// allways req modules
	addReqModule( "i18n" );
	addReqModule( "pong-security" );
	// header modules
	if ( layout != null  && layout.header != null  && layout.header.modules != null )
	for ( var i=0; i< layout.header.modules.length; i++ ) {
		addReqModule( layout.header.modules[i].type );
	}
	// footer modules
	if ( layout != null  && layout.footer != null  && layout.footer.modules != null )
	for ( var i=0; i< layout.footer.modules.length; i++ ) {
		addReqModule( layout.footer.modules[i].type );
	}
	// modules of rows and cols
	checkModulesRec( layout );	
}

function checkModulesRec( l ) {
	if ( l.rows != null ) {
		for ( var i = 0; i < l.rows.length; i++ ) {
			log( 'checkModules', "row: "+ l.rows[i].rowId );
			if ( l.rows[i].type != null && l.rows[i].type != 'raw' ) {
				addReqModule( l.rows[i].type );
			}
			checkModulesActn( l.rows[i] );
			if ( l.rows[i].cols != null ) {
				checkModulesRec( l.rows[i] );
			}
		}
	}	
	if ( l.cols != null ) {
		for ( var i = 0; i < l.cols.length; i++ ) {
			log( 'checkModules', "col: "+ l.cols[i].columnId );
			if ( l.cols[i].type != null && l.cols[i].type != 'raw' ) {
				addReqModule( l.cols[i].type );
			}
			checkModulesActn( l.cols[i] );
			if ( l.cols[i].rows != null ){
				checkModulesRec( l.cols[i] );
			}
		}
	}		
}

function checkModulesActn( l ) {
	if ( l.actions != null ) {
		for ( var i = 0; i < l.actions.length; i++ ){
			if ( l.actions[i].type != null ) {
				addReqModule( l.actions[i].type );
			}
		}
	}
}

function addReqModule( mType ) {
	if ( ! reqModules.hasOwnProperty( mType ) ) {
		log( 'checkModules', "module: "+mType  );
		reqModules[ mType ] = mType;		
		if ( ( moduleMap[ mType ] != null ) && ( moduleMap[ mType ].requires != null ) ) {
			for ( var i = 0; i < moduleMap[ mType ].requires.length; i++ ) {
				log( 'checkModules', "requires: "+ moduleMap[ mType ].requires[i] );
				addReqModule( moduleMap[ mType ].requires[i] );
			}
		} 
	}
}


function initModules( lo ) {
	// header hooks
	if ( ( lo != null ) && ( lo.header != null ) && ( lo.header.modules != null ) ) {
		for ( var i = 0; i < lo.header.modules.length; i++ ) {
			initAModule( lo.header.modules[i] );
		}
	}
	// footer hooks
	if ( ( lo != null ) && ( lo.footer != null ) && ( lo.footer.modules != null ) ) {
		for ( var i = 0; i < lo.footer.modules.length; i++ ) {
			initAModule( lo.footer.modules[i] );
		}
	}
	ajaxOngoing--;
}

function initAModule( module ) {
	log( 'initModules', "initModules "+module.type );
	var hook = getHookMethod( "init", module.type );
	if ( hook != "" ) {
		log( 'initModules CALL', hook+"( ... )");
		eval( hook+'( "'+module.id+'", "'+module.type+'", '+JSON.stringify( module.param )+' )'  );
	}	
}

//=====================================================================================================

function setModuleData ( resId, paramObj, subPath ) {
	log( 'setModuleData', resId );
	var data = getSubData( paramObj, subPath );
	var updHook = getHook( resId, "setData" ); 
	if ( ( updHook != null ) && ( updHook.resType == "html" ) ) {	
		// update html type view
		$( "#"+resId ).html( data );
		log( 'setModuleData', 'loadResourcesHTajax' );
	} else if ( ( updHook != null ) && ( updHook.updFunction != null ) && ( updHook.updFunction != "" ) ) {
		// update module type view
		var callStr = updHook.updFunction+'( "'+resId+'", '+JSON.stringify( data )+' )';
		log( 'setModuleData', callStr );
		eval( callStr );	
	} else {
		log( 'setModuleData', "do nothing for "+resId );
	}
}


function getSubData( data, subPath ) {
	log( "getSubData",  'start ' );
	var result = data;
	if ( subPath == null ) {
		log( "getSubData",  'no subPath' );
	} else {
		log( "getSubData",  'tbl.dataDocSubPath='+subPath );
		var pathToken = subPath.split('.');
		log( "getSubData",  'pathToken[0] ' + pathToken[0] );
		var subdata = data[ pathToken[0] ];
		log( "getSubData", ">>"+JSON.stringify(subdata) );
		for ( i = 1; i < pathToken.length; i++ ) {
			log( "getSubData", 'pathToken['+i+'] ' + pathToken[i] );	
			subdata = subdata[ pathToken[i] ];
			log( "getSubData", ">>"+JSON.stringify(subdata) );
		}
		result = subdata;
	}
	return result;
}

//=====================================================================================================

function udateModuleData ( resId, paramObj ) {
	log( 'udateModuleData', resId );
	var updHook = getHook( resId, "update" ); 
	if ( ( updHook != null ) && ( updHook.resType == "html" ) ) {	
		// update html type view
		loadResourcesHTajax( resId, updHook.resURL+"/html" );
		log( 'udateModuleData', 'loadResourcesHTajax' );
	} else if ( ( updHook != null ) && ( updHook.updFunction != null ) && ( updHook.updFunction != "" ) ) {
		// update module type view
		var callStr = updHook.updFunction+'( "'+resId+'", '+JSON.stringify( paramObj )+' )';
		log( 'udateModuleData', callStr );
		eval( callStr );	
	} else {
		log( 'udateModuleData', "do nothing for "+resId );
	}
}


function getHook( resId, hookName ) {
	log( 'getUpdateDataHook', "resId="+resId+" > "+hookName );
	var hook = {};
	// resMap.push( [ id, aRow.resourceURL, (aRow.type != null ? aRow.type : 'html'), aRow.resourceParam ] ); 	
	if ( resId != null ) {
		for ( var i = 0; i < resMap.length; i++ ) {
			res = resMap[i];
			log( 'getUpdateDataHook', ">>"+res[0] );
			if 	( res[0] == resId ) {
				log( 'getUpdateDataHook', ">>"+res[0] +" "+ res[2]);
				hook.resType = res[2];
				hook.resURL  = res[1];
				if ( res[2] == "html" ) {
					log( 'getUpdateDataHook',"resType=html" );					
				} else if ( res[2] == "raw" ) {
					log( 'getUpdateDataHook',"resType=html" );									
				} else {
					hook.updFunction = getHookMethod( hookName, res[2] ) ;
					hook.resType = res[2];
					log( 'getUpdateDataHook',"resType="+res[2]+" updFunction="+hook.updFunction  );					
				}
			}
		}
	}
	return hook;	
}

//=====================================================================================================


function layoutToHTML( d ) {
	var content = [];
	content.push( '<div id="header"></div>' );
	content = content.concat( rowsToHTML( d.rows ) );
	content.push( '<div id="footer"></div>' );
	return content;
}

function loadHeaderFooter( d ) { 
	headerHTML( d.header ); 
	footerHTML( d.footer );
}

var hookCalls = [];


function headerHTML( header ) {
	var content = [];
	content.push( '<div id="header-cnt" class="header-cnt"></div>' );
	if ( header != null ) {
		if ( header.logoURL != null ) {
			content.push( '<div class="header-logo"><img src="' + $.i18n( header.logoURL ) +'"/></div>' );
		} else if ( header.logoText != null ) {
			content.push( '<div class="header-logo"><h1>' +$.i18n( header.logoText ) +'</h1></div>' );
		}
		
		// header hooks
		if ( header.modules != null ) {
			for ( var i = 0; i < header.modules.length; i++ ) {
				var hMod =  header.modules[i];
				log( 'headerHTML', "addHeaderHtml "+hMod.type );
				var hook = getHookMethod( "addHeaderHtml", hMod.type );
				if ( hook != "" ) {
					log( 'headerHTML', hook+"( ... )");
					content.push( '<div id="'+hMod.id+'" class="'+hMod.type+'"></div>' );
					if ( hMod.moduleConfig != null) {
						moduleConfig[ hMod.id ] = hMod.moduleConfig;
					}
					if ( hMod.param == null ) {
						hMod.param = {};
					}
					hMod.param.get = getUrlGETparams();

					hookCalls.push( hook+'( "'+hMod.id+'", "'+hMod.type+'", '+JSON.stringify(hMod.param)+' )'  );
				}
			}
		}
		/*
		if ( mode == "php" ) {
			content.push( '<div class="header-admin"><button id="po-mng-bt">Manage</button><button id="po-sv-bt">Save</button></div>' );	
			content.push( '<script>'
					+ '$( "#po-mng-bt" ).click( function( event ) {  $.post( "svc/layout.php", { page : pageInfo[ "layout" ], "layout" : layout } ); } ); '
					+ '$( "#po-sv-bt" ).click( function( event ) {  $.post( "svc/layout.php", { page : pageInfo[ "layout" ], "layout" : layout } ); } ); '
					+ '</script>' );
		}
		*/
		// load links 
		//TODO support target
		if ( header.linkList != null ) {
			content.push( '<div class="header-links">' );
			for ( var i = 0; i < header.linkList.length; i++ ) {
				var lnk = header.linkList[i]; 
				if ( lnk.target != null ) {
					content.push( '<a href="'+ $.i18n( lnk.url )+'" target="'+lnk.target+'"  class="transferSessionLink">'+ $.i18n( lnk.text )+'</a> 	' );
				} else {
					content.push( '<a href="'+ $.i18n( lnk.url )+'"  class="transferSessionLink">'+ $.i18n( lnk.text )+'</a> 	' );					
				}

			}
			content.push( "</div>" );
		}
	}
	$( '#header' ).html( content.join("\n") );
}

function callHooks() {
	for ( var i = 0; i < hookCalls.length; i++ ) {
		log( "callHooks", "call: "+  hookCalls[i]  );
		eval( hookCalls[i] );		
	}
}

//=====================================================================================================

function footerHTML( footer ) {
	var content = [];
	content.push( '<div class="footer-cnt"></div>' );
	if ( footer != null ) {
		// footer links
		if ( footer.linkList != null ) {
			content.push( '<div class="footer-links">' );
			for ( var i = 0; i < footer.linkList.length; i++ ) {
				var lnk = footer.linkList[i];
				if ( lnk.target != null ) {
					content.push( '<a href="'+ $.i18n( lnk.url )+'" target="'+lnk.target+'">'+ $.i18n( lnk.text )+'</a> 	' );
				} else {
					content.push( '<a href="'+ $.i18n( lnk.url )+'">'+ $.i18n( lnk.text )+'</a> 	' );					
				}
			}
			content.push( "</div>" );
		}
		if ( footer.copyrightText != null ) {
			content.push( '<div class="copyright-div">'+ $.i18n( footer.copyrightText ) +'</div>' );
		} else {
			content.push( '<div class="copyright-div">&copy; MH 2015</div>' );
		}
		
		// header hooks
		if ( footer.modules != null ) {
			for ( var i = 0; i < footer.modules.length; i++ ) {
				var fMod =  footer.modules[i];
				log( 'footerHTML', "addFooterHtml "+ fMod.type );
				var hook = getHookMethod( "addFooterHtml", fMod.type );
				if ( hook != "" ) {
					log( 'footerHTML', hook+"( ... )");
					content.push( '<div id="'+fMod.id+'" class="'+fMod.type+'"></div>' );
					
					if ( fMod.moduleConfig != null) {
						moduleConfig[ fMod.id ] = fMod.moduleConfig;
					}
					
					if ( fMod.param == null ) {
						fMod.param = {};
					}
					fMod.param.get = getUrlGETparams();
					
					hookCalls.push( hook+'( "'+fMod.id+'", "'+fMod.type+'", '+JSON.stringify(fMod.param)+' )'  );
				}
			}
		}
	}
	$( '#footer' ).html( content.join("\n") );
}

function replaceVar( str ) {
	console.log("replaceVar");
	var rStr = str;
	
	if ( str.indexOf( "{{.pongVersion}}" ) != -1 ) {
		var find = 'abc';
		var re = new RegExp( find, "{{.pongVersion}}" );

		str = str.replace( re, pongVersion );
	}
	
	return rStr;
}

function colsToHTML( colsLayout ) {
	log( 'colsToHTML', "COL >>>>>>>>>>>>>>>>>>>>>>>>LEN="+colsLayout.length );		
	var cols = [];
	for ( var i = 0; i < colsLayout.length; i++ ) {
		var aCol = colsLayout[i];
		var id = "unknown";
		if ( aCol.columnId != null ) {
			id = aCol.columnId;
		}
		log("colsToHTML", " col:"+i+" "+id );
		var style = "";
		if ( aCol.width != null ) {
			style += " width:"+aCol.width+";";
		}
		if ( aCol.resourceURL != null ) {
			cols.push( '<div id="'+id+'" class="coldiv '+(aCol.decor!=null ? 'withDecor': '')+'" style="'+style+' position:relative; height:100%;">' );
			//cols.push( id+" "+ aCol.resourceURL ); 
			cols.push( resToHTML( id, aCol, style ) );	
			resMap.push( [ id+"Content", aCol.resourceURL, (aCol.type != null ? aCol.type : 'html'), aCol.resourceParam ] );
			log( ' colsToHTML',  id+"  "+aCol.resourceURL );		
			if ( aCol.callback != null ) {
				callbackMap.push( aCol.callback );		  	  
			}
			cols.push( "</div>");
		} else if ( aCol.rows != null ) {
			cols.push( '<div id="'+id+'" class="coldiv" style="'+style+' position:relative; height:100%;">' );
			cols = cols.concat( rowsToHTML( aCol.rows ) );
			cols.push( "</div>");
		} else {
			cols.push( '<div id="'+id+'" class="coldiv" style="'+style+' position:relative; height:100%;">empty</div>' );
		}  
	}	
	log( 'colsToHTML', "COL <<<<<<<<<<<<<<<<<<<<<<<<" );		
	return cols;
}

function rowsToHTML( rowsLayout ) {
	log( 'rowsToHTML', "ROW >>>>>>>>>>>>>>>>>>>>>>>>LEN="+rowsLayout.length );		
	var rows = [];
	for ( var i = 0; i < rowsLayout.length; i++ ) {
		var aRow = rowsLayout[i];
		var id = "unknown";
		if ( aRow.rowId != null ) {
			id = aRow.rowId;
		}
		log( "rowsToHTML", " row:"+i+" Id="+id );
		var style = "";
		if ( aRow.height != null ) {
			style += " height:"+aRow.height+";";  				
		}
		if ( aRow.resourceURL != null ) {
			rows.push( '<div id="'+id+'" class="rowdiv '+(aRow.decor!=null ? 'withDecor': '')+'" style="'+style+' position:relative;">' );
			rows.push( resToHTML( id, aRow, style ) );
			resMap.push( [ id+"Content", aRow.resourceURL, (aRow.type != null ? aRow.type : 'html'), aRow.resourceParam ] ); 	
			log( ' rowsToHTML', id+"  "+aRow.resourceURL );		
			if ( aRow.callback != null ) {
				callbackMap.push( aRow.callback );		  	  
			}
			rows.push( "</div>");
		} else if ( aRow.cols != null ) {
			rows.push( '<div id="'+id+'" class="rowdiv" style="'+style+' position:relative;">' );
			rows = rows.concat( colsToHTML( aRow.cols ) );
			rows.push( "</div>");
		} else {
			rows.push( '<div id="'+id+'" class="rowdiv" style="'+style+' position:relative; height:100%;">empty</div>' );
		}
	}
	log( 'rowsToHTML', "ROW <<<<<<<<<<<<<<<<<<<<<<<<" );		
	return rows;
}

function getCorrectedHeight( height, decor ) {
	var heightCorr = height
	// test, if we can do a corredtion
	if ( ( decor != null ) && ( decorConfig[ decor ] != null ) && ( decorConfig[ decor ].heigthCorrect != null ) ) {
		var heightOrig = parseInt( height );
		var heightUnit = "";
		if ( endsWith( height, 'px' ) ) { heightUnit = "px;" }
		if ( endsWith( height, 'pt' ) ) { heightUnit = "pt;" }
		if ( endsWith( height,  '%' ) ) { heightUnit =  "%;" }
		heightCorr = heightOrig - decorConfig[ decor ].heigthCorrect;	
		heightCorr += heightUnit;
		log(  'getCorrectedHeight', '   H='+heightOrig+' cor='+ decorConfig[ decor ].heigthCorrect+'   Hc='+heightCorr );
		console.log(  'getCorrectedHeight   H='+heightOrig+' cor='+ decorConfig[ decor ].heigthCorrect+'   Hc='+heightCorr );
	} 
	return heightCorr;
	
}
	
function resToHTML( id, res, style ) {
	log("resToHTML"," > "+id );
	var html = "";
	var addCSS = "";
	if ( res.type != null ) { addCSS = res.type; }
	
	if ( res.moduleConfig != null) {
		moduleConfig[ id+'Content' ] = res.moduleConfig;
	}

	if ( res.title != null && res.decor == null ) {
		html += '<div id="'+id+'Title" class="res-title">'+res.title+'</div>';
	}
	if ( res.headerURL != null ) {
		html += '<div id="'+id+'HeaderContent" class="res-header '+addCSS+'">'+ $.i18n( res.header )+'</div>';
		resMap.push( [ id+'HeaderContent', res.headerURL, 'inner', {} ] ); 	
	}
	if ( res.decor == null ) {
		html += '<div id="'+id+'Content" class="decor-inner '+addCSS+'"></div>';		
	} else {
		var h = ""; if ( res.height != null ) { h = ' height="'+getCorrectedHeight( res.height, res.decor )+'"'; }
		html += '<div id="'+id+'Content" class="'+res.decor+' decor-inner '+addCSS+'"'+h+'></div>'+
			'<div class="'+res.decor+'-tm">'+(res.title == null ? '' : '<div id="'+id+'Title" class="decor-tm-title">'+ $.i18n( res.title )+'</div>')+'</div>'+
			'<div class="'+res.decor+'-bm"></div><div class="'+res.decor+'-lm"></div><div class="'+res.decor+'-rm"></div>'+
			'<div class="'+res.decor+'-tr"></div><div class="'+res.decor+'-tl"></div><div class="'+res.decor+'-br"></div>'+
			'<div class="'+res.decor+'-bl"></div>'+
			'<div class="'+res.decor+'-menu">';
		if ( res.modal != null ) {
			html += addDlgBtn( id, res );
		}
		if ( res.actions != null ) {
			html += addActionBtn( id, res );
		}
		html += "</div>";
		if ( res.modal != null ) {
			html += addModalDlgHT( id, res );
		}
	}
	if ( res.footerURL != null ) {
		html += '<div id="'+id+'FooterContent" class="res-footer '+addCSS+'">'+ $.i18n( res.footer )+'</div>';
		resMap.push( [ id+'FooterContent', res.footerURL, 'inner', {} ] ); 	
	}

	return html;
}

//=====================================================================================================

function addActionBtn( id, res ) {
	log( 'addActionBtn', "start");
	var html = "";
	for( var x = 0; x < res.actions.length; x++ ) {
		var action = res.actions[x];
		var name = "help";
		var txt = "?";
		var icon = "ui-iocon-help";
		var jscall = "help";
		if ( action.actionName == "fullWidth" ) {
			name = "fullWidth";
			txt = "Full width";
			icon = "ui-icon-arrow-2-e-w";
			jscall = "resViewFullWidth( \""+id+"\" );";
			html += "<button id=\""+id+name+"Bt\">"+ $.i18n( txt )+"</button>";
			html += "<script>  $(function() { $( \"#"+id+name+"Bt\" ).button( { icons:{primary: \""+icon+"\"}, text: false } ).click( "+
				"function() { "+jscall+" }); }); </script>";		

		} else if ( action.actionName == "fullScreen" ) {
			name = "fullScreen";
			txt = "Full screen";
			icon = "ui-icon-arrow-4-diag";
			jscall = "resViewFullScreen( \""+id+"\" );";
			html += "<button id=\""+id+name+"Bt\">"+ $.i18n( txt )+"</button>";
			html += "<script>  $(function() { $( \"#"+id+name+"Bt\" ).button( { icons:{primary: \""+icon+"\"}, text: false } ).click( "+
				"function() { "+jscall+" }); }); </script>";		
		} 

		// hook for generating action button code
		log( 'addActionBtn', "addActionBtn "+action.type );
		hook = getHookMethod( "addActionBtn", action.type );
		if ( hook != "" ) {
			log( 'addActionBtn', hook+"( "+action.actionName+" )");
			html += eval( hook+"( id, action.actionName, res.resourceURL, action.param )" );
			dlgMap.push( [ id, action.actionName, res.resourceURL, action.type, action.param ] );
		}
	}
	return html;
}

function addDlgBtn( id, res ) {
	var html = "";
	for( var x = 0; x < res.modal.length; x++ ) {
		var modal = res.modal[x];
		var txt = "";
		var icon = "";
		if ( modal.label != null ) {
			txt = modal.label;
			if ( modal.icon != null   ) {
				icon = "{ icons:{primary: \""+modal.icon+"\"} }";
			} 
		} else {
			txt = modal.modalName;
			if ( modal.icon != null   ) {
				icon = "{ icons:{primary: \""+modal.icon+"\"}, text: false }";
			} 
		}
		modalName = modal.modalName;
		html += "<button id=\""+id+modalName+"Bt\">"+  $.i18n( txt ) +"</button>";
		html += "<script>  $(function() { $( \"#"+id+modalName+"Bt\" ).button( "+icon+" ).click( "+
			"function() { $( \"#"+id+modalName+"Dialog\" ).dialog( \"open\" ); }); }); </script>";		
	}
	return html;
}

function addModalDlgHT( id, res ) {
	var html = "";
	// cre modal dialogs custom from resource
	for( var x = 0; x < res.modal.length; x++ ) {
		var modal = res.modal[x];
		var modalName = modal.modalName;
		var width  = "650"; if ( params!= null && params.width  != null ) { width  = params.widht; }
		var height = "500"; if ( params!= null && params.height != null ) { height = params.height; }
		dlgMap.push( [ id, modalName, res.resourceURL, "custom", modal.param ] );
		if ( modal.width  != null ) { width  = modal.width; }
		if ( modal.height != null ) { height = modal.height; }
		html += "<div id=\""+id+modalName+"Dialog\">"+$.i18n( modalName ) +"</div>";
		html += "<script> $(function() { $(  "+
			"\"#"+id+modalName+"Dialog\" ).dialog( { autoOpen: false, height: "+height+", width: "+width+" , modal: true, "+ // TODO: Refresh resource
			" buttons: { \"OK\": function() { "+id+modalName+"FormSubmit(); $( this ).dialog( \"close\" );  },"+
			" Cancel: function() { $( this ).dialog( \"close\" ); } } }); "+
			"});</script>";
	}
	return html;
}

// =====================================================================================================

function loadResourcesHT() {
	log( 'loadResourcesHT', 'resMap.length='+resMap.length );
	for( var x=0; x<resMap.length; x++ ) {
		var res = resMap[x];
		log( 'loadResourcesHT', res+" (type="+res[2]+")" );
		var divId = res[0];
		if ( res[2] == 'html' ) {
			loadResourcesHTajax( divId, res[1]+"/html" );
		} else if ( res[2] == 'raw' ) {
			loadResourcesHTajax( divId, res[1] );
		} else if ( res[2] == 'inner' ) {
			loadResourcesHTajax( divId, res[1] );
		} else {
			hook = getHookMethod( "loadResourcesHtml", res[2] );
			if ( hook != "" ) {
				log( 'loadResourcesHT', "hook="+hook );
				var param = {}; 
				if ( res[3] != null ) {
					param = res[3]; 
				}
				param.get = getUrlGETparams();
				hookCalls.push( hook+'( "'+divId+'", "'+res[1]+'", '+JSON.stringify( param )+' )'  );
				//eval( hook+"( divId, res[1], res[3] )" );
			}
		}
	}
	ajaxOngoing--;
}

function loadResourcesJS() {
	for( var x=0; x < resMap.length; x++ ) {
		var res = resMap[x];
		if ( resMap[x][2] == "html" ) { // resource type is "html"
			log( 'loadResourcesJS', res );
			loadResourcesJSajax( "#"+res[0], res[1]+"/jscript" );
		}
	}
	ajaxOngoing--;
}

function loadResourcesHTajax( resHtmlID, serviceHtURL ) { 
	ajaxOngoing++;
	$.get( serviceHtURL, { 'lang': getParam('lang') },
		function( data ) {
			log( 'loadResourcesHTajax',  "succ "+resHtmlID );
			$( "#"+resHtmlID ).html( data );
			log( 'loadResourcesHTajax', "ok "+resHtmlID+"  "+serviceHtURL );
		}
	).fail(
		function() {
			logErr( 'loadResourcesHTajax', resHtmlID+"  "+serviceHtURL );
		}
	).always(
		function() {
			log( 'loadResourcesHTajax', "done: "+resHtmlID+"  "+serviceHtURL );
			ajaxOngoing--;
		}
	);
}

function loadResourcesJSajax( resHtmlID, serviceJsURL ) {
	ajaxOngoing++;
	$.getScript( serviceJsURL, 
		function(){ 
		log( 'loadResourcesJSajax', "succ "+resHtmlID+"  "+serviceJsURL );
		}
	).always(
		function() {
			log( 'loadResourcesJSajax', "done: "+resHtmlID+"  "+serviceJsURL );
			ajaxOngoing--;
		}
	);
}

function resourceCallbacks() {
	for( var x=0; x<callbackMap.length; x++ ) {
		var fn = callbackMap[x];
		log( 'resourceCallbacks', "call"+fn );
		eval( fn );
	}
}

function resourceDialogs() {
	for( var x = 0; x < dlgMap.length; x++ ) {
		var dlg = dlgMap[x];
		creModal( dlg[0], dlg[1], dlg[2], dlg[3], dlg[4] );
	}
}

function creModal( id, modalName, resourceURL, type, param ) {
	// hook for generating action button code
	log( 'creModal', "formId "+modalName+ " "+param );
	hook = getHookMethod( "creModal", type );
	if ( hook != "" ) {
		log( 'creModal', hook+"( "+modalName+" ... )");
		eval( hook+"( id, modalName, resourceURL, param )" );
	}
}

function getValueFromRes( resURL, propName, tagId ) {
	$.get( resURL, { prop: propName } ).done( 
		 function( data ) {
			$( "#"+tagId ).attr( "value", data );
		}
	);
}

function getTextFromRes( resURL, propName, tagId ) {
	$.get( resURL, { prop: propName } ).done( 
		 function( data ) {
			$( "#"+tagId ).text( data );
		}
	);
}

function msDelay(millis) {
	var date = new Date();
	var curDate = null;
	do { 
		curDate = new Date(); 
	} while ( curDate-date < millis );
} 



function getHookMethod( hook, type ) {
	log( 'getHookMethod', "hook="+hook+" type="+type );
	var fnName = "";
	if ( ( type != null ) && ( moduleMap[ type ] != null ) && ( moduleMap[ type ].hooks != null ) )
	for ( var i = 0; i < moduleMap[ type ].hooks.length; i++ ) {
		moduleHook = moduleMap[ type ].hooks[i];
		log( 'getHookMethod', "moduleHook.hook="+moduleHook.hook );
		if ( moduleHook.hook == hook ) {
			log( 'getHookMethod', moduleHook.method+"( ... )");
			fnName = moduleHook.method;
		}
	}
	
	return fnName;
}

function getParam( name ) {
  name = name.replace( /[\[]/,"\\\[" ).replace( /[\]]/,"\\\]" );
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return decodeURIComponent( results[1].replace(/\+/g, " ") );
}

function endsWith( str, suffix ) {
	if ( str == null ) { return false; }
    return str.indexOf( suffix, str.length - suffix.length ) !== -1;
}

//Read a page's GET URL variables and return them as an object.
function getUrlGETparams() {
    var vars = {}, hash;
    var hashes = window.location.href.slice( window.location.href.indexOf('?') + 1 ).split('&');
    for( var i = 0; i < hashes.length; i++ ) {
        hash = hashes[i].split('=');
        vars[ hash[0] ] = hash[1];
    }
    //alert( JSON.stringify( vars )  );
    return vars;
}

// Return array of string values.
// Thanks to http://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript
String.prototype.splitCSV = function(sep) {
	  for (var foo = this.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
	    if (foo[x].replace(/'\s+$/, "'").charAt(foo[x].length - 1) == "'") {
	      if ((tl = foo[x].replace(/^\s+'/, "'")).length > 1 && tl.charAt(0) == "'") {
	        foo[x] = foo[x].replace(/^\s*'|'\s*$/g, '').replace(/''/g, "'");
	      } else if (x) {
	        foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
	      } else foo = foo.shift().split(sep).concat(foo);
	    } else foo[x].replace(/''/g, "'");
	  } return foo;
};

Array.prototype.inArray = function( value ){
	var i;
	for( i=0; i < this.length; i++ ) {
		if( this[i] === value ) return true;
	}
	return false;
};

var loggerModule = false; 

function log( func, msg ){
	// define the "func" you want to log to the console
	if ( func=='getHookMethod' || 
		func=='PoNG-MediaWiki' || 
		func=='Pong-Table' || 
		func=='Pong-Form' || 
		func=='layout-editor' ) { 
		console.log( "["+func+"] "+msg );
	}
	
	if ( loggerModule ) {
		ponglog_debug_out( func, msg );
	}
}

function logErr( func, msg ){
	//if ( func == '' ) { 
		console.log( "["+func+"] ERROR: "+msg );
	//}
}
