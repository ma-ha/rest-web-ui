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
log( "PoNG-Markdown", "load module");


function pongMarkdownDivHTML( divId, contentURL, fparam ) {
  log( "PoNG-Markdown",  "divId="+divId+" resourceURL="+contentURL );
  //console.log( 'contentURL: '+contentURL)
  var url = contentURL;

  var param = {};
  
  if ( fparam != null && fparam.page != null ) {
    param = fparam;
  } else   if  ( moduleConfig[ divId ] != null ) {
    if ( moduleConfig[ divId ].page != null ) {
      param.page = moduleConfig[ divId ].page;
    } 
  }

  var pg = moduleConfig[ divId ].page
  var lang = getParam( 'lang' );
  if ( lang == '' ) {
    lang = "EN";
  }
  
  if ( pg[ lang ] ) {
    url += pg[ lang ]
  } else {
    for( var alang in pg) {
      url += pg[ alang ]
      break // get the 1st one 
    }
  }
  log( "PoNG-Markdown",  "url="+url);

  console.log( 'MD URL: ' + url)
  
    
  $.get( url, function(data) {
    var html = [];

    if ( fparam && fparam.get && fparam.get['mdedit'] ) {

      html.push( '<form class="markdownForm">' );
      html.push( '<textarea name="markdown" id="'+divId+'Texrarea" class="markdownEdit">' );
      html.push( data );
      html.push( '</textarea>' );
      html.push( '<button id="'+divId+'SaveBtn"  class="markdownSaveBtn">'+$.i18n('Save')+'</button>' );
      html.push( '</form>' );
      html.push( '<script>' );
      html.push( '  $(function() { $( "#'+divId+'SaveBtn" )');
      html.push( '    .button( ');
      html.push( '      { icons:{ primary: " ui-icon-check" } } ');
      html.push( '    ).click(  function() { ');
      html.push( '      $.post( "'+url+'", $( "#'+divId+'Texrarea" ).serialize() ) ');
      html.push( '      .done( function( resp ) { alert( resp ); return false; } ); ');
      html.push( '      return false; ');
      html.push( '    }); ');
      html.push( '  } ); ');
      html.push( '</script>' );

      var iPar = '';
      if ( fparam && fparam.get ) {
        for ( var p in fparam.get ) {
          if ( p != 'mdedit' ) {
            if ( iPar == '' ) { iPar = '?'; } else { iPar += '&'; }
            iPar +=  p + '=' +fparam.get[ p ];
          }
        }
      }
      html.push( '<div class="markdownExitLink">' );
      html.push( '<a href="index.html'+iPar+'">' + $.i18n('Exit') + '</a>' );
      html.push( '</div>' );
    
    

    } else { // Display Markdown page

      // add edit link
      if ( moduleConfig[ divId ].edit ) {
        var idxParams = '?mdedit=true'
        if ( fparam && fparam.get ) {
          for ( var p in fparam.get ) {
            
            idxParams += '&' + p + '=' +fparam.get[ p ];
          }
        }
        html.push( '<div class="markdownEditLink">' );
        html.push( '<a href="index.html'+idxParams+'">' + $.i18n('Edit') + '</a>' );
        html.push( '</div>' );
      }

      // TODO replace WIKI links

      // add the markdown as HTML
      var converter = new showdown.Converter();

      if ( moduleConfig[ divId ].options ) {
        var mdOpts = moduleConfig[ divId ].options
        for( var optKey in mdOpts ) {
          converter.setOption( optKey, mdOpts[ optKey] );
        }
      }
  
      html.push( converter.makeHtml( data ) );
  
    }

    $( '#'+divId ).html( html.join( "\n" ) );
    $( '#'+divId ).scrollTop( 0 );

  });

}
