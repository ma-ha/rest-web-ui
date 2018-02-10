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
log( "PoNG-List", "load module");

// This uses heavily pong-table.js functions!!

function pongListDivHTML( divId, resourceURL, params ) {
	log( "PoNG-List",  "divId="+divId+" resourceURL="+resourceURL );
	pongTableInit( divId, "PongList"  );
		
	if ( moduleConfig[ divId ] != null ) {
		renderPongListDivHTML( divId, resourceURL, params, moduleConfig[ divId ] );
	} else {

		$.getJSON( 
			resourceURL+"/pong-list", 
			function( tbl ) {
				renderPongListDivHTML( divId, resourceURL, params, tbl );
			}
		);	
	}	
}

function renderPongListDivHTML( divId, resourceURL, params, tbl ) {
	log( "PoNG-List", "create HTML" );
	
	var dataUrl = resourceURL;
	if ( tbl.dataURL != null ) {
		dataUrl = dataUrl+"/"+tbl.dataURL;
	}
	poTbl[ divId ].pongTableDef = tbl;
	poTbl[ divId ].resourceURL = resourceURL;
	poTbl[ divId ].pongTableDef.dataUrlFull = dataUrl;
	poTbl[ divId ].sortCol = '';
	poTbl[ divId ].pongTableDef.cols = tbl.divs;
		
	poTbl[ divId ].pongTableEndRow = tbl.maxRows;
	var contentItems = [];

	// create form, if required:
	contentItems = pongTableRenderFilterHTML( divId, resourceURL, params, tbl );	
		
	contentItems.push( '<div id="'+divId+'PongList" class="pongList" width="100%">' );
	// cread table head
  if ( tbl.maxRows ) {
  	for ( var r = 0; r < tbl.maxRows; r ++ ) {
  	  log( "PoNG-List", 'row '+r );
  		contentItems.push( '<div class="pongListRow">' );
  		renderPongListDivHTMLsub( contentItems, divId, tbl.divs, r, '' );
  		contentItems.push( "</div>" );
  	}
  	contentItems.push( "</div>" );
  }
  
	// paginator buttons:
  var paginatorJS = [];
  if ( tbl.maxRows ) {
    paginatorJS = pongTableGenPaginator( divId, tbl, 'pongListCells' );
  }
  
	// AJAX functions:
	var ajacCommitsJS = pongTableAjaxCommits( divId, resourceURL, params, tbl );

	// create HTML
	$( "#"+divId ).html( contentItems.join( "\n" ) );
	$( "#"+divId ).append( paginatorJS.join("\n") );
	$( "#"+divId ).append( ajacCommitsJS.join("\n") );
	
  var tHeight = $( "#"+divId ).height();
	if ( $( '#'+divId+'SrchFrmDiv' ).height() ) {
		tHeight -= $( '#'+divId+'SrchFrmDiv' ).height();
	} 
	if ( $( '#'+divId+'Pagin' ).height() ) {
		tHeight -= $( '#'+divId+'Pagin' ).height();
	} 
	//alert( $( "#"+divId ).height() +' - '+ $( '#'+divId+'SrchFrmDiv' ).height() );
	$( "#"+divId+'PongList' ).height( tHeight );

	// if there is no paginator:
  if ( ! tbl.maxRows ) {
    $( '#'+divId+'PongList' ).css( 'overflow', 'auto' );
  }

	if ( params != null  && params.filter != null ) {
		for ( var i = 0; i < params.filter.length; i++ ) {
			if ( i == 0 ) { 
				dataUrl += "?"+params.filter[i].field+'='+params.filter[i].value; 
			} else {
				dataUrl += "&"+params.filter[i].field+'='+params.filter[i].value; 						
			}
		}
	}
  if ( tbl.pollDataSec ) {
    var t = parseInt( tbl.pollDataSec );
    if  ( ! isNaN( t ) ) {  
      poTbl[ divId ].polling = true;
      var pollHTML = [];
      pollHTML.push( '<script>' );
      pollHTML.push( '  function pongListUpdateTimer'+divId+'() { ' );
      pollHTML.push( '        if ( poTbl[ "'+divId+'" ].polling ) { ' );
      pollHTML.push( '          pongListUpdateData( "'+divId+'", '+JSON.stringify( params.get )+' ); ' );
      pollHTML.push( '        }' );
      pollHTML.push( '  }' );
      pollHTML.push( '</script>' );
      $( "#"+divId ).append( pollHTML.join("\n") );
      log( "PoNG-List", ">>>>> create pongTableUpdateTimer t="+t );
      poolDataTimerId = setInterval( "pongListUpdateTimer"+divId+"()", t*1000 );
      log( "PoNG-List", ">>>>> startet pongTableUpdateTimer"+divId+"()" );

//      // toggle pulling action button
//      var html = "";
//      html += '<button id="'+divId+'TableBt">'+$.i18n( 'Start/stop reload' )+'</button>';
//      html += '<script>';
//      html += '  $(function() { $( "#'+divId+'TableBt" ).button( ';
//      html += '    { icons:{primary: "ui-icon-refresh"}, text: false } ).click( function() { pongTableTogglePolling("'+divId+'"); } ); } ); ';
//      html += '</script>';
//      $( "#"+divId+"ActionBtn" ).html( html );
    
    } //else alert( "no parseInt tbl.pollDataSec" );
  } //else alert( "no tbl.pollDataSec" );

	pongListUpdateData( divId, params.get );
		
}




