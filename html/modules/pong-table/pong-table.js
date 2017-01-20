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
log( "Pong-Table", "load module");

var poTbl = [];

function pongTableInit( divId, type ) {
	poTbl[ divId ] = 
	{ 
		pongTableDef      : null,
		divId             : null, 
		pongTableStartRow : 0, 
		pongTableEndRow   : 0,
		pongTableData     : null, 
		pongTableFilter   : "",
		type              : type,
		dataURL           : null
	};

	poTbl[ divId ].divId = divId;
}

function pongTableDivHTML( divId, resourceURL, params ) {
	log( "Pong-Table",  "pongTableDivHTML: divId="+divId+" resourceURL="+resourceURL );
	pongTableInit( divId, "PongTable" );
	
	if  ( moduleConfig[ divId ] != null ) {
		
		pongTableDivRenderHTML( divId, resourceURL, params, moduleConfig[ divId ] );
		
	} else {
		
		var metaURL =  resourceURL+"/pong-table";
		if ( params != null )
			if ( params.def != null ) {
				metaURL = resourceURL+"/"+params.def;
			}
			// pass get params of page to module config loader call, to enable dynamic table columns
			if ( params.get != null ) {
				var first = true;
				for (var key in params.get) {
					metaURL += (first ? "?" :"&");
					metaURL += key + "=" + params.get[ key ];
					first = false;
				}
			}
		$.getJSON( metaURL, 
			function( tbl ) {
				pongTableDivRenderHTML( divId, resourceURL, params, tbl );
			}
		);		
	}
}

function pongTableDivRenderHTML( divId, resourceURL, params, tbl ) {
	log( "Pong-Table", "cre table" );
	
	var dataUrl = resourceURL;
	if ( tbl.dataURL != null ) {
		dataUrl = dataUrl+"/"+tbl.dataURL;
	}
	poTbl[ divId ].dataURL = dataUrl
	poTbl[ divId ].pongTableDef = tbl;
	poTbl[ divId ].resourceURL = resourceURL;
	poTbl[ divId ].pongTableDef.dataUrlFull = dataUrl;
	poTbl[ divId ].sortCol = '';
    poTbl[ divId ].sortUp = true;

	poTbl[ divId ].pongTableEndRow = tbl.maxRows;
	var contentItems = [];
	
	// create form if required
	contentItems = pongTableRenderFilterHTML( divId, resourceURL, params, tbl );	
  log( "Pong-Table", "cre table 1" );

	contentItems.push( '<table id="'+divId+'PongTable" class="pongTable" width="100%">' );
	// create table head
	contentItems.push( '<tr class="'+divId+'HeaderRow">' );
	if ( tbl.cols != null ) {
		for ( var i = 0; i < tbl.cols.length; i ++ ) {
			var colWidth = ''; if ( tbl.cols[i].width != null ) { colWidth = ' width="'+tbl.cols[i].width+'" '; }
			if ( tbl.cols[i].cellType == 'button' ) { // Button column get no headline
				contentItems.push( '<th'+colWidth+'>&nbsp;</th>'  );
			} else	if ( tbl.cols[i].cellType == 'linkFor' ) {
				// do noting				
			} else	if ( tbl.cols[i].cellType == 'tooltip' ) {
				// do noting				
			} else if ( tbl.cols[i].cellType == 'largeimg' ) {
				// do noting
			} else {
				contentItems.push( '<th'+colWidth+'>'+ $.i18n( (tbl.cols[i].label!=0 ? tbl.cols[i].label : '&nbsp;' ) ) +'&nbsp;<span class="'+divId+'TblSort" data-colid="'+tbl.cols[i].id+'" style="cursor: pointer;">^</span></th>'  );
			}
		}		
	}
  log( "Pong-Table", "cre table 2" );

	contentItems.push( '<script> ' );
	contentItems.push( "$(function() { ");
	contentItems.push( ' $( ".'+divId+'TblSort").on( "click", function( e ) { ' );
	contentItems.push( '     if ( poTbl[ "'+divId+'" ].sortCol != $( this ).data("colid") ) { ' );
  contentItems.push( '        poTbl[ "'+divId+'" ].sortCol = $( this ).data("colid"); ' );
  contentItems.push( '        poTbl[ "'+divId+'" ].sortUp = true;' );
  contentItems.push( '     } else {' ); // reverse sort order
  contentItems.push( '        poTbl[ "'+divId+'" ].sortUp = ! poTbl[ "'+divId+'" ].sortUp; ' );
  contentItems.push( '     }' );
  contentItems.push( '     tblCells( "'+divId+'" ); ' );
	contentItems.push( ' } ); } ); ' );
	contentItems.push( '</script> ' );
	contentItems.push( "</tr>" );
	if ( tbl.maxRows ) {
	  for ( var r = 0; r < tbl.maxRows; r ++ ) {
	    contentItems.push( '<tr id="'+divId+'R'+r+'" class="'+divId+'Row">' );
	    for ( var c = 0; c < tbl.cols.length; c ++ ) {
	        if ( ( tbl.cols[c].cellType != 'tooltip' ) && 
	           ( tbl.cols[c].cellType != 'largeimg' ) && 
	           ( tbl.cols[c].cellType != 'linkFor' ) ) {
	          contentItems.push( '<td id="'+divId+'R'+r+'C'+c+'" class="'+divId+'C'+c+'">...</td>'  );
	        }
	    }
	    contentItems.push( "</tr>" );
	  }	  
	}
	contentItems.push( "</table>" );
  log( "Pong-Table", "cre table 3" );

	// paginator buttons:
  var paginatorJS = [];
  if ( tbl.maxRows ) {
    paginatorJS = pongTableGenPaginator( divId, tbl, 'tblCells' );
  }
  log( "Pong-Table", "cre table 4" );

	// AJAX functions:
	var ajacCommitsJS = pongTableAjaxCommits( divId, resourceURL, params, tbl );
  log( "Pong-Table", "cre table 5" );

	// AJAX functions:
	var actionsJS = pongTableActions( divId, resourceURL, params, tbl );

	// create HTML
	$( "#"+divId ).html( contentItems.join( "\n" ) );
	$( "#"+divId ).append( paginatorJS.join("\n") );
	$( "#"+divId ).append( ajacCommitsJS.join("\n") );
	$( "#"+divId ).append( actionsJS.join("\n") );
	
	// if there is no paginator:
  if ( ! tbl.maxRows ) {
    $( "#"+divId ).css( 'overflow', 'auto' );
  }
  
  log( "Pong-Table", "cre table 6" );

	var first = true;
	// add filter params to data URL
	if ( params != null  && params.filter != null ) {
		for ( var i = 0; i < params.filter.length; i++ ) {
			if ( first ) { 
				dataUrl += "?"+params.filter[i].field+'='+params.filter[i].value;
				first = false;
			} else {
				dataUrl += "&"+params.filter[i].field+'='+params.filter[i].value; 						
			}
		}
	}
	log( "Pong-Table", "cre table 6" );

	// add page params to data URL
	if ( params.get != null ) {
		for (var key in params.get) {
			dataUrl += (first ? "?" :"&");
			dataUrl += key + "=" + params.get[ key ];
			first = false;
		}
	}
	poTbl[ divId ].pongTableDef.dataUrlFull = dataUrl;

	
	// polling update:
	if ( tbl.pollDataSec ) {
		var t = parseInt( tbl.pollDataSec );
		if  ( ! isNaN( t ) ) {	
			poTbl[ divId ].polling = true;
 			var pollHTML = [];
			pollHTML.push( '<script>' );
			pollHTML.push( '  function pongTableUpdateTimer'+divId+'() { ' );
			pollHTML.push( '      	if ( poTbl[ "'+divId+'" ].polling ) { ' );
			pollHTML.push( '      		pongTableUpdateData( "'+divId+'", '+JSON.stringify( params.get )+' ); ' );
			pollHTML.push( '        }' );
			pollHTML.push( '  }' );
			pollHTML.push( '</script>' );
			$( "#"+divId ).append( pollHTML.join("\n") );
			log( "PoNG-Table", ">>>>> create pongTableUpdateTimer t="+t );
			poolDataTimerId = setInterval( "pongTableUpdateTimer"+divId+"()", t*1000 );
			log( "Pong-Table", ">>>>> startet pongTableUpdateTimer"+divId+"()" );

			// toggle pulling action button
			var html = "";
			html += '<button id="'+divId+'TableBt">'+$.i18n( 'Start/stop reload' )+'</button>';
			html += '<script>';
			html += '  $(function() { $( "#'+divId+'TableBt" ).button( ';
			html += '    { icons:{primary: "ui-icon-refresh"}, text: false } ).click( function() { pongTableTogglePolling("'+divId+'"); } ); } ); ';
			html += '</script>';
			$( "#"+divId+"ActionBtn" ).html( html );
		
		} //else alert( "no parseInt tbl.pollDataSec" );
	} //else alert( "no tbl.pollDataSec" );
	
	if ( tbl.dataURL != null ) { 
	  // load table data on page load only if dataURL is set
	  pongTableUpdateData( divId, params.get );	  
	}
}

