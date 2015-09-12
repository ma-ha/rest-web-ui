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

function pongTableDivHTML( divId, resourceURL, params ) {
	log( "Pong-Table",  "pongTableDivHTML: divId="+divId+" resourceURL="+resourceURL );
	poTbl[ divId ] = 
		{ 
			pongTableDef: null,
			divId: null, 
			pongTableStartRow: 0, 
			pongTableEndRow: 0,
			pongTableData: null, 
			pongTableFilter: "" 
		};
	
	poTbl[ divId ].divId = divId;
	
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

	poTbl[ divId ].pongTableDef = tbl;
	poTbl[ divId ].resourceURL = resourceURL;
	poTbl[ divId ].pongTableDef.dataUrlFull = dataUrl;
	poTbl[ divId ].sortCol = ''
	// crunch form
	poTbl[ divId ].pongTableEndRow = tbl.maxRows;
	var contentItems = [];
	
	if ( tbl.filter != null && tbl.filter.dataReqParamsSrc != null && tbl.filter.dataReqParams != null ) {
		if ( tbl.filter.dataReqParamsSrc == 'Form' ) {
			// add filter form for table
			contentItems.push( '<div id="'+divId+'PongTableFrmDiv" class="pongTableFrm">' );
			contentItems.push( '<form id="'+divId+'PongTableFrm">' );
			contentItems.push( '<fieldset><legend>' +$.i18n('Filter') +'</legend>' );
			
			postLst = [];						
			for( var y = 0; y < tbl.filter.dataReqParams.length; y++ ) {
				prop = tbl.filter.dataReqParams[y];
				contentItems.push( '<p><label for="'+divId+prop.id+'">'+ $.i18n( prop.label ) +'</label>' );
				var nameAndClass = 'name="'+prop.id+'" id="'+divId+prop.id+'" class="text ui-widget-content ui-corner-all"'; 
				postLst.push( prop.id+": $( '#"+divId+prop.id+"' ).val()" )
				contentItems.push( '<input type="text" '+nameAndClass+'/></p>' );
				// TODO add field types
				
			}
			contentItems.push( '<button id="'+divId+'PongTableSrchBt">'+ $.i18n( 'Update Table' ) +'</button>' );
			contentItems.push( '</fieldset>' );
			contentItems.push( "</form>" );
			contentItems.push( '</div>' );


			poTbl[ divId ].pongTableFilter = postLst.join( "," );

			contentItems.push( "<script>" );
			contentItems.push( '$(function() { ' );
			contentItems.push( '    $( "#'+divId+'PongTableSrchBt" ).button().click( ' );
			contentItems.push( '       function( event ) { ' );
			contentItems.push( '           event.preventDefault(); ' );
			contentItems.push( '           udateModuleData( "'+divId+'", ' );
			contentItems.push( '             { dataFilter: { '+poTbl[ divId ].pongTableFilter+' } } ); ' );
			contentItems.push( '          return false;  ' );
			contentItems.push( '       }' );
			contentItems.push( '     );  ' );
			contentItems.push( ' }); ' );
			contentItems.push( "</script>" );
			
		} if ( tbl.filter.dataReqParamsSrc == 'sessionInfo' ) {
			// TODO implement pongForm sessionInfo
		}
	}
	
	contentItems.push( '<table id="'+divId+'PongTable" class="pongTable" width="100%">' );
	// create table head
	contentItems.push( '<tr class="'+divId+'HeaderRow">' );
	if ( tbl.cols != null ) {
		for ( var i = 0; i < tbl.cols.length; i ++ ) {
			var colWidth = ''; if ( tbl.cols[i].width != null ) { colWidth = ' width="'+tbl.cols[i].width+'" '; }
			if ( tbl.cols[i].cellType == 'button' ) { // Button column get no headline
				contentItems.push( '<th'+colWidth+'>&nbsp;</th>'  );
			} else	if ( tbl.cols[i].cellType != 'tooltip' ) { // tool tip will be added to another col, so no own col
				contentItems.push( '<th'+colWidth+'>'+ $.i18n( (tbl.cols[i].label!=0 ? tbl.cols[i].label : '&nbsp;' ) ) +'&nbsp;<span class="'+divId+'TblSort" data-colid="'+tbl.cols[i].id+'" style="cursor: pointer;">^</span></th>'  );
			}
		}		
	}
	contentItems.push( '<script> ' );
	contentItems.push( "$(function() { ");
	contentItems.push( ' $( ".'+divId+'TblSort").on( "click", function( e ) { ' );
	contentItems.push( '     poTbl[ "'+divId+'" ].sortCol = $( this ).data("colid"); tblCells( "'+divId+'" ); ' );
	contentItems.push( ' } ); } ); ' );
	contentItems.push( '</script> ' );
	contentItems.push( "</tr>" );
	for ( var r = 0; r < tbl.maxRows; r ++ ) {
		contentItems.push( '<tr id="'+divId+'R'+r+'" class="'+divId+'Row">' );
		for ( var c = 0; c < tbl.cols.length; c ++ ) {
				if ( tbl.cols[c].cellType != 'tooltip' ) {
					contentItems.push( '<td id="'+divId+'R'+r+'C'+c+'" class="'+divId+'C'+c+'">...</td>'  );
				}
		}
		contentItems.push( "</tr>" );
	}
	// paginator buttons
	contentItems.push( "</table>" );
	contentItems.push( '<button id="'+divId+'BtFirst"></button>' );
	contentItems.push( '<button id="'+divId+'BtPrev"></button>' );
	contentItems.push( '<button id="'+divId+'BtNext"></button>' );
	contentItems.push( '<button id="'+divId+'BtLast"></button>' );
	
	// paginator script
	contentItems.push( "<script>" );
	contentItems.push( "$(function() { ");
	contentItems.push( ' $( "#'+divId+'BtFirst").button( {icons:{primary:"ui-icon-arrowthickstop-1-w"}} )');
	contentItems.push( '  .click( function() { ' );
	contentItems.push( '     poTbl[ "'+divId+'" ].pongTableStartRow =0; ' );
	contentItems.push( '     poTbl[ "'+divId+'" ].pongTableEndRow = '+tbl.maxRows+';' );
	contentItems.push( '     tblCells( "'+divId+'" ); } ); ' );
	contentItems.push( ' $( "#'+divId+'BtLast" ).button( {icons:{primary:"ui-icon-arrowthickstop-1-e"}} )' );
	contentItems.push( '  .click( function() { ' );
	contentItems.push( '     poTbl[ "'+divId+'" ].pongTableStartRow =  parseInt(poTbl[ "'+divId+'" ].pongTableData.length)-parseInt('+tbl.maxRows+') ;' );
	contentItems.push( '     poTbl[ "'+divId+'" ].pongTableEndRow = poTbl[ "'+divId+'" ].pongTableData.length;' );
	contentItems.push( '     tblCells( "'+divId+'" ); } ); ' );
	
	contentItems.push( ' $( "#'+divId+'BtPrev" ).button( {icons:{primary:"ui-icon-arrowthick-1-w"}} )' );
	contentItems.push( '  .click( function() { ' );
	contentItems.push( '     if ( poTbl[ "'+divId+'" ].pongTableStartRow - '+tbl.maxRows+' >= 0 ) { ' );
	contentItems.push( '        poTbl[ "'+divId+'" ].pongTableStartRow -= '+tbl.maxRows+'; ' );
	contentItems.push( '        poTbl[ "'+divId+'" ].pongTableEndRow -= '+tbl.maxRows+';  ' );
	contentItems.push( '     } else { ' );
	contentItems.push( '        poTbl[ "'+divId+'" ].pongTableStartRow =0; ' );
	contentItems.push( '        poTbl[ "'+divId+'" ].pongTableEndRow = '+tbl.maxRows+'; ' );
	contentItems.push( '     } ' );
	contentItems.push( '     tblCells( "'+divId+'" ); } ); ' );
	
	contentItems.push( ' $( "#'+divId+'BtNext" ).button( {icons:{primary:"ui-icon-arrowthick-1-e"}} ).click( ' );
	contentItems.push( '  function() {' );
	contentItems.push( '     var xx = parseInt(poTbl[ "'+divId+'" ].pongTableStartRow) + parseInt('+tbl.maxRows +');' );
	contentItems.push( '     if ( xx < poTbl[ "'+divId+'" ].pongTableData.length ) {' );
	contentItems.push( '        poTbl[ "'+divId+'" ].pongTableStartRow = parseInt(poTbl[ "'+divId+'" ].pongTableStartRow) + parseInt('+tbl.maxRows+'); ' );
	contentItems.push( '        poTbl[ "'+divId+'" ].pongTableEndRow = parseInt(poTbl[ "'+divId+'" ].pongTableEndRow) + parseInt('+tbl.maxRows+'); ' );
	contentItems.push( '        tblCells( "'+divId+'" );' );
	contentItems.push( '      }  } ); ' );

	// AJAX commit changes for checkboxes, etc
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
	contentItems.push( '            var colVal =  tbl.is(":checked"); ' );
	contentItems.push( '            postParam[ colId ] =  colVal; ' );
	//contentItems.push( '            alert( "Post '+dataUrl+' "+ JSON.stringify(postParam) ); ' );
	contentItems.push( '            $.post( "'+dataUrl+'", postParam, function( response ) { }, "json");');
	contentItems.push( '            event.preventDefault(); return false; ' );
	contentItems.push( '         }' );
	contentItems.push( '  )' );

	// AJAX commit changes for editable text cells
	contentItems.push( '  $( "#'+divId+'PongTable" ).on( "mouseover", ".editableTblCell", ' );
	contentItems.push( '         function() { $(this).parent().toggleClass( "optedithighlight", true ); return $(this); }' );
	contentItems.push( '  ).on( "mouseout", ".editableTblCell", ' );
	contentItems.push( '         function() { $(this).parent().toggleClass( "optedithighlight", false ); return $(this); }' );
	contentItems.push( '  );' );
	contentItems.push( '  $( "#'+divId+'PongTable" ).on( "focus", ".editableTblCell", ' );
	contentItems.push( '     function() { var tbl = $(this); tbl.data("before", tbl.html()); ' );
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
	contentItems.push( '        $.post( "'+dataUrl+'", postParam , function(response) {  }, "json");');
	//contentItems.push( '        alert( "Post Data Error: { '+tbl.rowId+': "+rowIdVal+", "+colId+": "+colVal+" }   (r="+tbl.data("r") + "/c="+tbl.data("c")+") not stored!!"  ); ' );
	contentItems.push( '     }' );
	contentItems.push( '     return tbl;' );
	contentItems.push( '  }); ');
	contentItems.push( " }); </script>" );
 
	// create HTML
	$( "#"+divId ).html( contentItems.join( "\n" ) );
	
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
	// add page params to data URL
	if ( params.get != null ) {
		for (var key in params.get) {
			dataUrl += (first ? "?" :"&");
			dataUrl += key + "=" + params.get[ key ];
			first = false;
		}
	}
	poTbl[ divId ].pongTableDef.dataUrlFull = dataUrl;

	pongTableUpdateData( divId, params.get );
}

