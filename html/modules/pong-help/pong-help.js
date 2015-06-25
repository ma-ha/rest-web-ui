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
	//var action = res.actions[x];
	var html = "";
	log( "PoNG-Help", "Std Config Dlg:  " + modalName );
	var icon = "ui-icon-help";
	var jscall = '$( "#'+id+modalName+'Dialog" ).dialog( "open" );';
	var width  = "650"; if ( params!= null && params.width  != null ) { width  = params.widht; }
	var height = "500"; if ( params!= null && params.height != null ) { height = params.height; }
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

function pongHelpCreModalFromMeta( id, modalName, resourceURL ) {
	log( "PoNG-Help", "Get help: '"+resourceURL+"/help'");
	var lang = getParam( 'lang' );
	if ( lang == '' ) {
		lang = "EN";
	}	
	$.get( resourceURL+"/help", { lang: lang }, 
		function( div ) {
			$(  "#"+id+modalName+"Dialog" ).html( '<div class"pong-help">'+div+'</div>' );
			log( "PoNG-Help", "loaded" );
		}
	).fail(
		function() {
			logErr( "PoNG-Help", "you have to add help content in '"+resourceURL+"/help'" );
		}
	);
}