function pongTableAddActionBtn( id, modalName, resourceURL, params ) {
	log( "PoNG-Table", "pongTableAddActionBtn "+id);
	var html = '<div id="'+id+'ContentActionBtn" />'; // just a placeholder
	return html;
}

function pongTableTogglePolling( divId ) {
	if ( poTbl[ divId ].polling ) {
		//alert( "Toggle table data polling off" );
		$( '#'+divId+'TableBt' ).button( "option", { icons: { primary: "ui-icon-locked" }, text: false } );
		poTbl[ divId ].polling = false;
    publishEvent( 'feedback', {'text':'Table data auto-update is off.'} )

	} else {	
		//alert( "Toggle table data polling reload on" ); 
		$( '#'+divId+'TableBt' ).button( "option", { icons: { primary: "ui-icon-refresh" }, text: false } );
		poTbl[ divId ].polling = true;
		var tSec = '';
	  if ( poTbl[ divId ].pongTableDef.pollDataSec ) {
	    var t = parseInt( poTbl[ divId ].pongTableDef.pollDataSec );
	    if  ( ! isNaN( t ) ) {  
	      tSec = 'every '+t+' sec ';
	    }
	  }
    publishEvent( 'feedback', {'text':'Table auto-update '+tSec+'is active.'} )
	}
}

function pongTableRenderFilterHTML( divId, resourceURL, params, tbl ) {
	var contentItems = [];
	if ( tbl.filter && tbl.filter.dataReqParamsSrc && tbl.filter.dataReqParams ) {
		if ( tbl.filter.dataReqParamsSrc == 'Form' ) {
			log( "Pong-Table", "cre filter" );
			// add filter form for table
			log( "Pong-Table", "cre filter 1" );
			contentItems.push( '<div id="'+divId+'SrchFrmDiv" class="pongListFrm">' );
			contentItems.push( '<form id="'+divId+'SrchFrm">' );
			var titleTxt = "Filter";
			if ( tbl.filter.title != null ) { titleTxt = tbl.filter.title; }
			contentItems.push( '<fieldset><legend>' +$.i18n(titleTxt) +'</legend>' );
			
			log( "Pong-Table", "cre filter 2" );
			postLst = [];						
			for( var y = 0; y < tbl.filter.dataReqParams.length; y++ ) {
				prop = tbl.filter.dataReqParams[y];
				contentItems.push( '<p><label for="'+divId+prop.id+'">'+ $.i18n( prop.label ) +'</label>' );
				var nameAndClass = 'name="'+prop.id+'" id="'+divId+prop.id+'" class="text ui-widget-content ui-corner-all"'; 
				postLst.push( prop.id+": $( '#"+divId+prop.id+"' ).val()" )
				contentItems.push( '<input type="text" '+nameAndClass+'/></p>' );
				// TODO add field types
				
			}
			log( "Pong-Table", "cre filter 3" );
			var btTxt = "Search";
			if ( tbl.filter.dataReqParamsBt != null ) { btTxt = tbl.filter.dataReqParamsBt}
			contentItems.push( '<button id="'+divId+'SrchBt">'+  $.i18n( btTxt ) +'</button>' );
			contentItems.push( '</fieldset>' );
			contentItems.push( "</form>" );
			contentItems.push( '</div>' );


			log( "Pong-Table", "cre filter 4" );
			poTbl[ divId ].pongTableFilter = postLst.join( "," );

			log( "Pong-Table", "cre filter 5" );
			contentItems.push( "<script>" );
			contentItems.push( '$(function() { ' );
			contentItems.push( '    $( "#'+divId+'SrchBt" ).button().click( ' );
			contentItems.push( '       function( event ) { ' );
			contentItems.push( '           event.preventDefault(); ' );
			contentItems.push( '           udateModuleData( "'+divId+'", { dataFilter: { '+poTbl[ divId ].pongTableFilter+' } } ); ' );
			contentItems.push( '          return false;  ' );
			contentItems.push( '       }' );
			contentItems.push( '     );  ' );
			contentItems.push( ' }); ' );
			contentItems.push( "</script>" );
			
			log( "Pong-Table", "cre filter 6" );
		} if ( tbl.filter.dataReqParamsSrc == 'sessionInfo' ) {
			log( "Pong-Table", "cre filter sessionInfo (TODO)" );
			// TODO implement pongForm sessionInfo
		}
	}
	return contentItems;
}

function pongTableAjaxCommits( divId, resourceURL, params, tbl ) {
	var contentItems = [];
	var dataUrl = resourceURL;
	if ( tbl.dataURL != null ) {
	  var slash = '/';
    if ( tbl.dataURL.charAt( 0 ) == '/' ||  dataUrl.charAt( dataUrl.length - 1 ) == '/') { slash = '' }
	  dataUrl = dataUrl + slash + tbl.dataURL;
	}
	poTbl[ divId ].dataURL = dataUrl
//  if ( dataUrl.charAt( dataUrl.length - 1 ) != '/' ) { 
//    dataUrl = dataUrl + '/';
//  }
	var redirectErr = $.i18n( "Data not stored! POST redirected, please check configuration" );
  
  contentItems.push( "<script>" );
	contentItems.push( "$(function() { ");
    //contentItems.push( '   $( ".editdatepicker" ).datepicker(); ' );
	  
	// code to add/set selected attribute by selector-checkbox event
	contentItems.push( '  $( "#'+divId+'PongTable" ).on( "change", ".rowSelector", ' );
	contentItems.push( '         function( event ) { ' );
	contentItems.push( '            var tbl = $(this); ' );
	contentItems.push( '            poTbl["'+divId+'"].pongTableData[ tbl.data("r") ]["selected"] = tbl.is(":checked"); ' );
	contentItems.push( '         } ); ');

	// code to commit imput/checkbox changes with AJAX call 
	contentItems.push( '  $( "#'+divId+'PongTable" ).on( "change", ".postchange", ' );
	contentItems.push( '         function( event ) { ' );
	contentItems.push( '            var tbl = $(this); ' );
	if ( ( typeof tbl.rowId === 'string' ) ) {
		contentItems.push( '            var rowIdVal =  poTbl["'+divId+'"].pongTableData[ tbl.data("r") ]["'+tbl.rowId+'"]; ' );
		contentItems.push( '            var postParam =  { '+tbl.rowId+': rowIdVal }; ' );		
	} else if ( Array.isArray( tbl.rowId ) ) {
		var param = "";
		var first = true;
		for ( var x = 0; x < tbl.rowId.length; x++ ) {
			if ( ! first ) { param += ', '; } 
			param += tbl.rowId[x]+':poTbl["'+divId+'"].pongTableData[ tbl.data("r") ]["'+tbl.rowId[x]+'"]';
			first = false;
		}
		contentItems.push( '            var postParam =  {'+param+'}; ' );
	} else {
		contentItems.push( '            var rowIdVal  =  ""; ' ); // TODO handle rowId Array
		contentItems.push( '            var postParam =  { }; ' );
	}
	contentItems.push( '            var colId =  poTbl["'+divId+'"].pongTableDef.cols[ tbl.data("c") ].id; ' );
	contentItems.push( '            var colVal =  tbl.is(":checked"); ' ); // TODO: need if(checkbox) ???
	contentItems.push( '            postParam[ colId ] =  colVal; ' );
	//contentItems.push( '            alert( "Post '+dataUrl+' "+ JSON.stringify(postParam) ); ' );
	contentItems.push( '            $.post( ' );
  contentItems.push( '               "'+dataUrl+'", postParam, function( response ) { }, "json"' );
  contentItems.push( '               ).done( ' );
  contentItems.push( '                  function(){ publishEvent( "feedback", {"text":"Row saved sucessfully"} ) } ' );
  contentItems.push( '               ).fail( ' );
  contentItems.push( '                  function(){ publishEvent( "feedback", {"text":"ERROR: Could not save row!"} ) } ' );
  contentItems.push( '               );');
	contentItems.push( '            event.preventDefault(); return false; ' );
	contentItems.push( '         }' );
	contentItems.push( '  );' );

	// linkfFor
	contentItems.push( '  $( "#'+divId+'PongTable" ).on( "click", ".tbl-link-icon", function() { ' );
	contentItems.push( '         if (  $( this ).data( "target" )  &&  $( this ).data( "target" ) != "_parent" ) { ' );
	contentItems.push( '             loadResourcesHTajax(  $( this ).data( "target" ), $( this ).data( "link" ) );' );
	contentItems.push( '         } else { window.open( $( this ).data( "link" ) );  } ' );
	contentItems.push( '  } );' );
	
	// AJAX commit changes for editable text cells
	contentItems.push( '  $( "#'+divId+'PongTable" ).on( "mouseover", ".editableTblCell", ' );
	contentItems.push( '         function() { $(this).parent().toggleClass( "optedithighlight", true ); return $(this); }' );
	contentItems.push( '  ).on( "mouseout", ".editableTblCell", ' );
	contentItems.push( '         function() { $(this).parent().toggleClass( "optedithighlight", false ); return $(this); }' );
	contentItems.push( '  );' );
	contentItems.push( '  $( "#'+divId+'PongTable" ).on( "focus", ".editableTblCell", ' );
	contentItems.push( '     function() { var tbl = $(this); tbl.data("before", tbl.html()); ' );
    //contentItems.push( '        $(this).datepicker( "show" ); ' );
    contentItems.push( '        tbl.parent().toggleClass( "edithighlight", true ); return tbl;' );
	contentItems.push( '  }).on( "focusout", ".editableTblCell", function() { ' );
	contentItems.push( '     var tbl = $(this); ' );
	contentItems.push( '     tbl.parent().toggleClass( "edithighlight", false );' );
	contentItems.push( '     if ( tbl.data("before") !== tbl.html() ) { ' );
	contentItems.push( '        tbl.data("before", tbl.html()); ' ); 
	if ( ( typeof tbl.rowId === 'string' ) ) {
		contentItems.push( '        var rowIdVal =  poTbl["'+divId+'"].pongTableData[ tbl.data("r") ]["'+tbl.rowId+'"]; ' );
		contentItems.push( '        var postParam =  { '+tbl.rowId+': rowIdVal }; ' );		
	} else if ( Array.isArray( tbl.rowId ) ) {
		var param = "";
		var first = true;
		for ( var x = 0; x < tbl.rowId.length; x++ ) {
			if ( ! first ) { param += ', '; } 
			param += tbl.rowId[x]+':poTbl["'+divId+'"].pongTableData[ tbl.data("r") ]["'+tbl.rowId[x]+'"]';
			first = false;
		}
		contentItems.push( '        var postParam =  {'+param+'}; ' );
	} else {
		contentItems.push( '        var rowIdVal  = ""; ' );   // TODO handle rowId Array
		contentItems.push( '        var postParam = {  }; ' );
	}
	contentItems.push( '        var colId =  poTbl["'+divId+'"].pongTableDef.cols[ tbl.data("c") ].id; ' );		
	contentItems.push( '        var colVal =  tbl.html(); ' );
	contentItems.push( '        postParam[ colId ] =  colVal; ' );
	contentItems.push( '        $.post( ' );
  contentItems.push( '           "'+dataUrl+'", postParam , function(response) {  }, "json"' );
  contentItems.push( '        ).done( ' );
  contentItems.push( '           function(){ publishEvent( "feedback", {"text":"Row saved sucessfully"} ) } ' );
  contentItems.push( '        ).fail( ' );
  contentItems.push( '           function(){ publishEvent( "feedback", {"text":"ERROR: Could not save row!"} ) } ' );
  contentItems.push( '        );');
	//contentItems.push( '        alert( "Post Data Error: { '+tbl.rowId+': "+rowIdVal+", "+colId+": "+colVal+" }   (r="+tbl.data("r") + "/c="+tbl.data("c")+") not stored!!"  ); ' );
	contentItems.push( '     }' );
	contentItems.push( '     return tbl;' );
	contentItems.push( '  }); ');
	contentItems.push( " }); </script>" );

	return contentItems;
}