/** update data call back hook */
function pongListUpdateData( divId, paramsObj ) {
  log( "PoNG-List",  'update '+divId );
  var tblDef = poTbl[ divId ].pongTableDef;

  if ( poTbl[ divId ].resourceURL != '-' ) {
    
    $.getJSON( tblDef.dataUrlFull, paramsObj ,
      function( data ) {  
        log( "PoNG-List",  JSON.stringify( data ) );
        var subdata = getSubData( data, tblDef.dataDocSubPath );
        pongListSetData( divId, subdata ); 
        publishEvent( 'feedback', {'text':'List data loaded sucessfully'} )
      } 
    ).fail( 
        function() { publishEvent( 'feedback', {'text':'List service offline? Config OK?'} ) } 
    );
    
  }
}


/** hook and used by update hook */
function pongListSetData( divId, data, dataDocSubPath ) {
  log( "PoNG-List",  'set data hook: '+divId+ " "+dataDocSubPath );
  if ( dataDocSubPath != null ) {
    poTbl[ divId ].pongTableData = getSubData( data, tblDef.dataDocSubPath ); 
  } else {
    //log( "Pong-Table", "set: "+JSON.stringify( data )  )
    poTbl[ divId ].pongTableData = data;    
  }
  pongListCells( divId ); 

  pongTableResize( divId );

  if ( poTbl[ divId ].setData ) {
    if ( poTbl[ divId ].setData.setData ) {
      var setDta =  poTbl[ divId ].setData.setData
      for ( var i = 0; i < setDta.length; i++ ) {
        //alert( setDta[i].resId )
        setModuleData( setDta[i].resId+'Content', poTbl[ divId ].pongTableData, null );
      }
    }
  }
}


/** render table cells */
function pongListCells( divId ) {
  var dtaArr = poTbl[ divId ].pongTableData;
  var rowSt  = 0;
  var rowEn  = dtaArr.length;
  var i = 0;
  
  if ( poTbl[ divId ].sortCol != '' ) {
    pongTable_sc      = poTbl[ divId ].sortCol;
    pongTable_sort_up = poTbl[ divId ].sortUp;
    //alert( "Sort "+poTbl[ divId ].sortCol );
    dtaArr.sort( pongTableCmpFields );
  }

  // if pagination is required, by a maxRow defintion:
  if ( poTbl[ divId ].pongTableDef.maxRows ) {
    rowSt = parseInt( poTbl[ divId ].pongTableStartRow );
    rowEn = parseInt( poTbl[ divId ].pongTableEndRow );   
    log( "PoNG-List", "update paginator label" );  
    var rPP = parseInt( poTbl[ divId ].pongTableDef.maxRows );
    var maxP = Math.ceil( dtaArr.length / rPP );
    var curP = Math.round( rowEn / rPP );
    $( "#"+divId+'PaginLbl' ).html( $.i18n( "page" )+" "+curP+"/"+maxP+ " ("+dtaArr.length+" "+$.i18n("rows")+")" );
  } else {
    // need to create empty table rows and cells 
    // del all rows, except 1st
    $( '#'+divId+'PongList' ).find( ".pongListRow" ).remove();
    
    var contentItems = [];
    for ( var r = 0; r < rowEn; r ++ ) {
      var tbl = poTbl[ divId ].pongTableDef;
      log( "PoNG-List", 'row '+r );
      contentItems.push( '<div class="pongListRow">' );
      // Render empty data cells as nested structure:
      // >>>>>>>>>>>>>>>>>> 
      renderPongListDivHTMLsub( contentItems, divId, tbl.divs, r, '' );
      // <<<<<<<<<<<<<<<<<< moved to pong-table.js
      contentItems.push( "</div>" );

    }
    $( '#'+divId+'PongList' ).append( contentItems.join( '\n' ) );
  }
  
  log( "PoNG-List", "tblCells: divId="+divId+"Data #"+poTbl[ divId ].pongTableData.length + " rowSt="+rowSt + " rowEn="+rowEn );
  
  // fill empty cells with data:
  log( "PoNG-List", "row loop" );  
  var i = 0;
  $( ".pongListValCell" ).html( '&nbsp;' );
  for ( var r = rowSt; r < rowEn; r++ ) {
    log( "PoNG-List", "row loop" );  
    if ( r < dtaArr.length ) {
      log( "PoNG-List", "row "+r );  
      var rowDta = dtaArr[r];
      // >>>>>>>>>>>>>>>>>>>>
      // pongListUpdateRow() is moved to pong-table.js
      pongListUpdateRow( divId, poTbl[ divId ].pongTableDef.divs, rowDta, r, '', i, divId );
      // <<<<<<<<<<<<<<<<<<<< 
    } 
    i++;
  } 
}