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
		tbl.cols = [];
		for ( var i = 0; i < tbl.easyCols.length; i++ ) {
			var cStr = tbl.easyCols[i];
			if ( cStr.startsWith("*") ) {
				cStr = cStr.substr(1);
				tbl.rowId = cStr;
			}
			if ( cStr.indexOf("|") > 0 ) {
				//TODO
				cStr = cStr.substr( 0, cStr.indexOf("|") );
			}
			if ( cStr.indexOf("=") > 0 ) {
				//TODO
				cStr = cStr.substr( 0, cStr.indexOf("=") );
			}
			
			var col = {};
			col.id = cStr;
			col.label = cStr;
			tbl.cols.push( col );
		}
	}
	// call "old constructor"
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