function pongTableGenPaginator( divId, tbl, renderCallback ) {
	var contentItems = [];
	contentItems.push( '<div id="'+divId+'Pagin" class="pongListPagin">' );
	contentItems.push( '<button id="'+divId+'BtFirst" class="pong-table-paginator"></button>' );
	contentItems.push( '<button id="'+divId+'BtPrev" class="pong-table-paginator"></button>' );
	contentItems.push( '<span id="'+divId+'PaginLbl" class="pong-table-paginator-text">...</span>' );
	contentItems.push( '<button id="'+divId+'BtNext" class="pong-table-paginator"></button>' );
	contentItems.push( '<button id="'+divId+'BtLast" class="pong-table-paginator"></button>' );
	contentItems.push(  '</div>' );
	contentItems.push( "<script>" );
	contentItems.push( "$(function() { ");
	contentItems.push( ' $( "#'+divId+'BtFirst").button( {icons:{primary:"ui-icon-arrowthickstop-1-w"}} )');
	contentItems.push( '  .click( function() { ' );
	contentItems.push( '     poTbl[ "'+divId+'" ].pongTableStartRow =0; ' );
	contentItems.push( '     poTbl[ "'+divId+'" ].pongTableEndRow = '+tbl.maxRows+';' );
	contentItems.push( '     '+renderCallback+'( "'+divId+'" ); } ); ' );
	contentItems.push( ' $( "#'+divId+'BtLast" ).button( {icons:{primary:"ui-icon-arrowthickstop-1-e"}} )' );
	contentItems.push( '  .click( function() { ' );
	contentItems.push( '     poTbl[ "'+divId+'" ].pongTableStartRow =  parseInt(poTbl[ "'+divId+'" ].pongTableData.length)-parseInt('+tbl.maxRows+') ;' );
	contentItems.push( '     poTbl[ "'+divId+'" ].pongTableEndRow = poTbl[ "'+divId+'" ].pongTableData.length;' );
	contentItems.push( '     '+renderCallback+'( "'+divId+'" ); } ); ' );
	
	contentItems.push( ' $( "#'+divId+'BtPrev" ).button( {icons:{primary:"ui-icon-arrowthick-1-w"}} )' );
	contentItems.push( '  .click( function() { ' );
	contentItems.push( '     if ( poTbl[ "'+divId+'" ].pongTableStartRow - '+tbl.maxRows+' >= 0 ) { ' );
	contentItems.push( '        poTbl[ "'+divId+'" ].pongTableStartRow -= '+tbl.maxRows+'; ' );
	contentItems.push( '        poTbl[ "'+divId+'" ].pongTableEndRow -= '+tbl.maxRows+';  ' );
	contentItems.push( '     } else { ' );
	contentItems.push( '        poTbl[ "'+divId+'" ].pongTableStartRow =0; ' );
	contentItems.push( '        poTbl[ "'+divId+'" ].pongTableEndRow = '+tbl.maxRows+'; ' );
	contentItems.push( '     } ' );
	contentItems.push( '     '+renderCallback+'( "'+divId+'" ); } ); ' );
	
	contentItems.push( ' $( "#'+divId+'BtNext" ).button( {icons:{primary:"ui-icon-arrowthick-1-e"}} ).click( ' );
	contentItems.push( '  function() {' );
	contentItems.push( '     var xx = parseInt(poTbl[ "'+divId+'" ].pongTableStartRow) + parseInt('+tbl.maxRows +');' );
	contentItems.push( '     if ( xx < poTbl[ "'+divId+'" ].pongTableData.length ) {' );
	contentItems.push( '        poTbl[ "'+divId+'" ].pongTableStartRow = parseInt(poTbl[ "'+divId+'" ].pongTableStartRow) + parseInt('+tbl.maxRows+'); ' );
	contentItems.push( '        poTbl[ "'+divId+'" ].pongTableEndRow = parseInt(poTbl[ "'+divId+'" ].pongTableEndRow) + parseInt('+tbl.maxRows+'); ' );
	contentItems.push( '        '+renderCallback+'( "'+divId+'" );' );
	contentItems.push( '      }  } ); ' );
	contentItems.push( " }); </script>" );
	return contentItems;
}


