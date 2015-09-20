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


// replace pong_maps with your name and use this name also for the module JS filename

// copy this block to portal-ng-modules.js -- delete the hooks you don't need (don't forget to set comma correctly)
/*
moduleMap[ "pong_maps" ] = {
	"name": "pong_maps",
    "hooks": [
        { hook: "loadResourcesHtml", method:"pong_maps_DivHTML" },
        { hook: "addActionBtn", method:"pong_maps_pAddActionBtn" },
        { hook: "creModal", method:"pong_maps_CreModalFromMeta" },
        { hook: "updateData", method:"pong_maps_UpdateData" }
    ]
};
*/

log( "pong_maps", "load module"); // print this on console, when module is loaded



// ======= Code for "loadResourcesHtml" hook ================================================
function pong_maps_DivHTML( divId, resourceURL, paramObj ) {
	log( "pong_maps",  "divId="+divId+" resourceURL="+resourceURL );
	if ( moduleConfig[ divId ] != null ) {
		pong_maps_RenderHTML( divId, resourceURL, paramObj, moduleConfig[ divId ]  );
	} else {
		$.getJSON( 
			resourceURL+"/pong_maps", 
			function( pmd ) {
				pong_maps_RenderHTML( divId, resourceURL, paramObj, pmd );
			}
		);					
	}	
}

function pong_maps_RenderHTML( divId, resourceURL, paramObj, pmd ) {
	log( "pong_maps", "start '"+pmd.description+"'");
	var contentItems = [];
	contentItems.push( '<div id="'+divId+'_pong_maps" class="pong_maps">' );

	// TODO implement pong_maps_RenderHTML
	
	contentItems.push( '</div>' );
	// output
	$( "#"+divId ).html( contentItems.join( "\n" ) );
	log( "pong_maps", "end.");

}


/** update data call back hook */
function pong_maps_Update( divId, paramsObj ) {
	log( "pong_maps", "start '"+pmd.description+"'");
	
	// TODO implement pong_maps_Update
	
	log( "pong_maps", "end.");
}

