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
log( "PoNG-OnTheFly", "Loading Module");

function pongOnTheFlyAddActionBtn( id, modalName, resourceURL, params ) {
	log( "PoNG-OnTheFly", "modalFormAddActionBtn "+id);
	if ( ! modalName ) { modalName = "OnTheFly"; }
  var buttonLbl = modalName;
	if ( params && params.showConfig ) {
	  buttonLbl = 'Show the configruation of this view...';
  }
  
	// addd a config for this help
	sessionInfo[ id+"OnTheFly" ] = {};
	//var action = res.actions[x];
	var html = "";
	log( "PoNG-OnTheFly", "Std Config Dlg:  " + modalName );
	var icon = "ui-icon-pencil";
	var jscall = 'pongOnTheFlyOpenDlg( "'+id+'", "'+modalName+'", "'+resourceURL+'" );' 
	var width  = "600"; if ( params && params.width  ) { width  = params.width; }
	var height = "600"; if ( params && params.height ) { height = params.height; }
	html += '<div id="'+id+modalName+'Dialog">'+ resourceURL +" "+ modalName+"</div>";
	log( "PoNG-OnTheFly", " cfg:  height: "+height+", width: "+width );
	html += '<script> $(function() { '
		+ ' $( "#'+id+modalName+'Dialog" ).dialog( { '
		+ ' autoOpen: false, height: '+height+', width: '+width+' , modal: true, ' 
		+ ' buttons: { "'+$.i18n('Save Configuration')+'": function() { '
		+ ' pongOnTheFlySave( "'+id+'", "'+modalName+'", "'+resourceURL+'" );' 
    + ' $( this ).dialog( "close" );  '
	  + '} } '
		+' } ); '
		+ '});</script>';			
	html += '<button id="'+id+modalName+'Bt">'+$.i18n(buttonLbl)+'</button>';
	html += '<script>  $(function() { '
	  + '$( "#'+id+modalName+'Bt" ).button( { icons:{primary: "'+icon+'"}, text: false } ).click( '
	  + ' function() { '+jscall+' }); }); </script>';		
	
	if ( params && params.showConfig ) {
		log( "PoNG-OnTheFly", " mode:  JSON-config / "+params.showConfig );		
		sessionInfo[ id+"OnTheFly" ].resID = params.showConfig; // TODO: get the ID
	} else {
		log( "PoNG-OnTheFly", " mode: standard " ); 
	}
	
	return html;
}


function pongOnTheFlyOpenDlg( id, modalName, resourceURL ) {
  log( "PoNG-OnTheFly", "Open "+id+" "+modalName+" "+resourceURL );
  $.getJSON( 
      resourceURL+"/pong-list", 
      function( pluginConfig ) {
        $( '#'+id+modalName+'Dialog' ).dialog( 'open' );
        $( '#'+id+modalName+'DialogConfig').val( JSON.stringify( pluginConfig ) );
      }
    );          
}


function pongOnTheFlySave( id, modalName, resourceURL ) {
  log( "PoNG-OnTheFly", "Save "+id+" "+modalName+" "+resourceURL );
}

function pongOnTheFlyCreModalFromMeta( id, modalName, resourceURL ) {
	log( "PoNG-OnTheFly", "Create modal view content "+ resourceURL );
	if ( ! modalName ) { modalName = "OnTheFly"; }
		
	if ( resourceURL ) {
		
		log( "PoNG-OnTheFly", "Get JSON for "+sessionInfo[ id+"OnTheFly" ].resID );
		//var jsonCfg = pongOnTheFlyFindSubJSON( layoutOrig, "", sessionInfo[ id+"OnTheFly" ].resID );
	 	log( "PoNG-OnTheFly", "Add JSON to #"+id+modalName+"Dialog" );
	 	$( '#'+id+modalName+'Dialog').html( 
	 	      '<form><textarea id="'+id+modalName+'DialogConfig" class="OnTheFly-ConfField"/></form>' 
	 	    + '<form><textarea id="'+id+modalName+'DialogHelp" class="OnTheFly-HelpField"/></form>' ); 
	 	$( '#'+id+modalName+'DialogConfig').val( $.i18n( 'Could not load configuration from' )+' "'+resourceURL+'"' );
    $( '#'+id+modalName+'DialogHelp').val( $.i18n( 'No help available.' ) );
	} else {
		log( "PoNG-OnTheFly", "WARNING: Configuration issue!" );
	}
	log( "PoNG-OnTheFly", "Done." );
}