function pongTableActions( divId, resourceURL, params, tbl ) {
	log( "PoNG-Table",  'pongTableActions '+divId );
	var contentItems = [];	
	var tblDef = poTbl[ divId ].pongTableDef; 
	if ( tblDef.actions && tblDef.actions.length ) {
		contentItems.push( '<div id="'+divId+'Pagin" class="pongListPagin">' );
		for ( var x = 0; x < tblDef.actions.length; x++ ) {
			var headerLst = []; // TODO
			var basicAuth = null; // TODO
			
			var action = tblDef.actions[ x ];
			var method = "POST";
			if ( action.method != null ) { method = action.method; }

	        if ( action.method == 'SETDATA' ) {
	              poTbl[ divId ].setData = action;
	              log( "PoNG-Table",  '  action = setData');
	              continue; 
	        }

			
			log( "PoNG-Table",  '  action '+action.id);
			contentItems.push( '<button id="'+divId+'Bt'+action.id+'" class="pong-table-action">'+$.i18n(action.actionName)+'</button>' );	
			contentItems.push( '<script>' );
			contentItems.push( '  $(function() { ' );
			contentItems.push( '       $( "#'+divId+'Bt'+action.id+'" ).click(' );
			contentItems.push( '          function() {  ' ); 
			if ( action.actionURL ) { // otherwise no AJAX, only interaction
				contentItems.push( '              var actionUrl = "'+action.actionURL+'";' );
				contentItems.push( '              var request = $.ajax( { url: actionUrl, type: "'+method+'", ' );
				contentItems.push( '                       crossDomain: true, ' ); //TODO fix CORS logic
				contentItems.push( '                   	   beforeSend: function ( request ) { ' );
				if ( basicAuth != null ) {
				//	alert()
					var basicAuthStr = 'btoa( $( "#'+divId+basicAuth.user+'" ).val() + ":" + $( "#'+divId+basicAuth.password+'" ).val() )';
					contentItems.push( '                   	      request.setRequestHeader( "Authorization", "Basic "+'+basicAuthStr+' );' );
				} else 
				if ( action.oauth_scope != null ) {
					contentItems.push( '                             if ( sessionInfo["OAuth"]["access_token"] != null && sessionInfo["OAuth"]["access_token"] != "" ) {');
					contentItems.push( '                   	             request.setRequestHeader( "Authorization", "Bearer "+sessionInfo["OAuth"]["access_token"] ); ');
					contentItems.push( '                   	             request.setRequestHeader( "oauth-token", sessionInfo["OAuth"]["access_token"] ); '); // huuhaaaaa SugarCRM special -- hope it won't hurt elsewhere!!
					contentItems.push( '                   	         } ');
				}
				contentItems.push( '                   	   },' )
				if ( ( action.dataEncoding != null ) || ( action.dataEncoding == "GETstyle")  ) { // funny request, but some standard
					contentItems.push( '                 data: pongTblGetDataStr( "'+divId+'", "'+action.id+'" ) ' );
				} else { // default: JSON data encoding
					contentItems.push( '                 data: pongTblGetPostLst2( "'+divId+'", '+JSON.stringify(action)+' ) ' );			
					//contentItems.push( '                 data: pongTblGetPostLst( "'+divId+'", "'+action.id+'" ) ' );			
				}
				//contentItems.push( '                     xhr: function() {return new window.XMLHttpRequest({mozSystem: true});}, beforeSend: function(xhr){  xhr.withCredentials = true; } ');
				contentItems.push( '              } ).done(  ' );
				contentItems.push( '                 function( dta ) {  ' );
				contentItems.push( '                    if ( dta != null && ( dta.error != null || dta.error_message != null ) ) {  alert( "ERROR: "+ dta.error +": "+ dta.error_message );}   ' );
				contentItems.push( '                    pongTblCrunchActionData( "'+divId+'", poTbl[ "'+divId+'" ].pongTableDef.actions[ '+x+' ], dta ); ');
				contentItems.push( '                    return false;' ); 
				contentItems.push( '                 }  ' );
				contentItems.push( '              ).error( function( jqXHR, textStatus, errorThrown) { alert( textStatus+": "+jqXHR.responseText ); } ); ');
	
				if ( action.target == 'modal' ) {
					contentItems.push( '               request.fail(  function(jqXHR, textStatus) { alert( "Failed: "+textStatus ); } ); ' );
				}		
			} else { // actionUrl == null 
				contentItems.push( '                    pongTblCrunchActionData( "'+divId+'", poTbl[ "'+divId+'" ].pongTableDef.actions[ '+x+' ], null ); ');
				
			}  

			contentItems.push( '              return false;' ); 
			contentItems.push( '          }' );
			contentItems.push( '       ); ' );
			contentItems.push( '  }); ' );
			contentItems.push( '</script>' );


		}
		contentItems.push( '</div>' );
	}	
	return contentItems;
}

function pongTblCrunchActionData ( divId, action, dta ) {
	log( "PoNG-Table",  '  pongTblCrunchActionData '+action.id);
	// rem: "target" is not supported here! Missing?
	if ( ( action.update != null ) && ( action.update.length != null ) ) {
		log( "PoNG-Table",  '  update! '+ action.update.length );
		for ( var i = 0; i < action.update.length; i++ ) {
			log( "PoNG-Table", "action: '"+ action.id + "' updateData: "+action.update[i].resId );
			if ( dta == null )  dta = pongTblGetPostLst2( divId, action.update[i] );
			udateModuleData( action.update[i].resId+'Content', dta );				
		}
	}
	if ( ( action.setData != null ) && ( action.setData.length != null ) ) {
		log( "PoNG-Table",  '  set data ');
		for ( var i = 0; i < action.setData.length; i++ ) {
			log( "PoNG-Table", "action: '"+ action.id + "' setData "+action.setData[i].resId );
			if ( dta == null )  dta = pongTblGetPostLst2( divId, action.setData[i] );
			if ( action.setData[i].dataDocSubPath != null ) {
				setModuleData( action.setData[i].resId+'Content', dta, action.setData[i].dataDocSubPath );								
			} else {
				setModuleData( action.setData[i].resId+'Content', dta, null );									
			}
		}			
	}

}


function pongTblGetPostLst2( divId, action ) {
	log( "PoNG-Table",  'pongTblGetPostLst2 '+divId );
	log( "PoNG-Table",  'pongTblGetPostLst2 '+JSON.stringify(action) );
	var tblDef = poTbl[ divId ].pongTableDef;
	var result = {};
	// identify action def
	var postLst = [];

	// search selected list rows
	if ( poTbl[ divId ].pongTableData ) {
		for ( var r = 0; r < poTbl[ divId ].pongTableData.length; r++ ) {
			if ( poTbl[ divId ].pongTableData[ r ]["selected"] ) {
				log( "PoNG-Table",  ' found selected' );
				// ok selected
				var params = {}
				// iterate action data fields
				if ( action.params ) {
					for ( var f = 0; f < action.params.length; f++ ) {
						params[ action.params[f].name ] = parseRowPlaceHolders( poTbl[ divId ].pongTableData[ r ], action.params[f].value );
					}
				}
				postLst.push( params );
			}
		}
	}
	if ( action.paramLstName ) {
		result[ action.paramLstName ] = postLst;					
	} else {
		result[ "param" ] = postLst;
	}
//	alert( JSON.stringify( result ) );
	return result;
}




function pongTblGetDataStr( divId, actionId ) {
	var getLst = [];
	var tblDef = poTbl[ divId ].pongTableDef;
	// identify action def
	if ( tblDef.actions && tblDef.actions.length ) {
		for ( var x = 0; x < tblDef.actions.length; x++ ) {
			if ( tblDef.actions[x].id == actionId ) {
				// action found:
				var actn =  tblDef.actions[x];

				// search selected list rows
				if ( poTbl[ divId ].pongTableData ) {
					for ( var r = 0; r < poTbl[ divId ].pongTableData.length; r++ ) {
						if ( poTbl[ divId ].pongTableData[ r ]["selected"] ) {
							// ok selected
//							alert(  JSON.stringify(actn) );
							
							// iterate action data fields
							if ( actn.params ) {
								for ( var f = 0; f < actn.params.length; f++ ) {
									getLst.push( actn.params[f].name +"="+ parseRowPlaceHolders( poTbl[ divId ].pongTableData[ r ], actn.params[f] ) );
									//alert( actn.params[f].name +"="+ parseRowPlaceHolders( poTbl[ divId ].pongTableData[ r ], actn.params[f] ) );
								}
							}
						}
					}
					//getLst.push( field.id + '=" + $( "#'+divId+field.id+'" ).val() +"' );		
				}
			}
		}
	}
	
	return getLst.join("&");
}

/** replaces ${xyz} in str by the value of the input text field with ID xyz */
function parseRowPlaceHolders( row, str ) {
	//TODO
	log( "PoNG-Table",  "Start value: "+ str );
	while ( str.indexOf( "${" ) >= 0 && str.indexOf( "${" ) < str.indexOf( "}" ) ) {
		var plcHldStart = str.indexOf( "${" );
		var plcHldEnd   = str.indexOf( "}" );
		var varStr = str.substr( plcHldStart + 2,  plcHldEnd - plcHldStart - 2 );
		log( "PoNG-Table",  'parsePlaceHolders "'+varStr+'"' );
		str = str.substr( 0, plcHldStart ) +  getSubData(row,varStr) + str.substr( plcHldEnd+1 );  
	}
	log( "PoNG-Table", "Processed value: "+ str );
	return str;
}




/** update data call back hook */
function pongTableUpdateData( divId, paramsObj ) {
	log( "Pong-Table",  'update '+divId );
	var tblDef = poTbl[ divId ].pongTableDef;

	if ( poTbl[ divId ].resourceURL != '-' ) {
		
		$.getJSON( tblDef.dataUrlFull, paramsObj ,
			function( data ) { 	
		    log( "Pong-Table",  JSON.stringify( data ) );
				var subdata = getSubData( data, tblDef.dataDocSubPath );
				pongTableSetData( divId, subdata ); 
				publishEvent( 'feedback', {'text':'Table data loaded sucessfully'} )
			} 
		).fail( 
		    function() { publishEvent( 'feedback', {'text':'Table service offline? Config OK?'} ) } 
		);
		
	}
}

