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


log( "pongTree", "load module"); // print this on console, when module is loaded

var poTree = [];


// ======= Code for "loadResourcesHtml" hook ================================================
function pongTree_DivHTML( divId, resourceURL, paramObj ) {
  log( "pongTree",  "divId="+divId+" resourceURL="+resourceURL );
  if ( moduleConfig[ divId ] != null ) {
    pongTree_RenderHTML( divId, resourceURL, paramObj, moduleConfig[ divId ]  );
  } else {
    $.getJSON( 
        resourceURL+"/pongTree", 
        function( pmd ) {
          pongTree_RenderHTML( divId, resourceURL, paramObj, pmd );
        }
    );
  }
}

function pongTree_RenderHTML( divId, resourceURL, paramObj, pmd ) {
  log( "pongTree", "start '"+resourceURL+"'");
  if ( ! pmd.maxDeepth ) pmd.maxDeepth = 3;
      
  poTree[divId] = { "config":pmd };
  let contentItems = [];
  contentItems.push( '<div id="'+divId+'pongTreeDiv" class="pongTree"></div>' );
  contentItems.push( '<script>' );
  contentItems.push( '  $( "#'+divId+'pongTreeDiv" ).on( "click", ".treeLink", function() { ' );
  contentItems.push( '       pongTree_clickUpdates( $(this).data("treeid"), $(this).data("id") ); return false;   ' );
  contentItems.push( '  } );' );

  if ( pmd.pollDataSec ) {
    let pollDataSec = parseInt( pmd.pollDataSec+'' );
    if  ( ! isNaN( pollDataSec ) ) {
      contentItems.push( '  function  pongTree_UpdateTimer'+divId+'() { ' );
      contentItems.push( '    pongTree_UpdateData( "'+divId+'", '+ JSON.stringify(paramObj) +' );' );
      contentItems.push( '  }' );
      poolDataTimerId = setInterval( " pongTree_UpdateTimer"+divId+"()", pollDataSec*1000 );
    }
  }

  contentItems.push( '</script>' );
  $( "#"+divId ).html( contentItems.join( "\n" ) );
  
  pongTree_UpdateData( divId, paramObj );
  log( "pongTree", "end.");
}

function pongTree_clickUpdates( divId, objId ) {
  log( "pongTree", "clickUpdates: divId="+divId+" objId="+objId );
  if ( objId && poTree[ divId ] && poTree[ divId ].config && poTree[ divId ].config.idField  && poTree[ divId ].config.update ) {
    let pmd = poTree[ divId ].config;
    let param = {};
    param[ pmd.idField ] = objId;
    for ( let i=0; i < pmd.update.length; i++ ) {
      log( "pongTree", 'update: '+pmd.update[i]+'Content   '+JSON.stringify( param ) );
      udateModuleData( pmd.update[i]+'Content', param );
    }
  }
}


function pongTree_getTree( divId, pmd, objArr, deepth ) {
  log( "pongTree", "getTree "+deepth+"..." );
  let contentItems = [];
  for ( let i = 0; i < objArr.length; i++ ) {
    log( "pongTree", "getTree "+deepth+"/"+i );
    let t = objArr[ i ];
    if ( t && t[ pmd.labelField ] ) {
      if ( t[ pmd.idField ] ) {
        contentItems.push( '<div class="treeItem treeDepth'+deepth+'">' +
            '<a href="'+t[ pmd.idField ]+'" class="treeLink"'+
            ' data-id="'+t[ pmd.idField ]+'" data-treeid="'+divId+'">' + 
            $.i18n( t[ pmd.labelField ] ) + '</a></div>' );
      } else {
        contentItems.push( '<div class="treeItem treeDepth'+deepth+'">'+$.i18n( t[ pmd.labelField ] )+'</div>' );        
      } 
      if ( t[ pmd.treeArray ]  && deepth < pmd.maxDeepth ) {
        contentItems.push( pongTree_getTree( divId, pmd, t[ pmd.treeArray ], deepth+1 )  );
      }
    }
  }
  log( "pongTree", "getTree end." );
  return contentItems.join( "\n" );
} 


/** update data call back hook */
function pongTree_UpdateData( divId, paramObj ) {
  log( "pongTree", "udateData "+divId );
  let pmd = poTree[ divId ].config;
    if ( pmd.dataURL ) {
      log( "pongTree", 'calling '+pmd.dataURL);
      $.getJSON( 
        pmd.dataURL, 
        paramObj,
        function( treeDta ) {
          let treeHtml = "";
          if ( pmd.treeArray && treeDta[ pmd.treeArray ] ) {
            if ( pmd.titleField && treeDta[ pmd.titleField ] ) {
              treeHtml += '<div class="treeInfo">'+treeDta[ pmd.titleField ]+'</div>';
            }
            treeHtml += pongTree_getTree( divId, pmd, treeDta[ pmd.treeArray ], 0 );
            log( "pongTree", 'result: '+treeHtml);            
            $( '#'+divId+'pongTreeDiv' ).html( treeHtml );
            publishEvent( 'feedback', {'text':'Tree updated.'} );
          }
        }
      );                  
    }   
  log( "pongTree", "end.");
}
