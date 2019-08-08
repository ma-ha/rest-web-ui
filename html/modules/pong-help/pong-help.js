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
log( "PoNG-Help", "Loading Module");

function pongHelpAddActionBtn( id, modalName, resourceURL, params ) {
  log( "PoNG-Help", "modalFormAddActionBtn "+id);
  if ( ! modalName ) { modalName = "Help"; }
  var buttonLbl = modalName;
  if ( params && params.showConfig ) {
    buttonLbl = 'Show the configruation of this view...';
  }
  
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
  html += '<button id="'+id+modalName+'Bt">'+$.i18n(buttonLbl)+'</button>';
  html += '<script>  $(function() { $( "#'+id+modalName+'Bt" ).button( { icons:{primary: "'+icon+'"}, text: false } ).click( '+
    "function() { "+jscall+" }); }); </script>";    
  
  if ( params && params.showConfig ) {
    log( "PoNG-Help", " mode:  JSON-config / "+params.showConfig );    
    sessionInfo[ id+"Help" ].show  = "JSON-config";
    sessionInfo[ id+"Help" ].resID = params.showConfig;
  } else   if ( params && params.showModuleConfig ) {
    log( "PoNG-Help", " mode:  JSON-moduleConfig / "+params.showModuleConfig );    
    sessionInfo[ id+"Help" ].show  = "JSON-moduleConfig";
    sessionInfo[ id+"Help" ].resID = params.showModuleConfig;
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
    var jsonCfg = getViewConfig( sessionInfo[ id+"Help" ].resID );
    if ( jsonCfg ) {
        if ( jsonCfg.moduleConfig && jsonCfg.moduleConfig.mapKey ) {
          jsonCfg.moduleConfig.mapKey = ".....";
        }
        delete jsonCfg['actions']; //hide this dialog in config
        log( "PoNG-Help", "Add JSON to modal dialog." );
        jQuerySyntaxInsertCode( id+modalName+"Dialog", JSON.stringify( jsonCfg, null, "  " ), 'yaml', { theme: 'modern', blockLayout: 'fixed' } );
        log( "PoNG-Help", "Calling jQuery.syntax done" );
    } else {
      logErr( "PoNG-Help", "Can't find ressource with ID "+sessionInfo[ id+"Help" ].resID  );
      jQuerySyntaxInsertCode( id+modalName+"Dialog", JSON.stringify( {}, null, "  " ), 'yaml', { theme: 'modern', blockLayout: 'fixed' } );      
    }
    
  } else if ( sessionInfo[ id+"Help" ].show == "JSON-moduleConfig" && sessionInfo[ id+"Help" ].resID ) {

    var rId =  sessionInfo[ id+"Help" ].resID + 'Content'
    console.log( moduleConfig[ rId ] );
    jQuerySyntaxInsertCode( 
      id+modalName+"Dialog", 
      JSON.stringify( moduleConfig[ rId ], null, "  " ),
      'yaml', 
      { theme: 'modern', blockLayout: 'fixed' } 
    );

  } else {
    log( "PoNG-Help", "WARNING: Configuration issue!" );
  }
  log( "PoNG-Help", "Done." );
}
