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
log( "PoNG-OnTheFly", "Loading Module" );


/** Init HTML and JS */
function pongOnTheFlyAddActionBtn(id, modalName, resourceURL, params) {
  log( "PoNG-OnTheFly", "modalFormAddActionBtn " + id );
  if ( !modalName ) {
    modalName = "OnTheFly";
  }
  var buttonLbl = modalName;
  if ( params && params.showConfig ) {
    buttonLbl = 'Show the configruation of this view...';
  }

  var html = "";
  log( "PoNG-OnTheFly", "Std Config Dlg:  " + modalName );
  var icon = "ui-icon-pencil";
  var paramsStr = 'null';
  if ( params ) {
    paramsStr = JSON.stringify( params )
  }
  var jscall = 'pongOnTheFlyOpenDlg( "' + id + '", "' + modalName + '", "'
      + resourceURL + '",' + paramsStr + ' );'
  var width = "600";
  if ( params && params.width ) {
    width = params.width;
  }
  var height = "600";
  if ( params && params.height ) {
    height = params.height;
  }
  html += '<div id="' + id + modalName + 'Dialog">' + resourceURL + " "
      + modalName + "</div>";
  log( "PoNG-OnTheFly", " cfg:  height: " + height + ", width: " + width );
  html += '<script> $(function() { ' + ' $( "#' + id + modalName
      + 'Dialog" ).dialog( { ' + ' autoOpen: false, height: ' + height
      + ', width: ' + width + ' , modal: true, ' + ' buttons: { "'
      + $.i18n( 'Save Configuration' ) + '": function() { '
      + ' pongOnTheFlySave( "' + id + '", "' + modalName + '", "' + resourceURL
      + '" );' + ' $( this ).dialog( "close" );  ' + '} } ' + ' } ); '
      + '});</script>';
  html += '<button id="' + id + modalName + 'Bt">' + $.i18n( buttonLbl )
      + '</button>';
  html += '<script>  $(function() { ' + 
      '$( "#' + id + modalName + 'Bt" ).button( '
      +'{ icons:{primary: "' + icon + '"}, text: false } ).click( ' 
      + ' function() { ' + jscall + ' } ); } ); </script>';

  return html;
}

/** On open: load config */
function pongOnTheFlyOpenDlg(id, modalName, resourceURL, params) {
  log( "PoNG-OnTheFly", "Open " + id + " " + modalName + " " + resourceURL );
  var viewCfg = getViewConfig( id );
  log( "PoNG-OnTheFly", "GET " + resourceURL + '/' + viewCfg.type );
  $.getJSON( resourceURL + '/' + viewCfg.type, function(pluginConfig) {
    log( "PoNG-OnTheFly", "Config loaded from " + resourceURL + '/'
        + viewCfg.type );
    $( '#' + id + modalName + 'Dialog' ).dialog( 'open' );
    $( '#' + id + modalName + 'DialogConfig' ).val(
        JSON.stringify( pluginConfig, null, "  " ) );
  } );
  if ( params && params.assistUrl ) {
    $.get( 
        params.assistUrl, 
        function(assistTxt) {
          log( "PoNG-OnTheFly", "Assistance loaded from " + params.assistUrl );
          $( '#' + id + modalName + 'DialogAssist' ).val( assistTxt );
        } 
      ).fail(
          function() { publishEvent( 'feedback', {'text': 'Can not load assistance ' } ) }
      );
  }
}


/** On close: save config and reload page */
function pongOnTheFlySave(id, modalName, resourceURL) {
  log( "PoNG-OnTheFly", "Save " + id + " " + modalName + " " + resourceURL );
  var viewCfg = getViewConfig( id );
  log( "PoNG-OnTheFly", "POST to " + resourceURL + '/' + viewCfg.type );
  $.post( 
      resourceURL + '/' + viewCfg.type + '/', 
      $( '#' + id + modalName + 'DialogConfig' ).val(), 
      function(data) {
        location.reload();
      }, 
      'text' 
    ).fail(  function(data) { alert(  $.i18n( "Can't save config back") );  } );
}


/** creae modal dialog from*/
function pongOnTheFlyCreModalFromMeta(id, modalName, resourceURL) {
  log( "PoNG-OnTheFly", "Create modal view content " + resourceURL );
  if ( !modalName ) {
    modalName = "OnTheFly";
  }

  if ( resourceURL ) {
    log( "PoNG-OnTheFly", "Get JSON for " + id );
    // var jsonCfg = pongOnTheFlyFindSubJSON( layoutOrig, "", sessionInfo[
    // id+"OnTheFly" ].resID );
    log( "PoNG-OnTheFly", "Add JSON to #" + id + modalName + "Dialog" );
    $( '#' + id + modalName + 'Dialog' ).html(
        '<form><textarea id="' + id + modalName
            + 'DialogConfig" class="OnTheFly-ConfField"/></form>'
            + '<form><textarea id="' + id + modalName
            + 'DialogAssist" class="OnTheFly-AssistField"/></form>' );
    $( '#' + id + modalName + 'DialogConfig' ).val(
        $.i18n( 'Could not load configuration from' )
          + ' "' + resourceURL + '"' );
    $( '#' + id + modalName + 'DialogAssist' ).val(
        $.i18n( 'No help available.' ) );
  } else {
    log( "PoNG-OnTheFly", "WARNING: Configuration issue!" );
  }
  log( "PoNG-OnTheFly", "Done." );
}