/** hook and used by update hook */
function pongTableSetData( divId, data, dataDocSubPath ) {
	log( "Pong-Table",  'set data hook: '+divId+ " "+dataDocSubPath );
	if ( dataDocSubPath != null ) {
		poTbl[ divId ].pongTableData = getSubData( data, tblDef.dataDocSubPath );	
	} else {
		//log( "Pong-Table", "set: "+JSON.stringify( data )  )
		poTbl[ divId ].pongTableData = data;		
	}
	tblCells( divId ); 
	
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
function pongTableResize( divId ) {
// TODO get resize wirking
  
//  var tbl = poTbl[ divId ].pongTableDef;
//  var divType = poTbl[ divId ].type;
//  log( "xPong-Table", 'pongTableResize '+divId+ ' '+ divType );
//  if ( tbl.heightMin ) {
//    var heightMin = parseInt( tbl.heightMin );
//    var divHeight = $( "#"+divId+divType ).innerWidth()
//    log( "xPong-Table", 'heightMin='+heightMin+ '  divHeight='+ divHeight );
//    if ( heightMin < divHeight ) {
//      alert( divHeight+' < '+ heightMin )
//      $( divId ).innerWidth( divHeight )
//    } 
//  }
}

var pongTable_sc = ''; // little dirty, but works well
var pongTable_sort_up = true; // little dirty, but works well
function pongTableCmpFields( a, b ) {
	var cellValA = getSubData( a, pongTable_sc );
	var cellValB = getSubData( b, pongTable_sc );
	log( "Pong-Table", 'Sort: '+pongTable_sc+" "+cellValA+" "+cellValB );
	if ( Number( cellValA ) && Number( cellValB ) ) {
		if ( ! isNaN( parseFloat( cellValA ) ) && ! isNaN( parseFloat( cellValB ) ) ) {
			cellValA = parseFloat( cellValA );
			cellValB = parseFloat( cellValB );
			log( "Pong-Table", "parseFloat" );
		} else {
			if ( ! isNaN( parseInt( cellValA ) ) && ! isNaN( parseInt( cellValB ) ) ) {
				cellValA = parseInt( cellValA );
				cellValB = parseInt( cellValB );
				log( "Pong-Table",  "parseInt" );
			}
		}
	}
	if ( cellValA > cellValB  ) {
	  return ( pongTable_sort_up ? 1 : -1)
	}
	if ( cellValA < cellValB ) {
	  return ( pongTable_sort_up ? -1 : 1)
	}
	return 0;
}
	

/** render table cells */
function tblCells( divId ) {
  log( "Pong-Table", 'tblCells( '+divId +' )' );  
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
	  log( "Pong-Table", "update paginaor label" );  
	  var rPP = parseInt( poTbl[ divId ].pongTableDef.maxRows );
	  var maxP = Math.ceil( dtaArr.length / rPP );
	  var curP = Math.round( rowEn / rPP );
	  $( "#"+divId+'PaginLbl' ).html( $.i18n( "page" )+" "+curP+"/"+maxP+ " ("+dtaArr.length+" "+$.i18n("rows")+")" );
	} else {
	  // need to create empty table rows and cells 
	  // del all rows, except 1st
	  $( '#'+divId+'PongTable' ).find( "tr:gt(0)" ).remove();
	  
	  var contentItems = [];
	  for ( var r = 0; r < rowEn; r ++ ) {
	    var tbl = poTbl[ divId ].pongTableDef;
	    // table:  id="'+divId+'PongTable"
	    $( '#'+divId+' .'+divId+'Row' ).remove();
	    contentItems.push( '<tr id="'+divId+'R'+r+'" class="'+divId+'Row">' );
	    for ( var c = 0; c < tbl.cols.length; c ++ ) {
	      if ( ( tbl.cols[c].cellType != 'tooltip' ) && 
	          ( tbl.cols[c].cellType != 'largeimg' ) && 
	          ( tbl.cols[c].cellType != 'linkFor' ) ) {
	        contentItems.push( '<td id="'+divId+'R'+r+'C'+c+'" class="'+divId+'C'+c+'">...</td>'  );
	      }
	    }
	    contentItems.push( "</tr>" );
	  }
	  $( '#'+divId+'PongTable' ).append( contentItems.join( '\n' ) );
	}
	
	log( "Pong-Table", "tblCells: divId="+divId+"Data #"+poTbl[ divId ].pongTableData.length + " rowSt="+rowSt + " rowEn="+rowEn );
	
	log( "Pong-Table", "row loop" );	
	for ( var r = rowSt; r < rowEn; r++ ) {
		log( "Pong-Table", "row loop" );	
        var rowIdVal =  dtaArr[r][ poTbl[ divId ].pongTableDef.rowId ]
        //console.log( '>>>>>>>> '+ poTbl[ divId ].pongTableDef.rowId + JSON.stringify(dtaArr[r]) )
		if ( r < dtaArr.length ) {
			log( "Pong-Table", "row "+r );	
			var cellDta = dtaArr[r];
			
			
			for ( var c = 0; c < poTbl[ divId ].pongTableDef.cols.length; c++ ) {
				log( "Pong-Table", "col "+c );	
				var cellDef = poTbl[ divId ].pongTableDef.cols[c];
			  var cellId =  '#'+divId+'R'+i+'C'+c; 
				tblUpdateCell( divId, cellDef, r, c, i, cellDta, cellId, rowIdVal);
			}
		} else { // clear the rest of the cells
			for ( var c = 0; c < poTbl[ divId ].pongTableDef.cols.length; c++ ) {
				var cellId =  '#'+divId+'R'+i+'C'+c; 
				$( cellId ).html( '&nbsp;' );
			}
		}
		i++;
	}	
}


