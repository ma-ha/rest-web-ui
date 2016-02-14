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

function pongEasyFormRenderHTML( divId, resourceURL, params, pmdEZ ) {
	var pmd = pongEasyFormNormalize( pmdEZ );
	pongFormRenderHTML( divId, resourceURL, params, pmd );
}

//var easyCheckboxNames = [];
//var easyCheckboxVals = [];

function pongEzFrmParseColNo( colName ) {
	var result = parseInt( colName.substr( 1, 1 ) );
	if ( result ) {
		return result;
	} else {
		return 1;
	}
}

function pongEzFrmParseId( field, colName ) {
	if ( colName.indexOf('|') < 0 ){
		field.id = colName;
		field.hidden = "true";
		return field;
	}
	
	var id = colName.substr( 3 );
	if ( id.indexOf('|') > 0 )
		id = id.substr( 0, id.indexOf('|') );
	field.id = id.replace( /~/ , "" );
	
	if ( field.id.toLowerCase() == "email" ) {
		field.type = "email";
	} else if ( field.id.toLowerCase() == "password" ) {
		field.type = "password";
	} else if ( field.id.toLowerCase() == "separator" ) {
		field.type = "separator";
	} 
	
	return field;
}

function pongEzFrmParseLabel( field, colName ) {
	var label = colName.substr( 3 );
	if ( label.indexOf('|') > 0 )
		label = label.substr( 0, label.indexOf('|') );
	field.label = label.replace( /~/g , " " );
	return field;
}

function pongEzFrmParseType( field, colName ) {
	if ( colName.indexOf('|') < 0 ) {
		field.type = "text";
		return field;
	}
	var tp = colName.substr( 3 );
	if ( tp.indexOf('|') > 0 )
		field.type = tp.substr( tp.indexOf('|') +1  );
	else {
		field.type = "text";
		return field;
	}
	
	if ( field.type.indexOf("checkbox") == 0 ) {
		var cb = field.type.substr( 9 );
		field.type  = "checkbox";
		field.name  = cb.substr( 0, cb.indexOf('_') );
		field.value = cb.substr( cb.indexOf('_') +1 );
	} else if ( field.type.indexOf("rows") > 0 ) {
		var r = parseInt( field.type );
		if ( r ) {
			field.type = "text";
			field.rows = r;			
		}
	}
	
	return field;
}

function pongEasyFormNormalize( pmd ) {
	log( "Pong-EaysForm", "start '"+pmd.description+"'");
	// create form structure to use common parser
	pmd.fieldGroups = [];
	var columns = {};
	columns.columns = [];
	var easyCols = 1;
	if ( pmd.easyFormFields != null ) {
		for ( var i = 0; i < pmd.easyFormFields.length; i++ ) {
			var nextCol = pongEzFrmParseColNo( pmd.easyFormFields[i] );
			if ( nextCol > easyCols ) {
				easyCols = nextCol;				
			}
		}
		for ( var i = 0; i < easyCols; i++ ) {
			var fieldsArr = {};
			fieldsArr.formFields = [];
			columns.columns.push( fieldsArr );
		}
		pmd.fieldGroups.push( columns );
		for ( var i = 0; i < pmd.easyFormFields.length; i++ ) {
			var fieldCol   = pongEzFrmParseColNo( pmd.easyFormFields[i] ) - 1;
			var field = {};
			field = pongEzFrmParseId( field, pmd.easyFormFields[i] );
			field = pongEzFrmParseLabel( field, pmd.easyFormFields[i] );
			if ( ! field.type ) {
				field = pongEzFrmParseType( field, pmd.easyFormFields[i] );
			}
			pmd.fieldGroups[0].columns[ fieldCol ].formFields.push( field );
		}
	}
	if ( pmd.debugAlert ){ alert( JSON.stringify( pmd, null, '\t' ) ); }
	return pmd;
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
		pongEasyFormUpdFieldsDta( divId, moduleConfig[ divId ], data ); 
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
		pongEasyFormUpdFieldsDta( divId, moduleConfig[ divId ], subdata ); 
	}
}


function pongEasyFormUpdFieldsDta( divId, pmdEZ, dta ) {
	log( "Pong-EaysForm",  'pongEasyFormUpdFieldsDta: DIV='+divId );
	var pmd = pongEasyFormNormalize( pmdEZ );
	pongFormUpdateFieldsData( divId, pmd, dta );
} 
