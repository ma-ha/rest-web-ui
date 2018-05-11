/*
The MIT License (MIT)

Copyright (c) 2018 Markus Harms, ma@mh-svr.de

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
 REST-Web-GUI Framework
 A framework to create web applications and portals w/o coding and w/o application servers
 https://github.com/ma-ha/rest-web-ui
  
 former: Portal-NG (PoNG) https://mh-svr.de/mw/index.php/PoNG
*/
var labeldefs = new Array();
var PONGVER = '1.1.6';
labeldefs['PONGVER'] = PONGVER;

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
var layoutOrig = null;

pageInfo = new Array();

// will be transfered from one page to another 
sessionInfo = {};

// Security Variables
pageInfo["userRoles"] = [];
pageInfo["layout"] = -1;
pageInfo["layoutMode"] = 'desktop';
var userID = null;
var userRole = "";

var mode = '';
var directPage = 'main'; 


loggerEvents = true;
logInfo = false
logInfoStr = ''

csrfToken = 'default'
var noCache = "";

// fix "transport undefined" problem in mocha :
$.support.cors = true;

/** Because ajax loads are asynchronous, 
    we have to wait for all calls to be sinished to load HTML into DIV
    and then we have to wait to do all the callbacks */
function inits() {
	log( "init", "step="+step+" ajaxOngoing="+ajaxOngoing );
	if ( getParam( 'nc' ) == 'true' ) {
		noCache = "?nc="+ Math.random();
  }

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
			step = "loadincludes";
		} else if ( step == "loadincludes" ) {
			ajaxOngoing++;
			log( 'init', 'Start to load include JS modules ...');
			checkModules( );
			loadIncludes();
			step = "loadmodules";
		} else if ( step == "loadmodules" ) {
			ajaxOngoing++;
			log( 'init', 'Start to load JS modules ...');
			loadModules();
			if ( layout.theme != null ) {
				loadCSSrelPath( 'css-custom/'+layout.theme+'.css' );
				//jQuery('head').append('<link rel="stylesheet" rel="nofollow" href="css-custom/'+layout.theme+'.css" type="text/css" />');				
			}
			loadCSSrelPath( "css-custom/custom.css" );
			if ( pageInfo["layoutMode"] == 'tablet' ) {
				loadCSSrelPath( "css-custom/custom-t.css" );
				//jQuery('head').append('<link rel="stylesheet" rel="nofollow" href="css-custom/custom-t.css" type="text/css" />');        
			} else if ( pageInfo["layoutMode"] == 'mobile' ) {
				loadCSSrelPath( "css-custom/custom-m.css" );
				//jQuery('head').append('<link rel="st<ylesheet" rel="nofollow" href="css-custom/custom-m.css" type="text/css" />');
			} 
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
			step = "afterInit";
    } else  if ( step == "afterInit" ) {
      log( 'init', 'Start load dialogs for resources...');
      startModulesAfterPageLoad( layout );
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

function loadCSSrelPath( cssFileInclPath ) {
	var cssLnk = document.createElement( 'link' );
	cssLnk.setAttribute( 'rel', 'stylesheet' );
	cssLnk.setAttribute( 'type', 'text/css' );
	cssLnk.setAttribute( 'href', cssFileInclPath + noCache );
	document.getElementsByTagName( 'head' )[0].appendChild( cssLnk );
}

function loadCSS( cssFile ) {
	loadCSSrelPath( cssPath+cssFile );
}

function loadThemeCSS( cssFile ) {
	loadCSSrelPath( themeCssPath+cssFile );
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
    	  //alert( "version" )
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
	var avoidCache = false;
	if ( getParam( 'nc' ) == 'true' ) {
		avoidCache = true;
	}	

  var structureURLfallback = "svc/layout/"+pPage+"/structure" + ( avoidCache ?  nc = '?nc='+Math.random(): '' );
  if( mode == "php" ) {
    structureURLfallback = "svc/layout.php?page="+pPage+pEdit+ ( avoidCache ?  nc = '&nc='+Math.random(): '' );
  } else if ( mode == 'direct' ) {
    structureURLfallback =  "svc/layout/"+directPage+"/structure" + ( avoidCache ?  nc = '?nc='+Math.random(): '' );
  }
  
  // mobile detect -- to disable: just remove the script include from the index.html
  if ( typeof MobileDetect == 'function') { 
  	  var md = new MobileDetect(  navigator.userAgent );
  	  //console.log( navigator.userAgent );
  	  if ( md.tablet() ) {
        pageInfo["layoutMode"] = 'tablet';
  	    pPage = pPage +'-t';
  	  } else if ( md.mobile() ) {
  	    pageInfo["layoutMode"] = 'mobile';
        pPage = pPage +'-m';
  	  }
  }
  
  var pEdit = '';
  if ( getParam( 'edit' ) == 'true' ) {
  	pEdit = "&edit=true";
  }
  
  var structureURL = "svc/layout/"+pPage+"/structure" + ( avoidCache ?  nc = '?nc='+Math.random(): '' );
  if( mode == "php" ) {
  	structureURL = "svc/layout.php?page="+pPage+pEdit + ( avoidCache ?  nc = '&nc='+Math.random(): '' );
  } else if ( mode == 'direct' ) {
  	structureURL =  "svc/layout/"+directPage+"/structure" + ( avoidCache ?  nc = '?nc='+Math.random(): '' );
  } 
	

  console.log("loadStructure: "+structureURL);
	$.getJSON( 
	    structureURL, 
	    processLayoutResponseJSON
	).fail(
		function( jqxhr, textStatus, error ) {
		  // no layout found -- check the fallback
      ajaxOngoing++;
		  $.getJSON( 
		      structureURLfallback, 
		      processLayoutResponseJSON
		  ).fail(
		      function( jqxhr, textStatus, error ) {
		        //TODO: If "main" not found, then generate a static main page!
      			console.log( 'Request for "'+pPage+'" failed: ' + textStatus + ", " + error );
      			window.location.href = 'index.html'; 
		      }
		  ).always(
		      function() { ajaxOngoing--;  }
		  );
		}
	).always(
		function() { ajaxOngoing--; }
	);
}

function processLayoutResponseJSON( d, textStatus, xhr ) {
  layout = d.layout;
  layoutOrig = JSON.parse( JSON.stringify( layout ) ); // backup w/o modification intentions
	if ( xhr.getResponseHeader("X-Protect") ) { 
		csrfToken = xhr.getResponseHeader("X-Protect");
	}
	$.ajaxSetup( { headers: { "X-Protect": csrfToken } } ) 

  if ( d.layout.includeJS ) {
    for ( var i = 0; i < d.layout.includeJS.length; i++ ) {
      //for ( var includeJS in moduleMap[ module ].include ) {
      var includeJS = d.layout.includeJS[i];
      log( 'includeJS', 'load: '+includeJS );
      ajaxOngoing++;
        $.getScript( includeJS )
        .done( function( script, textStatus, jqxhr ) { 
          log( 'includeJS', this.url+' '+textStatus ); ajaxOngoing--; } )
        .fail( function( jqxhr, settings, exception ) { 
          log( 'includeJS', this.url+' '+exception ); ajaxOngoing--; }	);
    }
  }

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
  } else  {
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

/** build up the HTML structure of nested DIVs*/
function buildStructure( d ) {
	if ( d.header.frameWarning == "true" ) {
		if( self != top) {
			alert( 'Security Warning: This page is embedded in a frame, so it may be a "click hijacking" attack.' )
		}
	}

	$( "title" ).html( d.title );
	// crunch layout into html divs
	var contentItems = layoutToHTML( d );			
	var pagename = "";
	if ( d.page_name != null ) {
		pagename = " page"+d.page_name.replace( " ","_" );
	} 
	var theme = ( d.theme ? " "+d.theme : "" );
	$( "<div/>", 
		{ "id": "maindiv", 
		  "class": "page-width" + pagename + theme, 
			html: contentItems.join( "" ) } 
	).appendTo( "body" );
	loadHeaderFooter( d );
	if ( d.page_width ) {
		$( "head" ).append(  "<style>.page-width { width: "+d.page_width+"; }</style>" );		
	}
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


// load includes for modules
function loadIncludes() {
	for ( var module in reqModules ) {
		if ( module && module != 'pong-tableXX' ) { // just to exclude modules, for debugging it's better to include them hardcoded in index.html

			// extra CSS files
			if ( moduleMap[ module ] ) {
				if ( moduleMap[ module ].css ) {
					for ( var i = 0; i < moduleMap[ module ].css.length; i++ ) {
						log( 'loadModules', module+' add extra CSS: '+modulesPath+module+'/'+moduleMap[ module ].css[i]  );
						jQuery('head').append('<link rel="stylesheet" rel="nofollow" href="'+modulesPath+module+'/'+moduleMap[ module ].css[i] +'" type="text/css" />');
					}
				}
			
				// include files
				if ( moduleMap[ module ].include ) {
					for ( var i = 0; i < moduleMap[ module ].include.length; i++ ) {
						//for ( var includeJS in moduleMap[ module ].include ) {
						var includeJS = moduleMap[ module ].include[i];
						log( 'loadModules', module+' load include: '+modulesPath+module+'/'+includeJS );
						ajaxOngoing++;
					    $.getScript( modulesPath+module+'/'+includeJS )
							.done( function( script, textStatus, jqxhr ) { 
								log( 'loadModules', this.url+' '+textStatus ); ajaxOngoing--; } )
							.fail( function( jqxhr, settings, exception ) { 
								log( 'loadModules', this.url+' '+exception ); ajaxOngoing--; }	);
					}
				}
			}
		}
	}
	ajaxOngoing--;
}

// load modules
function loadModules() {
	for ( var module in reqModules ) {
		if ( module && module != 'pong-tableXX' ) { // just to exclude modules, for debugging it's better to include them hardcoded in index.html
			log( 'loadModules', modulesPath+module+'/'+module+".js  "+modulesPath+'/'+module+'/'+module+'.css' ); 		
			log( 'loadModules', '<link rel="stylesheet" rel="nofollow" href="'+modulesPath+module+'/'+module+'.css" type="text/css" />' );
			jQuery('head').append('<link rel="stylesheet" rel="nofollow" href="'+modulesPath+module+'/'+module+'.css" type="text/css" />');
			
			// load scripts
			ajaxOngoing++;
		    $.getScript( modulesPath+module+'/'+module+".js" )
			.done(
				function( script, textStatus ) {
					log( 'loadModules', this.url+' '+textStatus );
					ajaxOngoing--;
				}
			)
			.fail(
				function( jqxhr, settings, exception ) {
					log( 'loadModules', this.url+' '+exception );
					ajaxOngoing--;
				}
			);
		    // this is to load external CSS or JS, otherwise CSS or JS should be in module dir
		    if ( ( moduleMap[ module ] != null ) && ( moduleMap[ module ].loadCSS != null ) ) {
		    	log( 'loadModules', "loadCCS "+ JSON.stringify( moduleMap[ module ].loadCSS ) );
		    	//log( 'loadModules', "loadCCS "+ moduleMap[ module ].loadCSS.length	 );
  				for ( var i = 0; i < moduleMap[ module ].loadCSS.length; i++ ) {
  		    		log( 'loadModules', "load CSS file: "+ moduleMap[ module ].loadCSS[i] );
  					jQuery('head').append('<link rel="stylesheet" rel="nofollow" href="'+moduleMap[ module ].loadCSS[i]+'" type="text/css" />');		    		
		    	}
		    }
		    if ( ( moduleMap[ module ] != null ) && ( moduleMap[ module ].loadJS != null ) ) {
		    	log( 'loadModules', "loadJS" );
				for ( var i = 0; i < moduleMap[ module ].loadJS.length; i++ ) {
		    		log( 'loadModules', "load JS: "+ moduleMap[ module ].loadJS[i] );
					ajaxOngoing++;
				    $.getScript( moduleMap[ module ].loadJS[i] )
						.done( function( script, textStatus ) { log( 'loadModules', this.url+' '+textStatus ); ajaxOngoing--; } )
						.fail( function( jqxhr, settings, exception ) { log( 'loadModules', this.url+' '+exception ); ajaxOngoing--; } );
		    	}
		    }

		    
		}
	}
	ajaxOngoing--;
}


function checkModules() {
	log( 'loadModules', 'checkModules' );
	// allways req modules
	addReqModule( "i18n" );
	addReqModule( "pong-security" );
	// header modules
	if ( layout != null  && layout.header != null  && layout.header.modules != null )
	for ( var i=0; i< layout.header.modules.length; i++ ) {
	  if ( layout.header.modules[i] ) 
		addReqModule( layout.header.modules[i].type );
	}
	// footer modules
	if ( layout != null  && layout.footer != null  && layout.footer.modules != null )
	for ( var i=0; i< layout.footer.modules.length; i++ ) {
      if ( layout.footer.modules[i] ) 
		addReqModule( layout.footer.modules[i].type );
	}
	// modules of rows and cols
	checkModulesRec( layout );	
}

function checkModulesRec( l ) {
  if ( l.rows != null ) {
    for ( var i = 0; i < l.rows.length; i++ ) {
      log( 'loadModules', "row: "+ l.rows[i].rowId );
      if ( l.rows[i].type != null && l.rows[i].type != 'raw' ) {
        addReqModule( l.rows[i].type );
      }
      checkModulesActn( l.rows[i] );
      if ( l.rows[i].cols || l.rows[i].tabs ) {
        checkModulesRec( l.rows[i] );
      }
    }
  }  
  if ( l.cols != null ) {
    for ( var i = 0; i < l.cols.length; i++ ) {
      log( 'loadModules', "col: "+ l.cols[i].columnId );
      if ( l.cols[i].type != null && l.cols[i].type != 'raw' ) {
        addReqModule( l.cols[i].type );
      }
      checkModulesActn( l.cols[i] );
      if ( l.cols[i].rows || l.cols[i].tabs ){
        checkModulesRec( l.cols[i] );
      }
    }
  }
  if ( l.tabs ) {
    for ( var i = 0; i < l.tabs.length; i++ ) {
      log( 'loadModules', "tabs: "+ l.tabs[i].tabId );
      if ( l.tabs[i].type  &&  l.tabs[i].type != 'raw' ) {
        addReqModule( l.tabs[i].type );
      }
      checkModulesActn( l.tabs[i] );
      if ( l.tabs[i].rows ){
        checkModulesRec( l.tabs[i] );
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
    log( 'loadModules', "identified required module: "+mType  );
    reqModules[ mType ] = mType;    
    if ( ( moduleMap[ mType ] != null ) && ( moduleMap[ mType ].requires != null ) ) {
      for ( var i = 0; i < moduleMap[ mType ].requires.length; i++ ) {
        log( 'loadModules', mType+" requires: "+ moduleMap[ mType ].requires[i] );
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
  if ( module ) {
  log( 'initModules', "initModules "+module.type );
  var hook = getHookMethod( "init", module.type );
  if ( hook != "" ) {
    log( 'initModules CALL', hook+"( ... )");
    eval( hook+'( "'+module.id+'", "'+module.type+'", '+JSON.stringify( module.param )+' )'  );
  }  
  }
}

//=====================================================================================================

function startModulesAfterPageLoad( lo ) {
  // header hooks
  if ( ( lo != null ) && ( lo.header != null ) && ( lo.header.modules != null ) ) {
    for ( var i = 0; i < lo.header.modules.length; i++ ) {
      startModuleAfterPageLoad( lo.header.modules[i] );
    }
  }
  // footer hooks
  if ( ( lo != null ) && ( lo.footer != null ) && ( lo.footer.modules != null ) ) {
    for ( var i = 0; i < lo.footer.modules.length; i++ ) {
      startModuleAfterPageLoad( lo.footer.modules[i] );
    }
  }
  ajaxOngoing--;
}

function startModuleAfterPageLoad( module ) {
  if ( module ) {
  log( 'startModuleAfterPageLoad', "Modules "+module.type );
  var hook = getHookMethod( "afterPageLoad", module.type );
  if ( hook != "" ) {
    log( 'startModuleAfterPageLoad', 'Call '+hook+"( ... )");
    eval( hook+'( "'+module.id+'", "'+module.type+'", '+JSON.stringify( module.param )+' )'  );
  } 
  }
}

//=====================================================================================================

function setModuleData ( resId, paramObj, subPath ) {
	log( 'setModuleData', resId+"/"+subPath+" => "+JSON.stringify(paramObj) );
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
  var laCls = '';
  var layoutId = '';
  if ( d.layoutId && d.layoutId != '' ) { 
    laCls = ' class="'+d.layoutId+'"'; 
    layoutId = d.layoutId; 
  }
	content.push( '<div id="header" '+laCls+'></div>' );
	content = content.concat( rowsToHTML( d.rows, d.page_width, layoutId ) );
	content.push( '<div id="footer" '+laCls+'></div>' );
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
	    if ( header.logoURL && header.logoText ) {
          content.push( '<div class="header-logo">' );
          content.push( '<div class="header-logo-url"><img src="' + $.i18n( header.logoURL ) +'"/></div>' );
          content.push( '<div class="header-logo-text">' +$.i18n( header.logoText ) +'</div>' );
          content.push( '</div>' );
	    } else if ( header.logoURL ) {
	      content.push( '<div class="header-logo"><img src="' + $.i18n( header.logoURL ) +'"/></div>' );
		} else if ( header.logoText ) {
		  content.push( '<div class="header-logo"><h1>' +$.i18n( header.logoText ) +'</h1></div>' );
		}
		
		// header hooks
		if ( header.modules != null ) {
			for ( var i = 0; i < header.modules.length; i++ ) {
			  if ( header.modules[i] ) {
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
		}
		// load links 
		if ( header.linkList != null ) {
			content.push( '<div class="header-links">' );
			for ( var i = 0; i < header.linkList.length; i++ ) {
			  if ( header.linkList[i] ) {
				var lnk = header.linkList[i]; 
				if ( lnk.target != null ) {
					content.push( '<a href="'+ $.i18n( lnk.url )+'" target="'+lnk.target+'"  class="transferSessionLink">'+ $.i18n( lnk.text )+'</a> 	' );
				} else {
					content.push( '<a href="'+ $.i18n( lnk.url )+'"  class="transferSessionLink">'+ $.i18n( lnk.text )+'</a> 	' );					
				}
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
        if ( footer.linkList[i] ) {
        var lnk = footer.linkList[i];
        if ( lnk.target != null ) {
          content.push( '<a href="'+ $.i18n( lnk.url )+'" target="'+lnk.target+'">'+ $.i18n( lnk.text )+'</a> 	' );
        } else {
          content.push( '<a href="'+ $.i18n( lnk.url )+'">'+ $.i18n( lnk.text )+'</a> 	' );          
        }
        }
      }
      content.push( "</div>" );
    }
    if ( footer.copyrightText != null ) {
      content.push( '<div class="copyright-div">'+ $.i18n( footer.copyrightText ) +'</div>' );
    } else {
      content.push( '<div class="copyright-div">&copy; MH 2018</div>' );
    }
    
    // header hooks
    if ( footer.modules != null ) {
      for ( var i = 0; i < footer.modules.length; i++ ) {
        if ( footer.modules[i] ) {
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

function colsToHTML( colsLayout, h, laCls ) {
  log( 'colsToHTML', "COL >>>>>>>>>>>>>>>>>>>>>>>>LEN="+colsLayout.length );    
  var cols = [];
  for ( var i = 0; i < colsLayout.length; i++ ) {
    var aCol = colsLayout[i];
    var id = "unknown";
    if ( aCol.columnId != null ) {
      id = aCol.columnId;
    }
    log("colsToHTML", " col:"+i+" "+id );
    if ( aCol.width != null ) {
      $( "#viewSizes" ).append(  "#"+id+" { width: "+aCol.width+"; }" );
    }
    if ( h != null ) {
      $( "#viewSizes" ).append(  "#"+id+" { height: "+h+"; }" );
      aCol.height = h;
    }
    if ( aCol.resourceURL != null ) {
      cols.push( '<div id="'+id+'" class="coldiv '+laCls+' '+(aCol.decor!=null ? 'withDecor': '')+'">' );
      $( "#viewSizes" ).append( "#"+id+" { position:relative; height:100%; }" );
      //cols.push( id+" "+ aCol.resourceURL ); 
      cols.push( resToHTML( id, aCol, '', laCls ) );  
      resMap.push( [ id+"Content", aCol.resourceURL, (aCol.type != null ? aCol.type : 'html'), aCol.resourceParam ] );
      log( ' colsToHTML',  id+"  "+aCol.resourceURL );    
      if ( aCol.callback != null ) {
        callbackMap.push( aCol.callback );          
      }
      cols.push( "</div>");
    } else if ( aCol.rows != null ) {
      cols.push( '<div id="'+id+'" class="coldiv '+laCls+'">' );
      $( "#viewSizes" ).append( "#"+id+" { position:relative; height:100%; }" );
      cols = cols.concat( rowsToHTML( aCol.rows, aCol.width, laCls ) );
      cols.push( "</div>");
    } else if ( aCol.tabs != null  &&  aCol.tabs.constructor === Array ) {
      $( "#viewSizes" ).append( "#"+id+" { position:relative; height:100%; }" );
      cols.push( '<div id="'+id+'" class="tabDiv tabColDiv'+laCls+'">' );
      cols = cols.concat( tabsToHTML( aCol, 'aTabRowDiv' ) );
      cols.push( "</div>");
      cols.push( '<script>  $(function() { $( "#'+id+'" ).tabs(); }); </script>' ); 
      $( "#viewSizes" ).append( "#"+id+" { border: 0px; }" );
    } else {
      cols.push( '<div id="'+id+'" class="coldiv '+laCls+'">empty</div>' );
      $( "#viewSizes" ).append( "#"+id+" { position:relative; height:100%; }" );
    }  
  }  
  log( 'colsToHTML', "COL <<<<<<<<<<<<<<<<<<<<<<<<" );    
  return cols;
}

function rowsToHTML( rowsLayout, w, laCls ) {
  log( 'rowsToHTML', "ROW >>>>>>>>>>>>>>>>>>>>>>>>LEN="+rowsLayout.length );
  var rows = [];
  for ( var i = 0; i < rowsLayout.length; i++ ) {
    var aRow = rowsLayout[i];
    var id = "unknown";
    if ( aRow.rowId != null ) {
      id = aRow.rowId;
    }
    log( "rowsToHTML", " row:"+i+" Id="+id );
    if ( aRow.height != null ) {
      $( "#viewSizes" ).append( "#"+id+" { height: "+aRow.height+"; }" );
    }
    if ( aRow.resourceURL != null ) {
      rows.push( '<div id="'+id+'" class="rowdiv '+laCls+' '+(aRow.decor!=null ? 'withDecor': '')+'">' );
      $( "#viewSizes" ).append( "#"+id+" { position:relative; }" );
      rows.push( resToHTML( id, aRow, '', laCls ) );
      resMap.push( [ id+"Content", aRow.resourceURL, (aRow.type != null ? aRow.type : 'html'), aRow.resourceParam ] );
      log( ' rowsToHTML', id+"  "+aRow.resourceURL );
      if ( aRow.callback != null ) {
        callbackMap.push( aRow.callback );
      }
      rows.push( "</div>");
    } else if ( aRow.cols != null ) {
      rows.push( '<div id="'+id+'" class="rowdiv '+laCls+'">' );
      $( "#viewSizes" ).append( "#"+id+" { position:relative; }" );
      rows = rows.concat( colsToHTML( aRow.cols, aRow.height, laCls ) );
      rows.push( "</div>");
    } else if ( aRow.tabs != null  &&  aRow.tabs.constructor === Array ) {
      $( "#viewSizes" ).append( "#"+id+" { position:relative; }" );
      rows.push( '<div id="'+id+'" class="tabDiv '+laCls+'">' );
      rows = rows.concat( tabsToHTML( aRow, 'aTabRowDiv' ) );
      rows.push( "</div>");
      rows.push( '<script>  $(function() { $( "#'+id+'" ).tabs(); }); </script>' );
    } else {
      rows.push( '<div id="'+id+'" class="rowdiv '+laCls+'">empty</div>' );
      $( "#viewSizes" ).append( "#"+id+" { position:relative; height:100%; }" );
    }
  }
  log( 'rowsToHTML', "ROW <<<<<<<<<<<<<<<<<<<<<<<<" );
  return rows;
}


function tabsToHTML( def, cls ) {
  var tabs = def.tabs
  var div = [];
  div.push( '<ul>' );
  for ( var i = 0; i < tabs.length; i++ ) {
    div.push( '<li><a href="#'+tabs[i].tabId+'TabDiv">'+$.i18n( tabs[i].title )+'</a></li>' );
  }
  div.push( '</ul>' );
  for ( var i = 0; i < tabs.length; i++ ) {
    var addCSS = ""; 
    if ( tabs[i].type ) { addCSS = tabs[i].type; }
    div.push( '<div id="'+tabs[i].tabId+'TabDiv" class="'+cls+'">' );
    tabs[i].decor = 'none';
    tabs[i].title = null;
    div.push( resToHTML( tabs[i].tabId, tabs[i], '', '' ) );
    div.push( '</div>' );
    if ( tabs[i].resourceURL ) {
      resMap.push( [ tabs[i].tabId+"Content", tabs[i].resourceURL, (tabs[i].type != null ? tabs[i].type : 'html'), tabs[i].resourceParam ] );
      log( 'tabsToHTML',  tabs[i].tabId +"  "+ tabs[i].resourceURL );    
      if ( tabs[i].callback != null ) {
        callbackMap.push( tabs[i].callback );          
      }
    }
    var height = '';
    if ( def.height && endsWith( def.height, 'px' )  ) { // subtract header height  = 44px
      height =  'height: '+ ( parseInt( def.height ) - 44 ) + 'px;' ;
    }
    var width = 'width: 100%;';
    if ( def.width && endsWith( def.width, 'px' )  ) { // subtract header height  = 44px
      width =  'width: '+ def.width;
    }
    $( "#viewSizes" ).append( '#'+tabs[i].tabId+'TabDiv {'+ height + width +' padding: 0px; }' );
    $( "#viewSizes" ).append( '#'+tabs[i].tabId+'Content { height: 100%; width: 100%; overflow:auto; }' );
  }
  return div;
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
  } 
  return heightCorr;
  
}
  
function resToHTML( id, res, style, laCls ) {
  log("resToHTML"," > "+id );
  var html = "";
  var addCSS = laCls+" ";
  if ( res.type != null ) { addCSS = res.type; }

  if ( layout.decor ) { res.decor = layout.decor; }
  
  if ( res.moduleConfig != null) {
    moduleConfig[ id+'Content' ] = res.moduleConfig;
  }

  if ( res.headerURL != null ) {
    html += '<div id="'+id+'HeaderContent" class="res-header '+addCSS+'">'+ $.i18n( res.header )+'</div>';
    resMap.push( [ id+'HeaderContent', res.headerURL, 'inner', {} ] );   
  }
  if ( res.decor == null ) {
    if ( res.title != null ) {
      html += '<div id="'+id+'Title" class="res-title '+laCls+'">'+$.i18n( res.title )+'</div>';
      res.decor = 'decor'
    }
    if ( res.height != null ) { 
      $( "#viewSizes" ).append( "#"+id+"Content { height: "+getCorrectedHeight( res.height, res.decor )+"; }" );      
    }
    html += '<div id="'+id+'Content" class="decor-inner '+addCSS+'"></div>';    
  } else if ( res.decor == 'none' ) {
    if ( res.title != null ) {
      html += '<div id="'+id+'Title" class="res-title">'+$.i18n( res.title )+'</div>';
    }
    html += '<div id="'+id+'Content" class="'+addCSS+'"></div>';    
  } else {
    if ( res.height != null ) { 
      $( "#viewSizes" ).append( "#"+id+"Content { height: "+getCorrectedHeight( res.height, res.decor )+"; }" );      
    }
    html += '<div id="'+id+'Content" class="'+res.decor+' decor-inner '+addCSS+'"></div>'+
      '<div class="'+res.decor+'-tm">'+(res.title == null ? '' : '<div id="'+id+'Title" class="decor-tm-title">'+ $.i18n( res.title )+'</div>')+'</div>'+
      '<div class="'+res.decor+'-bm"></div><div class="'+res.decor+'-lm"></div><div class="'+res.decor+'-rm"></div>'+
      '<div class="'+res.decor+'-tr"></div><div class="'+res.decor+'-tl"></div><div class="'+res.decor+'-br"></div>'+
      '<div class="'+res.decor+'-bl"></div>'+
      '<div class="'+res.decor+'-menu">';
    if ( res.modal != null ) {
      html +=  '<div class="menuBtn">'+addDlgBtn( id, res ) +"</div>";
    }
    if ( res.actions != null ) {
      html += '<div class="menuBtn">'+addActionBtn( id, res )+"</div>";
    }
    // view required action ?
    var hook = getHookMethod( "addActionBtn", res.type );
    if ( hook != "" ) {
      log( 'addActionBtn', id+" "+hook);
      html += '<div class="menuBtn">'+ eval( hook+"( id, '', res.resourceURL, {} )" ) + '</div>';
      //dlgMap.push( [ id, "", res.resourceURL, "", {} ] );
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
      $( "#"+divId ).addClass( "htmldiv" );
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
  var params = getUrlGETparams()
  if (! params.lang ) { // more or less backward compatibility
    params.lang =  getParam('lang')
  }
  $.get( serviceHtURL, params,
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
		//log( 'getHookMethod', "moduleHook.hook="+moduleHook.hook );
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
        // switch on console logging
        if ( hash[0] == 'info') { logInfo = true  }
        if ( hash[0] == 'info' && hash[1] && hash[1] != '') { logInfoStr = hash[1] }
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

//=====================================================================================================

function getViewConfig( resId ) {
  return findSubJSON( layoutOrig, "", resId );
}

function findSubJSON( l, rcId, seed ) {
  log( 'PoNG-Help', " Check: "+rcId+" == "+ seed ); 
  if ( rcId == seed ) {
    log( 'PoNG-Help', " Found: "+rcId+" == "+ seed ); 
    return JSON.parse( JSON.stringify( l ) );
  }
  if ( l.rows != null ) {
    for ( var i = 0; i < l.rows.length; i++ ) {
      log( 'PoNG-Help', "row: "+ l.rows[i].rowId );
      var cfg = findSubJSON( l.rows[i], l.rows[i].rowId, seed );
      if ( cfg ) { return cfg; }
    }
  } 
  if ( l.cols != null ) {
    for ( var i = 0; i < l.cols.length; i++ ) {
      log( 'PoNG-Help', "col: "+ l.cols[i].columnId );
      var cfg = findSubJSON( l.cols[i], l.cols[i].columnId, seed );
      if ( cfg ) {  return cfg; }
    }
  } 
  return null;
}

//=====================================================================================================

function getSubData( data, subPath ) {
	log( "getSubData",  'start ' );
	log( "getSubData",  JSON.stringify(data) );
	var result = data;
	if ( subPath == null ) {
		log( "getSubData",  'no subPath' );
	} else {
		log( "getSubData",  'tbl.dataDocSubPath='+subPath );
		var pathToken = subPath.split('.');
		log( "getSubData",  'pathToken[0] ' + pathToken[0] );
		var subdata = data[ pathToken[0] ];
		log( "getSubData", ">>"+JSON.stringify(subdata) );
		for ( var i = 1; i < pathToken.length; i++ ) {
			log( "getSubData", 'pathToken['+i+'] ' + pathToken[i] );
			if ( subdata != null ) {
				subdata = subdata[ pathToken[i] ];
				log( "getSubData", ">>"+JSON.stringify(subdata) );				
			} else {
				log( "getSubData", ">> NULL" );				
			}
		}
		result = subdata;
	}
	return result;
}

//=====================================================================================================

var loggerModule = false; 
var feedbackModule = false; 
var loggerBuffer = [];

//=====================================================================================================
function log( func, msg ){
  var logline = '['+func+'] '+msg;

  if ( logInfo ) {
    if ( logInfoStr == '' ) {
      console.log( logline );      
    } else if ( logInfoStr.indexOf( func ) >= 0 ) { 
      console.log( logline );
    }
  }

  // send log to event broker
  if ( loggerEvents ) { 
    var logBroker = getEventBroker('log');
    logBroker.cleanupQueue( 1000 );
  	logBroker.queueEvent( { text: logline, channel:'log' } );
  }
	
}

function logErr( func, msg ){
	console.log( "["+func+"] ERROR: "+msg );
	
  if ( loggerEvents ) { 
  	var logBroker = getEventBroker('log');
    logBroker.cleanupQueue( 1000 );
    logBroker.queueEvent( { text: '['+func+'] '+msg, channel:'log', severity:'ERROR' } );
  }
}

// =====================================================================================================
// Integrated pub-sub event broker
// based on  https://github.com/philbooth/pub-sub.js

eventBrokers = {}

/** short cut function */
function publishEvent( channelName, eventObj ) {
  var broker = getEventBroker( 'main' )
  eventObj.channel = channelName
  broker.publish( eventObj ); 
}

/** short cut function */
function subscribeEvent( channelName, callbackFunction ) {
  var broker = getEventBroker( 'main' )
  broker.subscribe( 
      { 
        'channel':channelName, 
        'callback':callbackFunction 
      } 
  );  
}

/** pub/sub event broker impl */
function getEventBroker (id) {
    var subscriptions = {
          'main': []
      }
    var cleanupInProgress = false;

//      check.verifyUnemptyString(id, 'Invalid id');
    if (typeof eventBrokers[id] === 'undefined') {
        eventBrokers[id] = {
            id:id,
            subscribe: subscribe,
            unsubscribe: unsubscribe,
            publish: publish,
            evtQueue : [],
            queueEvent: queueEvent,
            cleanupQueue: cleanupQueue
        };
    }
    return eventBrokers[id];

    function subscribe (args) {
      //console.log( "subscribe "+ args.channel )
      if ( args && args.channel && typeof args.callback === 'function' ) {
        addSubscription( args.channel, args.callback )            
        // ... and now send notifications for queued events
        for( var i = 0; i < this.evtQueue.length; i++ ) {
          var qEvt = this.evtQueue[i].event 
            if ( qEvt && qEvt.channel == args.channel ) {
              notifySubscriptions( qEvt, qEvt.channel );        
            }
        }
      }
    }

    function verifyArgs (args) {
//          check.verifyObject(args, 'Invalid arguments');
//          check.verifyUnemptyString(args.name, 'Invalid name');
//          check.verifyFunction(args.callback, 'Invalid callback');
    }

    function addSubscription ( channel, callback) {
      //sconsole.log( 'subscribe '+channel )
      if (typeof subscriptions[channel] === 'undefined') {
          subscriptions[channel] = [];
      }
      subscriptions[channel].push(callback);
      console.log( 'subscribed: '+channel )
    }

    function unsubscribe (args) {
      verifyArgs(args);
      removeSubscription(args.name, args.callback);
    }

    function removeSubscription (eventName, callback) {
      var i, eventSubscriptions = subscriptions[eventName];
      for (i = 0; i < eventSubscriptions.length; i += 1) {
          if (eventSubscriptions[i] === callback) {
              eventSubscriptions.splice(i, 1);
              break;
          }
      }
    }
    
    function queueEvent( event ) {
      var queuedEvent = {
          event: event,
          created: new Date(),
          unqueue: false
      }
      this.evtQueue.push( queuedEvent )
      publish( event )
    }
    
    
    function cleanupQueue( maxCnt ) {
      if ( ! cleanupInProgress ) { // don't run two cleanups in parallel
        cleanupInProgress = true;
        
        // remove old events from queue  
        if ( maxCnt && this.evtQueue.length > maxCnt ) {
          this.evtQueue.splice( 0, this.evtQueue.length - maxCnt )           
        }
        
        // remove unqueued events from queue  
        for( var i = this.evtQueue.length; i >= 0;  i-- ) {
          if ( this.evtQueue[i] && this.evtQueue[i].unqueue ) {
            array.splice(i,0)
          }
        }
        cleanupInProgress = false;   
      }
    }
    
    function publish (event) {
      //notifySubscriptions( event, '*' );
      notifySubscriptions( event, event.channel );
    }

    function notifySubscriptions (event, channel ) {
      if ( subscriptions[channel] ) {
        var eventSubscriptions = subscriptions[channel], i;
        for (i = 0; i < eventSubscriptions.length; i += 1) {
           eventSubscriptions[i](event);
        } 
      }
    }
}
 