function tblUpdateCell( divId, cellDef, r, c, i, cellDta, cellId , rowIdVal ) {
  log( "Pong-Table", 'tblUpdateCell '+cellId+' cellDef:'+JSON.stringify( cellDef ) );
  
  var dataUrl = poTbl[ divId ].dataURL;
  var cellType = cellDef.cellType;
  var cellVal = null;
  if ( cellType != 'label' ) {
    log( "Pong-Table", "call getSubData.. " );  
    cellVal = getSubData( cellDta, cellDef.id );    
  }
  if ( cellVal == null ) { cellVal = ''; }
  var editable = '';  
  log( "Pong-Table", 'ID:"'+cellId+ '"  val:'+ cellVal );
  if ( cellType == 'text' ) {
    
    if ( ( cellDef.editable != null ) && ( cellDef.editable == "true" ) ) { 
      editable = 'contenteditable="true" class="editableTblCell" data-r="'+r+'" data-c="'+c+'"'; 
      $( cellId ).html( '<div style="position:relative" class="editable cell'+cellDef.id.replace(/\./g,'')+'""><span id="'+divId+'R'+i+cellDef.id+'" '+editable+'>'+cellDta[ cellDef.id ] + '</span><div class="ui-icon ui-icon-pencil editmarker"></div></div>' );
    } else { 
      if ( cellVal.indexOf('http://') == 0 || cellVal.indexOf('https://') == 0 ) {
        $( cellId ).html( '<span id="'+divId+'R'+i+cellDef.id+'" class="cell'+cellDef.id.replace(/\./g,'')+'"><a href="'+ cellVal +'" target="_blank">'+ cellVal +'</a></span>' );
      } else {
        $( cellId ).html( '<span id="'+divId+'R'+i+cellDef.id+'" class="cell'+cellDef.id.replace(/\./g,'')+'">'+ cellVal +'</span>' );             
        //TODO why additional span ?? $( cellId ).html( '<span id="'+divId+'R'+i+cellDef.id+'">'+ cellVal +'</span><span class="ui-icon ui-icon-plusthick " style="display:inline-block" />' );             
      }
    }
    
  } else if ( cellType == 'date' || cellType == 'datems' ) {
    
    var cls = 'cell'+cellDef.id.replace(/\./g,'') + ' pongDate '
    var fmt = $.i18n( ( cellDef.format ? cellDef.format : 'YYYY-MM-DD hh:mm' ) ); 
    //console.log( JSON.stringify(cellDef) )
    var unixDt = parseInt( cellDta[ cellDef.id ] )
    log( "Pong-TableX", 'Date: ID="'+cellId+ '"  format:'+ fmt + ' '+unixDt);
    var theDate = ( cellType == 'datems' ? new Date( unixDt ) : new Date( unixDt*1000 ) );
    //old 
    //var datrStr = $.datepicker.formatDate( fmt, theDate );
    // new
    var datrStr = moment( theDate ).format( fmt );
    if ( ( cellDef.editable != null ) && ( cellDef.editable == "true" ) ) { 
      editable = ' data-r="'+r+'" data-c="'+c+'"';
      var cID = divId+'R'+i+cellDef.id;
			poTbl[ divId ].pongTableDef.rowId
      $( cellId ).html( '<div style="position:relative" class="editable cell'+cellDef.id.replace(/\./g,'')+' editdatepicker">'
          +'<span id="'+cID+'" class="'+cls+'" '+editable+'>'+ datrStr +'</span>'
          +'<div id="'+cID+'editmarker" class="ui-icon ui-icon-pencil editmarker"></div></div>'
          +'<script>$("#'+cID+'").datepicker( "isDisabled" ); '
          +'$("#'+cID+'editmarker").click( function(){ $("#'+cID+'").datepicker("dialog", new Date('+theDate.valueOf()+'), '
          +'function(d){ var dtv=new Date(d).valueOf();'
          +'$.post( "'+dataUrl+'", { '+poTbl[ divId ].pongTableDef.rowId+':"'+rowIdVal+'", '+cellDef.id+':dtv }, function(response) { }, "json"'
          +' ).done( function(){ publishEvent( "feedback", {"text":"Row saved sucessfully"} ) } ' 
          +' ).fail( function(){ publishEvent( "feedback", {"text":"ERROR: Could not save row!"} ) } );' 
          // known: wrong data still in poTbl[ divId ].pongTableData -- but who cares
          +'$( "#'+cID+'" ).html( $.datepicker.formatDate( "'+fmt+'", new Date(d) ) ); '
          +'} )} ); '
          +'</script>' 
      );
    } else {
      $( cellId ).html( '<span id="'+divId+'R'+i+cellDef.id+'" class="'+cls+'">'+ datrStr +'</span>' );      
    }

  } else if ( cellType == 'label' ) {

    $( cellId ).html( '<span id="'+divId+'R'+i+cellDef.id+'" class="cell'+cellDef.id.replace(/\./g,'')+'">'+ $.i18n( cellDef.label ) +'</span>' );
    
  } else if ( cellType == 'icon' ) {
  
    $( cellId ).html( '<span id="'+cellId+'" data-link="'+cellVal+'" data-target="'+target+'" class="ui-icon ui-icon-'+cellVal+' tbl-link-icon cell'+cellDef.id.replace(/\./g,'')+'"/>' );

  } else if ( cellType == 'graph' ) {

    $( cellId ).html( '<canvas id="'+cellId+'Canvas" width="auto" height="auto"></canvas>' )
    var canvas = document.getElementById( cellId+'Canvas' );
    canvas.width  = $( cellId ).innerWidth()
    canvas.height = $( cellId ).innerHeight()
    var def    = JSON.parse( JSON.stringify( cellDef ) )
    def.pos    = { x:0, y:0 }
    def.width  = canvas.width
    def.height = canvas.height
    var ctx = canvas.getContext("2d")
    
    pongTblRenderGraph( divId, ctx, def, cellVal ) 
    
    
  } else if ( cellType == 'pie' ) {

    $( cellId ).html( '<canvas id="'+cellId+'Canvas" width="auto" height="auto"></canvas>' )
    var canvas = document.getElementById( cellId+'Canvas' );
    canvas.width  = $( cellId ).innerWidth()
    canvas.height = $( cellId ).innerHeight()
    var cw = canvas.width
    var ch = canvas.height
    var ctx = canvas.getContext("2d")

    if ( ! cellDef.min ) { cellDef.min =   0 }
    if ( ! cellDef.max ) { cellDef.max = 100 }
    //log( 'Pong-Table', cellId+' '+ cw+ ' '+ ch);
    ctx.beginPath()
    ctx.strokeStyle = "#DDD"
    ctx.lineWidth = cw/4
    ctx.arc( cw/2, cw/2, cw/3, 0, Math.PI, true )
    ctx.stroke()
    
    var start = Math.PI;
    for ( var v = 0; v < cellVal.length; v++ ){
      var range = Math.PI   * cellVal[v].val / ( cellDef.max - cellDef.min)
      log( 'Pong-Table', cellId+' '+v+ ' '+cellVal[v].label+' '+start+' - '+(start+range)+' '+cellVal[v].color )
      ctx.beginPath();
      ctx.strokeStyle = cellVal[v].color;
      ctx.lineWidth = cw/4;
      ctx.arc( cw/2, cw/2, cw/3, start, (start+range), false );
      ctx.stroke();
      if (  cellVal[v].val > 0 ) {
        ctx.strokeStyle = ( cellDef.labelColor ? cellDef.labelColor : '#000' )
        ctx.lineWidth = 1
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle' 
        if ( cellVal[v].label ) {
          var tx = cw/2 + Math.cos( start + range/2 ) * cw/3;
          var ty = cw/2 +  Math.sin( start + range/2 ) * cw/3;
          log( 'Pong-Table', cellId+' x='+tx+' y='+ty )
          ctx.beginPath();
          ctx.strokeText( cellVal[v].label, tx, ty );        
        }
      }
      start += range;
    }
    
  } else if ( cellType == 'email' ) {
    
    $( cellId ).html( '<span id="'+divId+'R'+i+cellDef.id+'" class="cell'+cellDef.id.replace(/\./g,'')+'"><a href="mailto:'+ cellVal +'">'+ $.i18n( cellVal ) +'</a></span>' );
    
  } else if ( cellType == 'checkbox' ) {
    
    if ( ( cellDef.editable != null ) && ( cellDef.editable == "true" ) ) {
      editable = 'class="postchange"  data-r="'+r+'" data-c="'+c+'"';
    } else { editable = 'disabled' };
    if ( cellVal == "true" || cellVal==true ) {
      $( cellId ).html( '<input type="checkbox" '+editable+' value="'+cellDef.id+'" id="'+divId+'R'+i+cellDef.id+'" checked />' );                        
    } else {
      $( cellId ).html( '<input type="checkbox" '+editable+' value="'+cellDef.id+'" id="'+divId+'R'+i+cellDef.id+'"/>' );
    }
    
  } else if ( cellType == 'selector' ) {
    
    var selected = "";
    if ( cellDta[ "selected" ] ) { selected = "checked"; }
    //editable = 'class="rowSelector"  data-r="'+r+'" data-c="'+c+'"';
    $( cellId ).html( '<input type="checkbox" class="rowSelector"  data-r="'+r+'" data-c="'+c+'" value="selected" id="'+divId+'R'+i+cellDef.id+'" '+selected+' />' );
    
  } else if ( cellType == 'linkLink' ) {
    
    var target = '';
    if ( cellDef.target != null ) {
      target = 'target="'+cellDef.target+'"';
    }
    var url = cellVal;
    if ( cellDef.URL != null ) {
      url = cellDef.URL;
    }
    if ( poTbl[ divId ].pongTableDef.rowId != null ) {
      //if ( ( ajaxType == 'GET' ) || ( ajaxType == 'DELETE' ) ) {
        url = addRowIdGetParam ( divId, url, cellDta );
      //} 
      //param = getRowIdPostParam ( divId, cellDta );         
    } else {
      alert( "rowId == null" );
    }
    $( cellId ).html( '<a href="'+url+'" id="'+divId+'R'+i+cellDef.id+'" '+target+' class="cell'+cellDef.id.replace(/\./g,'')+'">'+$.i18n( cellDef.label )+'</a>' );
    
  } else if ( cellType == 'img' ) {
    
    var tblImg  = cellVal; // TODO impl zoom image
    var zoomImg = cellVal; // TODO impl zoom image
    
//    //search for zoom image def 
    for ( var cZI = 0; cZI < poTbl[ divId ].pongTableDef.cols.length; cZI++ ) {
      var cellDefZI = poTbl[ divId ].pongTableDef.cols[ cZI ];
      if ( cellDefZI.cellType == 'largeimg' && cellDefZI.forImg && cellDefZI.forImg == cellDef.id ) { // found
        var cellValZI = getSubData( cellDta, cellDefZI.id );
        if ( cellValZI != null ) { zoomImg = cellValZI }              
      }
    }
    
    $( cellId ).html( '<img src="'+tblImg+'" data-zoom-image="'+zoomImg+'" id=  "'+divId+'R'+i+cellDef.id+'" class="img'+divId+'C'+c+'" />'); 
    $( cellId ).append( '<script> $(function() {  $( "#'+divId+'R'+i+cellDef.id+'" ).elevateZoom(); } ); </script>' );
    
  }  else if ( cellType == 'button'  ) {
    
    var contentItems = [];
    var ajaxType = 'POST';
    var param = '';
    var icon = 'ui-icon-gear';
    if ( ( cellDef.method != null ) && ( cellDef.method.length != null ) ) {
      if ( cellDef.method == 'DEL-POST' ) {
        param = ',"actn":"DEL"';
        icon = 'ui-icon-trash';
      } else {
        ajaxType = cellDef.method;
        if ( ajaxType == 'DELETE' ) {
          icon = 'ui-icon-trash';               
        } else if ( ajaxType == 'POST' ) {
          icon = 'ui-icon-check';               
        } else if ( ajaxType == 'GET' ) {
          icon = 'ui-icon-arrowrefresh-1-w';                
        }    
      }
    } 
    if ( ( cellDef.icon != null ) && ( cellDef.icon.length != null ) ) {
      icon = cellDef.icon;                
    }         
    log( "Pong-Form", cellDef.label+" icon="+icon );
    var url = poTbl[ divId ].resourceURL;
    if ( cellDef.URL != null ) {
      url = cellDef.URL;
    }
    
    // rowId can be a String or an Array  
    if ( cellDef.params != null ) { 
      if ( ( ajaxType == 'GET' ) || ( ajaxType == 'DELETE' ) ) {
        url = addGetParam ( cellDef.params, divId, url, cellDta );
      } 
      param = getPostParam ( cellDef.params, divId, cellDta );                                  
    } else {
      if ( ( ajaxType == 'GET' ) || ( ajaxType == 'DELETE' ) ) {
        url = addRowIdGetParam ( divId, url, cellDta );
      } 
      param = getRowIdPostParam ( divId, cellDta );                     
    }
  
    if ( ( cellDef.url != null ) && ( cellDef.url.length != null ) ) {
      url = cellDef.url;
    }
    contentItems.push( '<button id="'+divId+'R'+i+cellDef.id+'" class="pong-table-btn">'+cellDef.label+'</button>' );
    contentItems.push( '<script>' );
    contentItems.push( '  $( function() { ' );
    if ( icon.lenght != 0 ) {
      contentItems.push( '       $( "#' +divId+'R'+i+cellDef.id+ '" ).button( { icons: { primary: "'+icon+'" } } )' );            
    } 
    if ( ajaxType == 'JS'  ) {
      if ( cellDef.js != null ) {
        contentItems.push( '       $( "#' +divId+'R'+i+cellDef.id+ '" ).click(' );
        contentItems.push( '          function() {  ' );
        contentItems.push( '              var theRowId   = "'+divId+'R'+r+'";');
        contentItems.push( '              var theRowData = '+JSON.stringify( cellDta )+';');
        contentItems.push( '              '+cellDef.js);
        contentItems.push( '              return false;');
        contentItems.push( '          }');
        contentItems.push( '       ); ' );
      }
    } else if ( ajaxType == 'UPDATE'  ) {
      contentItems.push( '       $( "#' +divId+'R'+i+cellDef.id+ '" ).click(' );
      contentItems.push( '          function() {  ' );
      if ( ( cellDef.update != null ) && ( cellDef.update.length != null ) ) {
        for ( var upCnt = 0; upCnt < cellDef.update.length; upCnt++ ) {
          var resToUpd = cellDef.update[upCnt].resId + 'Content';
          var updParam = "";
          if ( cellDef.update[upCnt].params != null ) {
            updParam = getPostParam ( cellDef.update[upCnt].params, divId, cellDta );
          }
          if ( resToUpd == 'thisContent' ) { resToUpd = divId }
          contentItems.push( '              udateModuleData( "'+resToUpd+'", { '+updParam+' }  ); ' ); // otherwise deleted ID is requested and result is empty
          
        }
      }
      contentItems.push( '              return false;');
      contentItems.push( '          }');
      contentItems.push( '       ); ' );
    } else {
      contentItems.push( '       $( "#' +divId+'R'+i+cellDef.id+ '" ).click(' );
      contentItems.push( '          function() {  '); //alert( "'+ajaxType+' data: { rowId : '+ poTbl[ divId ].pongTableDef.rowId+'='+cellDta[ poTbl[ divId ].pongTableDef.rowId ] +' }"); ' );
      contentItems.push( '              $.ajax( ' );
      contentItems.push( '                 { url: "'+url+'", ');
      contentItems.push( '                   type: "'+ajaxType+'", ' );
      if ( ajaxType == 'POST' ) {
        contentItems.push( '                   data: { '+param+' } ' );           
      }
      contentItems.push( '              } ).done(  ' );
      contentItems.push( '                 function( dta ) { '); // alert( dta ); ' );
      if ( cellDef.target != null ) {
        if ( cellDef.target == '_parent' ) {
          contentItems.push( '                       window.location.replace( dta );');
        } else if ( cellDef.target == '_blank' ) {
          contentItems.push( '                       window.open( dta );');
        } else if ( cellDef.target == 'modal' ) {
          contentItems.push( '                       alert( dta );  ' );
        } else {
          contentItems.push( '                       $( "#'+cellDef.target+'Content" ).html( dta );  ' );                 
        }
      }
      if ( ( cellDef.update != null ) && ( cellDef.update.length != null ) ) {
        for ( var upCnt = 0; upCnt < cellDef.update.length; upCnt++ ) {
          var resToUpd = cellDef.update[upCnt].resId + 'Content';
          if ( resToUpd == 'thisContent' ) { resToUpd = divId }
          if ( cellDef.method == 'DELETE' ) {
            contentItems.push( '                 udateModuleData( "'+resToUpd+'", { }  ); ' ); // otherwise deleted ID is requested and result is empty
          } else {
            contentItems.push( '                 udateModuleData( "'+resToUpd+'", { '+param+' }  ); ' );                          
          }
        }
      }
      if ( ( cellDef.setData != null ) && ( cellDef.setData.length != null ) ) {
        log( "Pong-Table", "button with setData..." );
        for ( var sd = 0; sd < cellDef.setData.length; sd++ ) {
          log( "Pong-Table", "button: "+ cellDef.id + " setResponse resId:"+cellDef.setData[sd].resId );
          if ( cellDef.setData[sd].dataDocSubPath != null ) {
            contentItems.push( '                       setModuleData( "'+cellDef.setData[sd].resId+'Content", dta, "'+cellDef.setData[sd].dataDocSubPath+'" );' );                    
          } else {
            contentItems.push( '                       setModuleData( "'+cellDef.setData[sd].resId+'Content", dta, null );' );                  
          }
        }     
      }
      contentItems.push( '                       return false;' ); 
      contentItems.push( '                  }  ' );
      contentItems.push( '              ); ');
      contentItems.push( '              return false;' ); 
      contentItems.push( '          }' );
      contentItems.push( '       ); ' );
    }
    contentItems.push( '  } ); ' ); 
    contentItems.push( '</script>' );
    $( cellId ).html( contentItems.join( "\n" ) );
    
  } else if ( cellType == 'tooltip'  ) {
    
    $( '#'+divId+'R'+i+cellDef.label ).attr( 'title' , cellVal );
    
  } else if ( cellType == 'linkFor'  ) {
    
    var target = "_parent";
    if ( cellDef.target ) { target = cellDef.target; }
    $( '#'+divId+'R'+i+'C'+cellDef.col ).append( '<span id="'+cellId+'" data-link="'+cellVal+'" data-target="'+target+'" class="ui-icon ui-icon-extlink tbl-link-icon"/>' );
    
  } else if ( cellType == 'rating'  ) {
    
    ratingType = "5star";
    if ( cellVal == null ) { cellVal = 0; }
    if ( cellDef.ratingType != null ) {
      ratingType = cellDef.ratingType;
    }
    $( cellId ).html( '<img class="RatingImg cell'+cellDef.id+'"" src="'+modulesPath+"pong-table/rating/"+ratingType+cellVal+'.png" id="'+divId+'R'+i+cellDef.id+'"/>' );
    
  } else {
    // ???
  } 

}