/** update data call back hook */
function pongTableUpdateData( divId, paramsObj ) {
	log( "Pong-Table",  'update '+divId );
	var tblDef = poTbl[ divId ].pongTableDef;

	if ( poTbl[ divId ].resourceURL != '-' ) {
		
		$.getJSON( tblDef.dataUrlFull, paramsObj ,
			function( data ) { 	
				var subdata = getSubData( data, tblDef.dataDocSubPath );
				pongTableSetData( divId, subdata ); 					
			} 
		);
		
	}
}

/** hook and used by update hook */
function pongTableSetData( divId, data ) {
	log( "Pong-Table",  'set data hook: '+divId );
	poTbl[ divId ].pongTableData = data;
	tblCells( divId ); 
}

var pongTable_sc = ''; // little dirty, but works well
function pongTableCmpFields( a, b ) {
	var cellValA = getSubData( a, pongTable_sc );
	var cellValB = getSubData( b, pongTable_sc );
	log( "Pong-Table", pongTable_sc+" "+cellValA+" "+cellValB );
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
		return 1;
	}
	if ( cellValA < cellValB ) {
		return -1;
	}
	return 0;
}
	
/** render table cells */
function tblCells( divId ) {
	var rowSt = parseInt( poTbl[ divId ].pongTableStartRow );
	var rowEn = parseInt( poTbl[ divId ].pongTableEndRow );
	log( "Pong-Table", "tblCells: divId="+divId+"Data #"+poTbl[ divId ].pongTableData.length + " rowSt="+rowSt + " rowEn="+rowEn );
	var i = 0;
	var dtaArr = poTbl[ divId ].pongTableData;
	if ( poTbl[ divId ].sortCol != '' ) {
		pongTable_sc = poTbl[ divId ].sortCol;
		//alert( "Sort "+poTbl[ divId ].sortCol );
		dtaArr.sort( pongTableCmpFields );
	}
	for ( var r = rowSt; r < rowEn; r++ ) {
		if ( r < dtaArr.length ) {
			var cellDta = dtaArr[r];
			for ( var c = 0; c < poTbl[ divId ].pongTableDef.cols.length; c++ ) {
				var cellDef = poTbl[ divId ].pongTableDef.cols[c];
				var cellVal = getSubData( cellDta, cellDef.id );
				log( "Pong-Table", cellDef );
				var cellId =  '#'+divId+'R'+i+'C'+c; 
				var cellType = cellDef.cellType;
				var editable = '';	
				log( "Pong-Table", cellId+ "  "+ cellVal);
				if ( cellType == 'text' ) {
					if ( ( cellDef.editable != null ) && ( cellDef.editable == "true" ) ) { 
						editable = 'contenteditable="true" class="editableTblCell" data-r="'+r+'" data-c="'+c+'"'; 
						$( cellId ).html( '<div style="position:relative" class="editable"><span id="'+divId+'R'+i+cellDef.id+'" '+editable+'>'+cellDta[ cellDef.id ] + '</span><div class="ui-icon ui-icon-pencil editmarker"></div></div>' );
					} else { 
						if ( cellVal.indexOf('http://') == 0 || cellVal.indexOf('https://') == 0 ) {
							$( cellId ).html( '<span id="'+divId+'R'+i+cellDef.id+'"><a href="'+ cellVal +'" target="_blank">'+ cellVal +'</a></span>' );
						} else {
							$( cellId ).html( '<span id="'+divId+'R'+i+cellDef.id+'">'+ cellVal +'</span>' );							
						}
					}
				} else if ( cellType == 'checkbox' ) {
					if ( ( cellDef.editable != null ) && ( cellDef.editable == "true" ) ) {
						editable = 'class="postchange"  data-r="'+r+'" data-c="'+c+'"';
					} else { editable = 'disabled' };
					if ( cellVal == "true" || cellVal==true ) {
						$( cellId ).html( '<input type="checkbox" '+editable+' value="'+cellDef.id+'" id="'+divId+'R'+i+cellDef.id+'" checked />' );												
					} else {
						$( cellId ).html( '<input type="checkbox" '+editable+' value="'+cellDef.id+'" id="'+divId+'R'+i+cellDef.id+'"/>' );
					}
					
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
					$( cellId ).html( '<a href="'+url+'" id="'+divId+'R'+i+cellDef.id+'" '+target+'>'+$.i18n( cellDef.label )+'</a>' );
					
				} else if ( cellType == 'img' ) {
					
					$( cellId ).html( '<img src="'+cellVal+'" id="'+divId+'R'+i+cellDef.id+'" class="img'+divId+'C'+c+'" />' );
					
				} else if ( cellType == 'button'  ) {
					
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
					if ( ( ajaxType == 'GET' ) || ( ajaxType == 'DELETE' ) ) {
						url = addRowIdGetParam ( divId, url, cellDta );
					} 
					param = getRowIdPostParam ( divId, cellDta );					
				
					if ( ( cellDef.url != null ) && ( cellDef.url.length != null ) ) {
						url = cellDef.url;
					}
					contentItems.push( '<button id="'+divId+'R'+i+cellDef.id+'">'+cellDef.label+'</button>' );
					contentItems.push( '<script>' );
					contentItems.push( '  $( function() { ' );
					if ( icon.lenght != 0 ) {
						contentItems.push( '       $( "#' +divId+'R'+i+cellDef.id+ '" ).button( { icons: { primary: "'+icon+'" } } )' );						
					} 
					if ( ajaxType == 'JS'  ) {
						if ( cellDef.js != null ) {
							contentItems.push( '       $( "#' +divId+'R'+i+cellDef.id+ '" ).click(' );
							contentItems.push( '          function() {  ' );
							contentItems.push( '              var theRowId = "'+divId+'R'+r+'";');
							contentItems.push( '              '+cellDef.js);
							contentItems.push( '              return false;');
							contentItems.push( '          }');
							contentItems.push( '       ); ' );
						}
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
				} else {
					// ???
				}	
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