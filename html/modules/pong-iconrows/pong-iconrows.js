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

log( "pongIconRows", "load module"); // print this on console, when module is loaded



// ======= Code for "loadResourcesHtml" hook ================================================
function pongIconRows_DivHTML( divId, resourceURL, paramObj ) {
  log( "pongIconRows",  "Start divId="+divId+" resourceURL="+resourceURL );
  if ( moduleConfig[ divId ] != null ) {
    pongIconRows_RenderHTML( divId, resourceURL, paramObj, moduleConfig[ divId ]  );
    if ( moduleConfig[ divId ].update && parseInt( moduleConfig[ divId ].update ) != NaN ) {
      update = parseInt( moduleConfig[ divId ].update ) * 1000;
      log( "pongIconRows", ">>>>> start pongIconRowsUpdateTimer"+divId+"() every "+update+" ms" );
      setInterval( "pongIconRowsUpdateTimer"+divId+"()", update );
    }
  } else {
    let resParams = {}
    if ( paramObj && paramObj.get ) {
      resParams = paramObj.get
    }
    $.getJSON( 
      resourceURL, resParams,
      function( pmd ) {
        moduleConfig[ divId ] = pmd;
        pongIconRows_RenderHTML( divId, resourceURL, paramObj, pmd );
        if ( pmd.update && parseInt( pmd.update ) != NaN ) {
          var update = parseInt( pmd.update ) * 1000;
          log( "pongIconRows", ">>>>> start pongIconRowsUpdateTimer"+divId+"() every "+update+" ms" );
          setInterval( "pongIconRowsUpdateTimer"+divId+"()", update );
        }
      }
    );
  }  
    log( "pongIconRows",  "End divId="+divId );
}
var pongIconRows = new Array();


