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
log( "PoNG-Message", "Loading Module");

function pongMessageInit( divId, type , params ) {
  // nothing to do here
}

function pongMessageHeaderHTML( divId, type , params ) {
  log( "PoNG-Message", "start pongMessageHTML "+divId);
  // console.log( "start pongMessageHTML "+ params.resourceURL);
  if ( params != null  && params.resourceURL != null ) {
    $.get( params.resourceURL, 
      function ( data ) {
        console.log( "data="+data )
        if ( data == null ) { return; }
        pongMessageCreModal( divId, data );
      } 
    ).fail( function() { logErr( "PoNG-Message", 'Call to '+params.resourceURL +' failed' ); } );
  }
}

function pongMessageCreModal( divId, dta ) {
  // console.log( 'pongMessageCreModal diVId='+divId  )
  // console.log( 'pongMessageCreModal data='+dta  )
  if ( ! dta && !  dta.html ) return
  let divHtml = [];
  let dlgTitle  = ( dta.title     ? dta.title  : 'System Message' );
  let dlgHeight = ( dta.height    ? dta.height : '300' );
  let dlgWidth  = ( dta.width     ? dta.width  : '320' );
  let dlgButton = ( dta.buttonTxt ? dta.buttonTxt : 'Close' );
  divHtml.push( '<div id="'+divId+'Dlg" class="pongMessageDlg" title="'+dlgTitle+'">' );
  divHtml.push( dta.html );
  divHtml.push( '</div>' );
  divHtml.push( '<script>' );
  divHtml.push( '$( function() { ' );
  divHtml.push( '  $( "#'+divId+'Dlg" ).dialog( { ' );
  divHtml.push( '    autoOpen: true, height: '+dlgHeight+', width: '+dlgWidth+', modal: true, ' );
  divHtml.push( '    buttons: { ' );
  divHtml.push( '      "'+$.i18n( dlgButton )+'" : function() {  $( this ).dialog( "close" ); } ' );
  divHtml.push( '    } ' );
  divHtml.push( '  });' );  
  divHtml.push( '});' );  
  divHtml.push( '</script>' );
  // console.log(  divHtml.join( "\n" ) )
  $( "#"+divId ).html( divHtml.join( "\n" ) );
}
