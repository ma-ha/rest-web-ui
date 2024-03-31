/*
The MIT License (MIT)

Copyright (c) 2019 Markus Harms, ma@mh-svr.de

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
log( "PoNG-Upload", "load module");
var mdCfg = {}

function pongUploadDivHTML( divId, uploadURL, fparam ) {
  log( "PoNG-Upload",  "divId="+divId+" resourceURL="+uploadURL );

  var html = [];
  html.push( '<form class="UploadForm">' );
  if ( moduleConfig[ divId ] && moduleConfig[ divId ].input ) {
    for ( var inp of moduleConfig[ divId ].input ) {
      let val = ( inp.value ? '  value="'+inp.value+'" ' : '' )
      html.push( '<div id="'+divId+inp.id+'" class="pongFormField">' );
      html.push( '<label for="'+inp.id+'" class="uploadFromLabel">'+ $.i18n( inp.label )+'</label>' );
      html.push( '<input id="'+inp.id+'" name="'+inp.name+'" '+val );
      html.push( '  class="text ui-widget-content ui-corner-all UploadFileInput uploadFormInput" required="required">' );
      html.push( '</div>' );
    }
  }
  let accept = ''
  if (  moduleConfig[ divId ].accept ) { 
    accept = ' accept="'+ moduleConfig[ divId ].accept +'" ' 
  }
  html.push( '<input id="'+divId+'File" name="'+divId+'File" class="UploadFile" type="file" '+accept+' >' );
  html.push( '<button id="'+divId+'UploadBtn">'+$.i18n('Upload File')+'</button>' );
  html.push( '</form>' );
  html.push( '<script>' );
  html.push( ' $( "#'+divId+'UploadBtn" ).click( function( evt ) { ' ); 
  html.push( '   pongUploadFile( "'+divId+'", "'+uploadURL+'", '+JSON.stringify(fparam)+' );' );
  html.push( '   return false;' );
  html.push( ' }) ' );
  html.push( '</script>' );

  $( '#'+divId ).html( html.join( "\n" ) );
}

function pongUploadFile( divId, url, params ) {
  var toUpload = document.getElementById( divId+'File' ).files[0];
  if ( ! toUpload ) {
    alert( $.i18n( 'No file specified.' ) );
    return
  }

  let formData = new FormData();
  if ( moduleConfig[ divId ] && moduleConfig[ divId ].input ) {
    for ( var inp of moduleConfig[ divId ].input ) {
      if ( !  $( '#'+inp.id ).val() ||  $( '#'+inp.id ).val() == '' ) {
        alert( $.i18n( 'Please fill out all form fields.' ) );
        return
      }
      formData.append( inp.id, $( '#'+inp.id ).val() )
    }
  }
  var getParams = getUrlGETparams();
  for ( var param in getParams ) {
    if ( param != 'layout' && param != 'lang' ) {
      formData.append( param, getParams[ param ]  )
    }
  }
  formData.append( "file", toUpload )


  fetch( url, {
    method: 'POST',
    body: formData,
  }).then( response => {

    if ( moduleConfig[ divId ] && moduleConfig[ divId ].update ) {
      var upd = moduleConfig[ divId ].update;
      for ( var i = 0; i < upd.length; i++ ) {
        udateModuleData( upd[i]+'Content', params );
      }
    }

    alert( 'Upload "'+toUpload.name+'": '+response.statusText );
  })

}