function pongIconRows_RenderHTML( divId, resourceURL, paramObj, pmd ) {
  log( "pongIconRows", "RenderHTML "+divId );
  pongIconRows[ divId ] = new Array();
  var lang = '';
  if ( getParam( 'lang' ) != '' ) {
    lang = "&lang=" + getParam( 'lang' ); 
  } 
  var role = '';
  if ( userRole != '' ) {
    role = "&role=" + getParam( 'role' ); 
  } 
  var contentItems = [];
  
  contentItems.push( '<div id="'+divId+'pongIconRows_Div" class="pongIconRowsDiv">' );

  if ( pmd.iconRow ) { 
    for ( var r = 0; r < pmd.iconRow.length; r++ ) {
      contentItems.push( '<div id="icon'+divId+r+'" class="pongIconRow pongIconRow'+divId+'">' );
      for ( var i = 0; i < pmd.iconRow[r].length; i++ ) {
        var icon = pmd.iconRow[r][i];
        var id = pongIconRowsGetId( icon, i );

        if ( icon.subIcons && icon.subIcons.length > 0 ) {
          contentItems.push( '<div id="icon'+divId+id+'Cat" class="pongIconRowItem pongIconRow'+divId+'CatItem" data-i=".icon'+divId+id+'CatShow">' );
        } else {
          contentItems.push( '<div id="icon'+divId+id+'" class="pongIconRowItem pongIconRow'+divId+'Item" data-i="'+icon.layout+'">' );
        }
        contentItems.push( '<img id="icon'+divId+id+'Img" class="pongIconRowImg" src="'+icon.img+'">' );
        contentItems.push( '<div id="icon'+divId+id+'Info" class="pongIconRowInfo">'+ (icon.info ? $.i18n( icon.info )  : '' ) +'</div>' );
        if ( icon.label ) { 
          contentItems.push( '<div id="'+divId+'xLabel'+i+'" class="pongIconRowLabel">'+ $.i18n( icon.label ) + '</div>' );
        }
        if ( icon.subIcons && icon.subIcons.length > 0 ) {
          contentItems.push( '<div id="icon'+divId+id+'Ptr" class="pongIconRowsPtr pongIconRowsCatHide icon'+divId+id+'CatShow" style="display:none;"></div>' );
        }
        contentItems.push( '</div>' );
      }
      contentItems.push( '</div>' );
      
      for ( var i = 0; i < pmd.iconRow[r].length; i++ ) {
        var icon = pmd.iconRow[r][i];
        var id = pongIconRowsGetId( icon, i );

        if ( icon.subIcons && icon.subIcons.length > 0 ) {
          contentItems.push( '<div id="icon'+divId+id+'CatDiv" class="pongIconRowsCatDiv pongIconRowsCatHide icon'+divId+id+'CatShow" style="display:none;">' );
          for ( var j = 0; j < icon.subIcons.length; j++ ) {
            console.log( 'j='+j );
            var subIcon = icon.subIcons[j];
            var subId = pongIconRowsGetId( subIcon, j );

            contentItems.push( '<div id="icon'+divId+id+'s'+subId+'" class="pongIconSubRowItem pongIconSubRow'+divId+'Item" data-i="'+subIcon.layout+'">' );
            contentItems.push( '<img id="icon'+divId+id+'s'+subId+'Img" class="pongIconRowImg" src="'+subIcon.img+'">' );
            contentItems.push( '<div id="icon'+divId+id+'s'+subId+'Info" class="pongIconRowInfo">'+ (subIcon.info ? $.i18n( subIcon.info )  : '' ) +'</div>' );
            if ( subIcon.label ) { 
              contentItems.push( '<div id="'+divId+'xLabel'+i+'" class="pongIconRowLabel">'+ $.i18n( subIcon.label ) + '</div>' );
            }
            contentItems.push( '</div>' );
          }
          contentItems.push( '</div>' );
        }
      }
    }

    
    contentItems.push( '</div>' );
    contentItems.push( '<script>' );
    contentItems.push( '  $( ".pongIconRow'+divId+'CatItem" ).on( "click", function() { ' );
    contentItems.push( '    var elem = $( this ).data( "i" ); ');
    contentItems.push( '   if ( $( elem ).is( ":visible" ) ) {  ');
    contentItems.push( '     $( ".pongIconRowsCatHide" ).hide( "slow" );' ); 
    contentItems.push( '   } else {' );
    contentItems.push( '     $( ".pongIconRowsCatHide" ).hide(); $( elem ).show( "slow" );' ); 
    contentItems.push( '   }' );
    contentItems.push( '  } );' );
    contentItems.push( '  $( ".pongIconRow'+divId+'Item" ).on( "click", function() { ');
    contentItems.push( '    window.location.href = "index.html?layout="+ $( this ).data( "i" ) +"'+lang+role+'";' ); //TODO
    contentItems.push( '  } );' );
    contentItems.push( '  $( ".pongIconSubRow'+divId+'Item" ).on( "click", function() { ');
    contentItems.push( '    window.location.href = "index.html?layout="+ $( this ).data( "i" ) +"'+lang+role+'";' ); //TODO
    contentItems.push( '  } );' );
    contentItems.push( '  function pongIconRowsUpdateTimer'+divId+'() {' );
    contentItems.push( '      pongIconRowsUpdate( "'+divId+'", { resourceURL:"'+resourceURL+'" } ); ' );
    contentItems.push( '  }' );
    contentItems.push( '</script>' ); 
  }
  // output
  $( "#"+divId ).html( contentItems.join( "\n" ) );  
  log( "pongIconRows", "RenderHTML end.");
}

function pongIconRowsGetId( icon, i ) {
  var id = null
  if ( icon.id ) {
    id = icon.id
  } else if ( icon.layout ) {
    id = icon.layout.replace(/\//g, '');
  } else { id = i }
  return id;
}

function pongIconRowsUpdate( divId, params ) {
  log( "pongIconRows", "Update?");
  if ( ! params || ! params.resourceURL ) return
  log( "pongIconRows", "Update ...");
  $.getJSON( 
      params.resourceURL, 
      function( pmd ) {
        moduleConfig[ divId ] = pmd;
        pongIconRows_RenderHTML( divId, params.resourceURL, null, pmd );
      }
  )
}
