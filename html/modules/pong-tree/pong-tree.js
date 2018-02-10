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

// copy this block to portal-ng-modules.js -- delete the hooks you don't need (don't forget to set comma correctly)
/*
moduleMap[ "pong-tree" ] = {
	"name": "pong-tree",
    "hooks": [
        { hook: "loadResourcesHtml", method:"pongTree_DivHTML" },
        { hook: "addActionBtn", method:"pongTree_pAddActionBtn" },
        { hook: "creModal", method:"pongTree_CreModalFromMeta" },
        { hook: "updateData", method:"pongTree_UpdateData" }
    ]
};
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
	var contentItems = [];
	contentItems.push( '<div id="'+divId+'pongTreeDiv" class="pongTree"></div>' );
  contentItems.push( '<script>' );
	contentItems.push( '  $( "#'+divId+'pongTreeDiv" ).on( "click", ".treeLink", function() { ' );
  contentItems.push( '       pongTree_clickUpdates( $(this).data("treeid"), $(this).data("id") ); return false;   ' );
  contentItems.push( '  } );' );
  contentItems.push( '</script>' );
  $( "#"+divId ).html( contentItems.join( "\n" ) );
	
  pongTree_UpdateData( divId, paramObj );
    
	log( "pongTree", "end.");
}

function pongTree_clickUpdates( divId, objId ) {
  log( "pongTree", "clickUpdates: divId="+divId+" objId="+objId );
  if ( objId && poTree[ divId ] && poTree[ divId ].config && poTree[ divId ].config.idField  && poTree[ divId ].config.update ) {
    var pmd = poTree[ divId ].config;
    var param = {};
    param[ pmd.idField ] = objId;
    for ( var i=0; i < pmd.update.length; i++ ) {
      log( "pongTree", 'update: '+pmd.update[i]+'Content   '+JSON.stringify( param ) );
      udateModuleData( pmd.update[i]+'Content', param );
    }
  }
}


function pongTree_getTree( divId, pmd, objArr, deepth ) {
  log( "pongTree", "getTree "+deepth+"..." );
  var contentItems = [];
  for ( var i = 0; i < objArr.length; i++ ) {
    log( "pongTree", "getTree "+deepth+"/"+i );
    var t = objArr[ i ];
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
	var pmd = poTree[ divId ].config;
    if ( pmd.dataURL ) {
      log( "pongTree", 'calling '+pmd.dataURL);
      $.getJSON( 
        pmd.dataURL, 
        paramObj,
        function( treeDta ) {
          var treeHtml = "";
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


//======= Code for "addActionBtn" hook ================================================
//function pongTree_AddActionBtn( id, modalName, resourceURL, paramObj ) {
//	log( "pongTree", "modalFormAddActionBtn "+id);
//	//var action = res.actions[x];
//	var html = "";
//	log( "pongTree", "Std Config Dlg:  " + modalName );
//	var icon = "ui-icon-help"; // TODO change
//	var jscall = '$( "#'+id+modalName+'Dialog" ).dialog( "open" );';
//	var width  = "650"; if ( paramObj!= null && paramObj.width  != null ) { width  = paramObj.widht; }
//	var height = "500"; if ( paramObj!= null && paramObj.height != null ) { height = paramObj.height; }
//	html += '<div id="'+id+modalName+'Dialog">'+ resourceURL +" "+ modalName+"</div>";
//	html += "<script> $(function() { $(  "+
//		"\"#"+id+modalName+"Dialog\" ).dialog( { autoOpen: false, height: "+height+", width: "+width+" , modal: true, "+ // TODO: Refresh resource
//		" buttons: { \"OK\": function() {  $( this ).dialog( \"close\" );  } } }); "+
//		"});</script>";			
//	html += '<button id="'+id+modalName+'Bt">'+modalName+'</button>';
//	html += '<script>  $(function() { $( "#'+id+modalName+'Bt" ).button( { icons:{primary: "'+icon+'"}, text: false } ).click( '+
//		"function() { "+jscall+" }); }); </script>";		
//	return html;
//}

//======= Code for "creModal" hook, requires "addActionBtn"  ================================================
//function pongTree_CreModalFromMeta( id, modalName, resourceURL, paramObj  ) {
//	log( "PoNG-Help", "Get help: '"+resourceURL+"/help'");
//	var lang = getParam( 'lang' );
//	if ( lang == '' ) {
//		lang = "EN";
//	}	
//	var resourceSub = ""; // e.g. "/help"
//	$.get( resourceURL+resourceSub, 
//		{ lang: lang }, // other params required?
//		function( divHtml ) {
//			$(  "#"+id+modalName+"Dialog" ).html( '<div class"pongTreemodal">'+divHtml+'</div>' );
//			log( "pongTree", "loaded" );
//		}
//	).fail(
//		function() {
//			logErr( "pongTree", "Can't load modal form content from '"+resourceURL+resourceSub );
//		}
//	);
//}
