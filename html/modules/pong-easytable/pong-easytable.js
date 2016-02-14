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
log( "Pong-EzTable", "load module");

var poTbl = [];

function pongEzTableDivHTML( divId, resourceURL, params ) {
	log( "Pong-EzTable",  "pongTableDivHTML: divId="+divId+" resourceURL="+resourceURL );
	poTbl[ divId ] = 
		{ 
			pongTableDef: null,
			divId: null, 
			pongTableStartRow: 0, 
			pongTableEndRow: 0,
			pongTableData: null, 
			pongTableFilter: "" 
		};
	
	poTbl[ divId ].divId = divId;
	
	if  ( moduleConfig[ divId ] != null ) {
		
		pongEzTableDivRenderHTML( divId, resourceURL, params, moduleConfig[ divId ] );
		
	} else {
		
		var metaURL =  resourceURL+"/pong-table";
		if ( params != null )
			if ( params.def != null ) {
				metaURL = resourceURL+"/"+params.def;
			}
			// pass get params of page to module config loader call, to enable dynamic table columns
			if ( params.get != null ) {
				var first = true;
				for (var key in params.get) {
					metaURL += (first ? "?" :"&");
					metaURL += key + "=" + params.get[ key ];
					first = false;
				}
			}
		$.getJSON( metaURL, 
			function( tbl ) {
				pongEzTableDivRenderHTML( divId, resourceURL, params, tbl );
			}
		);		
	}
}



function pongEzTableDivRenderHTML( divId, resourceURL, params, tbl ) {
	log( "Pong-EzTable", "cre table" );
	if ( tbl.easyCols && tbl.easyCols.length && ! tbl.cols ) {
		log( "Pong-EzTable", " create Pong-Table JSON sctructure" );
		tbl.cols = [];
		var autoWidhtCnt = 0;
		for ( var i = 0; i < tbl.easyCols.length; i++ ) {
			var cStr = tbl.easyCols[i];
			var col = {};
			var isId = false;
			var hasIdDef = false;
			if ( cStr.startsWith("*") ) {
				cStr = cStr.substr(1);
				isId = true;
			}
			if ( cStr.indexOf("|") > 0 ) {
				col.width = cStr.substr( cStr.indexOf("|") + 1 );
				//alert( "mod = "+mod );
				cStr = cStr.substr( 0, cStr.indexOf("|") );
			} else { autoWidhtCnt++; col.width = "20%"; }
			col.id = cStr;
			if ( cStr.indexOf("=") > 0 ) {
				col.id = cStr.substr( cStr.indexOf("=") + 1 );
				//alert( "name = "+name );
				cStr = cStr.substr( 0, cStr.indexOf("=") );
				hasIdDef = true;
			}
			col.label = cStr;
			col.cellType = "text";
			var cStrLC = cStr.toLowerCase();
			if ( cStr.indexOf( "_checkbox" ) > 0 ) {
				col.cellType = "checkbox";			
				col.label = cStr.substr( 0, cStr.length - 9 );
				if ( ! hasIdDef ) {
					col.id = cStr.substr( 0, cStr.length - 9 );					
				}
			} else if ( cStr.indexOf( "_img" ) > 0 ) {
				col.cellType = "img";								
				col.label = cStr.substr( 0, cStr.length - 4 );
				if ( ! hasIdDef ) {
					col.id = cStr.substr( 0, cStr.length - 4 );					
				}
			} else if ( cStrLC.indexOf( "image" ) >= 0 ) {
				col.cellType = "img";				
			} else if ( cStrLC.indexOf( "picture" ) >= 0 ) {
				col.cellType = "img";				
			} else if ( cStrLC.indexOf( "rating" ) >= 0 ) {
				col.cellType = "rating";				
			} else if ( cStr.indexOf( "_link" ) > 0 ) {
				col.cellType = "link";				
				col.label = cStr.substr( 0, cStr.length - 5 );
				if ( ! hasIdDef ) {
					col.id = cStr.substr( 0, cStr.length - 5 );					
				}
			} 
			col.id    = col.id.replace( /~/g , "" );
			col.label = col.label.replace( /~/g , " " );

			
			tbl.cols.push( col );
			if ( isId ) { tbl.rowId = cStr; }
		}
	}
//	if ( tbl.debugAlert ){ 
		alert( JSON.stringify( tbl, null, '\t' ) ); 
//	}
	// call "old constructor"
	log( "Pong-EzTable", " call pongTableDivRenderHTML" );
	pongTableDivRenderHTML( divId, resourceURL, params, tbl );
	
	
//	var dataUrl = resourceURL;
//	if ( tbl.dataURL != null ) {
//		dataUrl = dataUrl+"/"+tbl.dataURL;
//	}
//
//	poTbl[ divId ].pongTableDef = tbl;
//	poTbl[ divId ].resourceURL = resourceURL;
//	poTbl[ divId ].pongTableDef.dataUrlFull = dataUrl;
//	poTbl[ divId ].sortCol = ''
//	// crunch form
//	poTbl[ divId ].pongTableEndRow = tbl.maxRows;
//	
//	if ( tbl.filter != null && tbl.filter.dataReqParamsSrc != null && tbl.filter.dataReqParams != null ) {
//	...
}

/** update data call back hook */
function pongEzTableUpdateData( divId, paramsObj ) {
	log( "Pong-EzTable",  'update '+divId );
	pongTableUpdateData( divId, paramsObj );
}

/** hook and used by update hook */
function pongEzTableSetData( divId, data, dataDocSubPath ) {
	log( "Pong-EzTable",  'set data hook: '+divId+ " "+dataDocSubPath );
	pongTableSetData( divId, data, dataDocSubPath );
}
