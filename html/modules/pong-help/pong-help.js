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
log( "PoNG-Help", "Loading Module");

function pongHelpAddActionBtn( id, modalName, resourceURL, params ) {
	log( "PoNG-Help", "modalFormAddActionBtn "+id);
	if ( ! modalName ) { modalName = "Help"; }

	sessionInfo[ id+"Help" ] = {
		"show":"ReST-help"
	}
	//var action = res.actions[x];
	var html = "";
	log( "PoNG-Help", "Std Config Dlg:  " + modalName );
	var icon = "ui-icon-help";
	var jscall = '$( "#'+id+modalName+'Dialog" ).dialog( "open" );';
	var width  = "600"; if ( params && params.width  ) { width  = params.width; }
	var height = "600"; if ( params && params.height ) { height = params.height; }
	html += '<div id="'+id+modalName+'Dialog">'+ resourceURL +" "+ modalName+"</div>";
	log( "PoNG-Help", " cfg:  height: "+height+", width: "+width );
	html += "<script> $(function() { $(  "+
		"\"#"+id+modalName+"Dialog\" ).dialog( { autoOpen: false, height: "+height+", width: "+width+" , modal: true, "+ // TODO: Refresh resource
		" buttons: { \"OK\": function() {  $( this ).dialog( \"close\" );  } } }); "+
		"});</script>";			
	html += '<button id="'+id+modalName+'Bt">'+$.i18n(modalName)+'</button>';
	html += '<script>  $(function() { $( "#'+id+modalName+'Bt" ).button( { icons:{primary: "'+icon+'"}, text: false } ).click( '+
		"function() { "+jscall+" }); }); </script>";		
	
	if ( params && params.showConfig ) {
		log( "PoNG-Help", " mode:  JSON-config / "+params.showConfig );		
		sessionInfo[ id+"Help" ].show  = "JSON-config";
		sessionInfo[ id+"Help" ].resID = params.showConfig;
	} else {
		log( "PoNG-Help", " mode: standard " ); 
	}
	
	return html;
}

function pongHelpCreModalFromMeta( id, modalName, resourceURL ) {
	log( "PoNG-Help", "Create modal view content" );
	if ( ! modalName ) { modalName = "Help"; }
		
	if ( sessionInfo[ id+"Help" ].show == "ReST-help" ) {

		log( "PoNG-Help", "Get help: '"+resourceURL+"/help'");
		var lang = getParam( 'lang' );
		if ( lang == '' ) {
			lang = "EN";
		}	
		$.get( resourceURL+"/help", { lang: lang }, 
			function( div ) {
				$(  "#"+id+modalName+"Dialog" ).html( '<div class="pong-help" style="font-size:10pt; width:100%; height:100%;">'+div+'</div>' );
				log( "PoNG-Help", "loaded" );
			}
		).fail(
			function() {
				logErr( "PoNG-Help", "you have to add help content in '"+resourceURL+"/help'" );
			}
		);
		
	} else if ( sessionInfo[ id+"Help" ].show == "JSON-config" && sessionInfo[ id+"Help" ].resID ) {
		
		log( "PoNG-Help", "Get help: Get JSON for "+sessionInfo[ id+"Help" ].resID );
		var jsonCfg = findSubJSON( layoutOrig, "", sessionInfo[ id+"Help" ].resID );	
		//$( "#"+id+modalName+"Dialog" ).html( '<textarea id="'+id+'JSONcfg" style="font-size:10pt; font-family:Courier; width:100%; height:100%;">'+JSON.stringify( jsonCfg, null, " " )+'</textarea>' );
	 	log( "PoNG-Help", "Add JSON to modal dialog." );
	    $( "#"+id+modalName+"Dialog" ).html( '<div class="syntax-div"><pre class="syntax brush-yaml">'+JSON.stringify( jsonCfg, null, "  " )+'</pre></div>' );
	 	log( "PoNG-Help", "Calling jQuery.syntax..." );
		jQuery.syntax( { theme: 'modern', blockLayout: 'fixed' } );
		log( "PoNG-Help", "Calling jQuery.syntax done" );

	} else {
		log( "PoNG-Help", "WARNING: Configuration issue!" );
	}
	log( "PoNG-Help", "Done." );
}

function findSubJSON( l, rcId, seed ) {
	log( 'PoNG-Help', " Check: "+rcId+" == "+ seed ); 
	if ( rcId == seed ) {
		log( 'PoNG-Help', " Found: "+rcId+" == "+ seed ); 
		return l;
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
