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
log( "Pong-SrcCode", "load module");

/** Main Initialization */
function pongSrcCodeDivHTML( divId, resourceURL, params ) {
	log( "Pong-SrcCode",  "pongSrcCodeDivHTML: divId="+divId+" resourceURL="+resourceURL );
	
	if  ( moduleConfig[ divId ] != null ) { 					// moduleConfig is part of structure
		
		moduleConfig[ divId ].resourceURL = resourceURL;
		pongSrcCodeDivRenderHTML( divId, resourceURL, params, moduleConfig[ divId ] );
		
	} else { 													// load moduleConfig from REST web service
		
		var metaURL =  resourceURL+"/pong-sourcecode";
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
			function( cfg ) {
			 	moduleConfig[ divId ] = cfg;
				moduleConfig[ divId ].resourceURL = resourceURL;
				pongSrcCodeDivRenderHTML( divId, resourceURL, params, cfg );
			}
		);		
	}
}

/** update data call back hook */
function pongSrcCodeUpdateData( divId, params ) {
	log( "Pong-SrcCode",  'update '+divId );
	pongSrcCodeDivRenderHTML( divId, moduleConfig[ divId ].resourceURL, params,  moduleConfig[ divId ] );
}

/** hook and used by update hook */
function pongSrcCodeSetData( divId, data, dataDocSubPath ) {
	log( "Pong-SrcCode",  'set data hook: '+divId+ " "+dataDocSubPath );
	jQuerySyntaxInsertCode( divId, data, moduleConfig[ divId ].type, moduleConfig[ divId ].options||{} );	
}

/** load source code from resourceURL and render view */
function pongSrcCodeDivRenderHTML( divId, resourceURL, params, cfg ) {
	log( "Pong-SrcCode", "load source code" );
	if ( ! cfg.type ) {  cfg.type = "plain"; }
	$.get( resourceURL, params  )
		.done( 
			function ( srcData ) {
				jQuerySyntaxInsertCode( divId, srcData, cfg.type, cfg.options||{} );	
			}
		).fail( function() { alert( "Failed to load source code." ) } ); 
}