function addGetParam ( params, divId, url, cellDta ) {
	log( "Pong-Table", "addGetParam "+ JSON.stringify( params ) );
	if ( Array.isArray( params ) ) {
		var first = true;
		for ( var x = 0; x < params.length; x++ ) {
			if ( url.indexOf("?") > -1 ) {	url += '&';	} else { url += '?'; }
			var val = params[x].value;
			$.each( cellDta, 
					function( key, value ) {
						//log( "Pong-Table", "     check: "+"${"+cellDef.id+"}" );
						if ( val.indexOf( "${"+key+"}" ) > -1 ) {
							val = val.replace( "${"+key+"}", value );
							log( "Pong-Table", "val="+val );
						}
					}
			);
			url += params[x].name+'='+val;								
		}
	}
	log( "Pong-Table", "URL: "+url );
	return url;
}


function getPostParam ( params, divId, cellDta ) {
	log( "Pong-Table", "getPostParam "+ JSON.stringify( params ) );
	var param = "";
	if ( Array.isArray( params ) ) {
		var first = true;
		for ( var x = 0; x < params.length; x++ ) {
			if ( ! first ) { param += ', '; } 
			var val = params[x].value;
//			log( "Pong-Table", "cellDta "+ JSON.stringify( cellDta ) );
			$.each( cellDta, 
				function( key, value ) {
					//log( "Pong-Table", "     check: "+"${"+cellDef.id+"}" );
					if ( val.indexOf( "${"+key+"}" ) > -1 ) {
						val = val.replace( "${"+key+"}", value );
						log( "Pong-Table", "val="+val );
					}
				}
			);
			param += '"'+params[x].name+'":"'+val+'"';
			first = false;
		}
	}
	//TODO
	return param;
}


