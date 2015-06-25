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


// replace MODULENAME with your name and use this name also for the module JS filename

// copy this block to portal-ng-modules.js -- delete the hooks you don't need (don't forget to set comma correctly)
/*
moduleMap[ "MODULENAME" ] = {
	"name": "MODULENAME",
    "hooks": [
        { hook: "loadResourcesHtml", method:"MODULENAME_DivHTML" },
        { hook: "addActionBtn", method:"MODULENAME_pAddActionBtn" },
        { hook: "creModal", method:"MODULENAME_CreModalFromMeta" },
        { hook: "updateData", method:"MODULENAME_UpdateData" }
    ]
};
*/

log( "MODULENAME", "load module"); // print this on console, when module is loaded



// ======= Code for "loadResourcesHtml" hook ================================================
function MODULENAME_DivHTML( divId, resourceURL, paramObj ) {
	log( "MODULENAME",  "divId="+divId+" resourceURL="+resourceURL );
	if ( moduleConfig[ divId ] != null ) {
		MODULENAME_RenderHTML( divId, resourceURL, paramObj, moduleConfig[ divId ]  );
	} else {
		$.getJSON( 
			resourceURL+"/MODULENAME", 
			function( pmd ) {
				MODULENAME_RenderHTML( divId, resourceURL, paramObj, pmd );
			}
		);					
	}	
}

function MODULENAME_RenderHTML( divId, resourceURL, paramObj, pmd ) {
	log( "MODULENAME", "start '"+pmd.description+"'");
	var contentItems = [];
	contentItems.push( '<div id="'+divId+'MODULENAME_Div" class="MODULENAME">' );

	// TODO implement
	
	contentItems.push( '</div>' );
	// output
	$( "#"+divId ).html( contentItems.join( "\n" ) );
	log( "MODULENAME", "end.");

}


/** update data call back hook */
function MODULENAME_UpdateData( divId, paramsObj ) {
	log( "MODULENAME", "start '"+pmd.description+"'");
	
	
	log( "MODULENAME", "end.");
}


//======= Code for "addActionBtn" hook ================================================
function MODULENAME_AddActionBtn( id, modalName, resourceURL, paramObj ) {
	log( "MODULENAME", "modalFormAddActionBtn "+id);
	//var action = res.actions[x];
	var html = "";
	log( "MODULENAME", "Std Config Dlg:  " + modalName );
	var icon = "ui-icon-help"; // TODO change
	var jscall = '$( "#'+id+modalName+'Dialog" ).dialog( "open" );';
	var width  = "650"; if ( paramObj!= null && paramObj.width  != null ) { width  = paramObj.widht; }
	var height = "500"; if ( paramObj!= null && paramObj.height != null ) { height = paramObj.height; }
	html += '<div id="'+id+modalName+'Dialog">'+ resourceURL +" "+ modalName+"</div>";
	html += "<script> $(function() { $(  "+
		"\"#"+id+modalName+"Dialog\" ).dialog( { autoOpen: false, height: "+height+", width: "+width+" , modal: true, "+ // TODO: Refresh resource
		" buttons: { \"OK\": function() {  $( this ).dialog( \"close\" );  } } }); "+
		"});</script>";			
	html += '<button id="'+id+modalName+'Bt">'+modalName+'</button>';
	html += '<script>  $(function() { $( "#'+id+modalName+'Bt" ).button( { icons:{primary: "'+icon+'"}, text: false } ).click( '+
		"function() { "+jscall+" }); }); </script>";		
	return html;
}

//======= Code for "creModal" hook, requires "addActionBtn"  ================================================
function MODULENAME_CreModalFromMeta( id, modalName, resourceURL, paramObj  ) {
	log( "PoNG-Help", "Get help: '"+resourceURL+"/help'");
	var lang = getParam( 'lang' );
	if ( lang == '' ) {
		lang = "EN";
	}	
	var resourceSub = ""; // e.g. "/help"
	$.get( resourceURL+resourceSub, 
		{ lang: lang }, // other params required?
		function( divHtml ) {
			$(  "#"+id+modalName+"Dialog" ).html( '<div class"MODULENAMEmodal">'+divHtml+'</div>' );
			log( "MODULENAME", "loaded" );
		}
	).fail(
		function() {
			logErr( "MODULENAME", "Can't load modal form content from '"+resourceURL+resourceSub );
		}
	);
}