function addRowIdGetParam ( divId, url, cellDta ) {
	var rid = poTbl[ divId ].pongTableDef.rowId;
	if ( typeof rid === 'string' ) {
		if ( url.indexOf("?") > -1 ) {	url += '&';	} else { url += '?'; }
		url += rid+'='+cellDta[ rid ];													
	} else if ( Array.isArray( rid ) ) {
		var first = true;
		for ( var x = 0; x < rid.length; x++ ) {
			if ( url.indexOf("?") > -1 ) {	url += '&';	} else { url += '?'; }
			url += rid[x]+'='+cellDta[ rid[x] ];								
		}
	} else {
		if ( url.indexOf("?") > -1 ) {	url += '&';	} else { url += '?'; }
		url += rid+'='+cellDta[ rid ];

	}
	return url;
}


function getRowIdPostParam ( divId, cellDta ) {
	var rid = poTbl[ divId ].pongTableDef.rowId;
	var param = "";
	if ( typeof rid === 'string' ) {
		param = '"'+rid+'":"'+ cellDta[ rid ] +'"';
	} else if ( Array.isArray( rid ) ) {
		var first = true;
		for ( var x = 0; x < rid.length; x++ ) {
			if ( ! first ) { param += ', '; } 
			param += '"'+rid[x]+'":"'+cellDta[ rid[x] ]+'"';
			first = false;
		}
	}
	return param;
}

//---------------------------------------------------------------------------------
function pongTblRenderGraph( divId, ctx, def, dta ) {
  log( "Pong-Table", "pongIOrenderGraph '"+def.id+"': "+JSON.stringify(def) );
  if ( def.pos  &&  def.pos.x != null  &&  def.pos.y != null  &&  def.width  &&  def.height &&
     def.layout && def.layout.yAxis  &&  def.layout.yAxis.min != null  &&  def.layout.yAxis.max != null ) {} else { 
    log( "Pong-Table", "pongIOrenderGraph: Config not OK! End.");
    return;
  }
  var x = parseInt(def.pos.x) , y = parseInt(def.pos.y) , w = parseInt(def.width) , h = parseInt(def.height) , 
    yMin = parseFloat( def.layout.yAxis.min ) , yMax = parseFloat( def.layout.yAxis.max );
  ctx.beginPath();
  ctx.strokeStyle = "#00A";
  ctx.fillStyle   = "#DDD";
  ctx.lineWidth    = "1";
  if ( def.lineCol ) { ctx.strokeStyle = def.lineCol; }
  if ( def.fillCol ) { ctx.fillStyle   = def.fillCol; }
  ctx.rect( x, y, w, h );
  ctx.stroke();
  ctx.fill();     
  
  if ( def.layout.name ) {
    var xx = x + w/2, yy = y-6;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    pongTblCnvTxt(  divId, def, ctx, def.layout.name, xx, y, {"font":"10pt Arial"} );   
  }
    
  // draw y axis
  var lYmin = yMin , lYmax = yMax , yLogType = false ;
  if ( def.layout.yAxis.axisType && def.layout.yAxis.axisType == "logarithmic" ) {  
    yLogType = true;
    lYmin = Math.log( yMin );
    lYmax = Math.log( yMax );   
  }
  log( "Pong-Table", "Graph y-min="+lYmin ); 
  log( "Pong-Table", "Graph y-max="+lYmax ); 
  ctx.textAlign = "end";
  ctx.textBaseline = "middle";
  if ( def.layout.yAxis.labels && def.layout.yAxis.labels.length ) {
    var xx = x + 4, xt= x - 3;
    for ( var c = 0; c < def.layout.yAxis.labels.length; c++ ) {
      var l = parseFloat( def.layout.yAxis.labels[c] );
      if ( ! isNaN( l ) ) {
        var ly = h * (  l - lYmin ) / ( lYmax - lYmin );
        if ( yLogType ) {
          ly = h * ( Math.log(l) - lYmin ) / ( lYmax - lYmin );
          log( "Pong-Table", "Graph y-lbl="+h+" "+y+" "+ly+"   (Log("+l+")="+Math.log(l)+")" );
        }
        var lyy = Math.round( y  + h - ly ); 
        log( "Pong-Table", "Graph y-lbl: "+x+"/"+lyy+" -- "+xx+"/"+lyy);
        ctx.moveTo( x,  lyy );
        ctx.strokeStyle = "#00A";
        ctx.fillStyle   = "#DDD";
        ctx.lineTo( xx, lyy );
        ctx.stroke();
        pongTblCnvTxt(  divId, def, ctx, l, xt, lyy, {"font":"8pt Arial"} );
      }
    }
  }
  
  // draw graphs
  if ( dta  && dta.length ) {
    for ( var c = 0; c < dta.length; c++ ) {
      var g = dta[c];
      log( "Pong-Table", ">>>>>>>>>>> #d="+ g.data.length  );
      if ( g.data && g.data.length ) {
        var xMin = g.data[0][0]; xMax = g.data[0][0];
        for ( var i = 0; i < g.data.length; i++ ) {
          if ( xMax < g.data[i][0] ) { xMax = g.data[i][0] }
          if ( xMin > g.data[i][0] ) { xMin = g.data[i][0] }
        }
        if ( xMin == xMax ) { xMax += 1; }
        log( "Pong-Table", " xMin="+xMin+" xMax="+xMax );
        var drawL = false;
        ctx.beginPath();
        ctx.strokeStyle = "#99F";
        if ( def.layout.colors && def.layout.colors[ g.name ] ) {
          ctx.strokeStyle = def.layout.colors[ g.name ];
        }
        for ( var i = 0; i < g.data.length; i++ ) {
          var xx = x + Math.round(  w * ( g.data[i][0] - xMin ) / ( xMax - xMin) );
          //log( "Pong-Table", " xx = "+xx +"    > "+g.data[i][0]+" "+w+" "+x );
          var yy = y;
          if ( yLogType ) {
            yy = y + h - Math.round( h * ( Math.log( g.data[i][1] ) - lYmin ) / ( lYmax - lYmin ) );
            //log( "Pong-Table", " xx = "+xx +"   d="+g.data[i][1]+" / yy = "+yy );
          } else {
            yy = y + h - Math.round( h * ( g.data[i][1] - lYmin ) / ( lYmax - lYmin ) );
          }
          //log( "Pong-Table", " xx = "+xx +"   d="+g.data[i][1]+" / yy = "+yy );
          if ( drawL ) {
            //log( "Pong-Table", " lineto( "+xx+" / "+yy+" )" );
            ctx.lineTo( xx, yy );                       
            ctx.stroke();
          } else {
            //log( "Pong-Table", " moveto( "+xx+" / "+yy+" )" );
            ctx.moveTo( xx, yy );           
          }
          if ( yMin < g.data[i][1] && g.data[i][1] < yMax ) { drawL = true; } else { drawL = false; }
        }
      }
      //if ( g.length ) {
      //}
      
    }
  }
  
  // TODO IO: implement graph
  log( "Pong-Table", "pongIOrenderGraph end.");
}


//---------------------------------------------------------------------------------------

/** helper */
function pongTblCnvTxt( divId, def, ctx, txt, x, y, opt ) {
  log( "Pong-Table", "pongTblCnvTxt: "+divId+ " "+x+"/"+y);
  if ( ! def ) return; // safety first
  var pmd = poTbl[ divId ].pongTableDef;
  if ( def.textAlign ) {  ctx.textAlign = def.textAlign; } 
  if ( def.textBaseline ) { ctx.textAlign = def.textBaseline; } 

  if ( def.font ) { ctx.font = def.font; } 
    else if ( pmd && pmd.font ) { ctx.font   = pmd.font; } 
      else if ( opt && opt.font ) { ctx.font   = opt.font; } 
        else { ctx.font   = "14px Courier"; }

  if ( def.textFillColor ) {  ctx.fillStyle = def.textFillColor; } 
    else if ( pmd && pmd.textFillColor ) { ctx.fillStyle   = pmd.textFillColor; } 
      else if ( opt && opt.fillStyle ) { ctx.fillStyle   = opt.fillStyle; } 
        else { ctx.fillStyle   = "#00F"; }
  
  if ( def.textStrokeColor ) {  ctx.strokeStyle = def.textStrokeColor; } 
    else if ( pmd && pmd.textStrokeColor ) { ctx.strokeStyle   = pmd.textStrokeColor; } 
      else if ( opt && opt.strokeStyle ) { ctx.strokeStyle   = opt.strokeStyle; } 
        else { ctx.strokeStyle   = "#FFF"; }
  
  ctx.strokeText( txt, x, y );
  ctx.fillText(   txt, x, y );
  
  //log( "Pong-Table", "pongTblCnvTxt end.");
}
