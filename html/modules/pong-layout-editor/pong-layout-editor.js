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

log( "layout-editor", "load module"); // print this on console, when module is loaded


moduleConfig[ 'layoutEditorContent' ] = { 
	"layout": {		   
		"rows": 
			[ 
			 	{ "rowId":"r1",  "height":"100px", "title":"Base Config", "type":"frm","resourceURL":"svc/admin/baseconfig" },
			 	{ "rowId":"r2",  "height":"265px", 
			 	  "cols": 
				  [
					  { "columnId":"first",  "title":"Base Config", "type":"tbl", "width":"50%", "resourceURL":"svc/admin/baseconfig" },
					  { "columnId":"second", "title":"2nd Config",   "width":"50%", "resourceURL":"svc/admin/baseconfig" } 
				  ] 
			 	}
			] 
	}
};

// ======= Code for "loadResourcesHtml" hook ================================================
function pongLayoutEditorDivHTML( divId, resourceURL, paramObj ) {
	log( "layout-editor",  "divId="+divId+" resourceURL="+resourceURL );
	if ( moduleConfig[ divId ] != null ) {
		var cnf = moduleConfig[ divId ].layout;
		moduleConfig[ divId ].resourceURL = resourceURL;
		moduleConfig[ divId ].page_id = -1;
		var contentItems = [];
		contentItems.push( '<div id="'+divId+'Inner" style="width:100%;height:100%">' );
		contentItems.push( '</div>' );
		contentItems.push( '<div class="layoutEditorZoom"><form><select id="'+divId+'ZoomSel">' );
		contentItems.push( '<option value="1.0">100%</option>' );
		contentItems.push( '<option value="0.8">80%</option>' );
		contentItems.push( '<option value="0.6">60%</option>' );
		contentItems.push( '<option value="0.5">50%</option>' );
		contentItems.push( '<option value="0.4" selected="selected">40%</option>' );
		contentItems.push( '<option value="0.3">30%</option>' );
		contentItems.push( '<option value="0.2">20%</option>' );
		contentItems.push( '</select></div>' );
		contentItems.push( '<script>' );
		contentItems.push( '$(function() { ' );
		contentItems.push( '    $( "#'+divId+'ZoomSel" ).change( ' );
		contentItems.push( '       function( event ) { ' );
		contentItems.push( '           udateModuleData( "'+divId+'", '+JSON.stringify(paramObj)+' ); ' );
		contentItems.push( '          return false;  ' );
		contentItems.push( '       }' );
		contentItems.push( '     );  ' );
		contentItems.push( ' }); ' );
		contentItems.push( '</script>' );
		$( "#"+divId ).html( contentItems.join( "\n" ) );
		pongLayoutEditorRenderHTML( divId, resourceURL, paramObj, cnf );				
	} else {
		$( "#"+divId ).html( '<div id="'+divId+'layout-editor_Div" class="layout-editor">ERROR [1]</div>' );
    publishEvent( 'feedback', {'text':'Error: Layout config required!'} )
	}
}


function pongLayoutEditorRenderHTML( divId, resourceURL, paramObj, cnf ) {
	log( "layout-editor", "start "+JSON.stringify(paramObj) );
	//TODO: get layout widht
	var contentItems = [];
	contentItems.push( '<div id="'+divId+'PageName" class="layout-editor-title">Page: ' );
	if ( ( cnf != null ) && ( cnf.title != null ) ) { 
		contentItems.push( '"<a href="show.php?layout='+cnf.page_name+'" Title="Open Preview" target="_blank">'+cnf.title+'</a>"'  ); 
		contentItems.push( '</form><font size="-2"><a href="svc/layout.php?page='+cnf.page_name+'" Title="Show structure (JSON)" target="_blank">json</a></font>'  ); 
	} else { contentItems.push( "-" ); }
	contentItems.push( '</div>' );
	contentItems.push( '<div id="'+divId+'layout-editor_Div" class="layout-editor">' );
	if ( ( cnf != null ) && ( cnf.rows != null ) ) {
		// crunch the layout object tree to HTML
		var zoom = $( '#'+divId+'ZoomSel' ).val();
		var pageWidth = Math.round( 990 * zoom );
		if ( cnf.page_width != null ) {
			pageWidth =  Math.round( cnf.page_width * zoom );
		}
		log( "layout-editor", "Zoom="+zoom+" pageWidth="+pageWidth+" ("+cnf.page_width+")" );
		contentItems = contentItems.concat( pongLayoutEditorRowsToEditHTML( divId, cnf.rows, pageWidth, zoom ) );		
	}
	contentItems.push( '</div>' );
	// output
	$( "#"+divId+"Inner" ).html( contentItems.join( "\n" ) );
	log( "layout-editor", "end.");

}

function pongLayoutEditorRowsToEditHTML( divId, rowsLayout, w, f ) {
	log( 'layout-editor', "ROW >>>>>>>>>>>>>>>>>>>>>>>>LEN="+rowsLayout.length );		
	var rows = [];
	for ( var i = 0; i < rowsLayout.length; i++ ) {
		var aRow = rowsLayout[i];
		var id = "unknown";
		if ( aRow.rowId != null ) {
			id = aRow.rowId;
		}
		log( "layout-editor", " row:"+i+" Id="+id );
		var style = " height:"+relDim( aRow.height, f )+";";  //TODO calc with f
		if ( aRow.resourceURL != null ) {
			if ( aRow.type != null ) {
			    style += ' background: url(svc/admin/modules/type-'+aRow.type+'.png); background-size: 100% 100%; background-repeat: no-repeat;';				
			} else {
				style += ' background: url(svc/admin/modules/type-empty.png); background-size: 100% 100%; background-repeat: no-repeat;';					
			}

			rows.push( '<div id="'+id+'" class="rowdiv" style="'+style+' position:relative; width:'+w+'px;">' );
			rows.push( '<div id="'+id+'Edit" class="editdiv" style="width:100%; height:100%;">' );
			rows = rows.concat( pongLayoutEditorMkButtons( divId, id ) );

			log( 'layout-editor', " row: "+id+"  "+aRow.resourceURL );		
			rows.push( "</div></div>" );
		} else if ( aRow.cols != null ) {
			rows.push( '<div id="'+id+'" class="rowdiv" style="'+style+' position:relative; width:'+w+'px;">' );
			rows.push( '<div id="'+id+'Edit" class="editdiv" style="width:100%; height:100%;">' );
			rows = rows.concat( pongLayoutEditorColsToEditHTML( divId, aRow.cols, aRow.height, f ) );
			rows.push( "</div></div>" );
		} else {
			rows.push( '<div id="'+id+'" class="rowdiv" style="'+style+' position:relative; height:100%;">empty</div>' );
		}
	}
	log( 'layout-editor', "ROW <<<<<<<<<<<<<<<<<<<<<<<<" );		
	return rows;
}


function pongLayoutEditorColsToEditHTML( divId, colsLayout, h, f ) {
	log( 'layout-editor', "COL >>>>>>>>>>>>>>>>>>>>>>>>LEN="+colsLayout.length );		
	var cols = [];
	for ( var i = 0; i < colsLayout.length; i++ ) {
		var aCol = colsLayout[i];
		var id = "unknown";
		if ( aCol.columnId != null ) {
			id = aCol.columnId;
		}
		log("layout-editor", " col:"+i+" "+id );
		var style = " width:"+relDim( aCol.width, f )+";"; //TODO calc with f
		if ( aCol.resourceURL != null ) {
			if ( aCol.type != null ) {
			    style += ' background: url(svc/admin/modules/type-'+aCol.type+'.png); background-size: 100% 100%; background-repeat: no-repeat;';				
			}else {
				style += ' background: url(svc/admin/modules/type-empty.png); background-size: 100% 100%; background-repeat: no-repeat;';					
			}
			cols.push( '<div id="'+id+'" class="coldiv" style="'+style+' position:relative; height:100%;">' );
			cols.push( '<div id="'+id+'Edit" class="editdiv" style="width:100%; height:10	0%;">' );
			cols = cols.concat( pongLayoutEditorMkButtons( divId, id ) );

			log( 'layout-editor',  " col:" +id+"  "+aCol.resourceURL );		
			cols.push( "</div></div>");
		} else if ( aCol.rows != null ) {
			cols.push( '<div id="'+id+'" class="coldiv editdiv" style="'+style+' position:relative; height:100%;">' );
			cols = cols.concat( pongLayoutEditorRowsToEditHTML( divId, aCol.rows, aCol.width, f ) );
			cols.push( "</div>");
		} else {
			cols.push( '<div id="'+id+'" class="coldiv" style="'+style+' position:relative; height:100%;">empty</div>' );
		}  
	}	
	log( 'layout-editor', "COL <<<<<<<<<<<<<<<<<<<<<<<<" );		
	return cols;	
}


function relDim( dim, f ) {
	if ( endsWith( dim, 'px' ) ) {
		var d = parseInt( dim, 10 );
		if ( d ) {
			d = Math.round( d * f );
			log( 'layout-editor', " dim= "+dim+" -> d="+d );
			return d+'px';
		} else {
			// hmmmm
			log( 'layout-editor', " dim= "+dim );
			return dim;
		}
	} else {
		// hmmmmmmmm
		log( 'layout-editor', " dim= "+dim );
		return dim;
	}
}


function pongLayoutEditorMkButtons( divId, id ) {
	var rows = [];
	rows.push( '<div class="btToolbar">' );
	rows.push( id+' <button id="'+id+'Change">Modify '+id+'</button>' );
	rows.push( '<button id="'+id+'HSplit">Split '+id+'</button><button id="'+id+'VSplit">Split '+id+'</button>' );
	rows.push( '<button id="'+id+'MoveL">Move '+id+' left</button><button id="'+id+'MoveR">Move '+id+' right</button>' );
	rows.push( '<button id="'+id+'MoveU">Move '+id+' up</button><button id="'+id+'MoveD">Move '+id+' down</button>' );
	rows.push( '<button id="'+id+'Del">Delete '+id+'</button>' );
	rows.push( '<script>  ' );
	rows.push( '$( function() {  ' );
	rows.push( '   $("#'+id+'HSplit").button( {  text: false, icons: { primary: "ui-icon-carat-2-n-s" } } ' );
	rows.push( '   ).click( function() { pongLayoutEditorSplit(  "'+divId+'" ,"'+id+'", "v" ); } );' );
	rows.push( '   $("#'+id+'VSplit").button( {  text: false, icons: { primary: "ui-icon-carat-2-e-w" } } ' );
	rows.push( '   ).click( function() { pongLayoutEditorSplit(  "'+divId+'" ,"'+id+'", "h" ); } );' );
	rows.push( '   $("#'+id+'MoveL").button( {  text: false, icons: { primary: " ui-icon-carat-1-w" } } ' );
	rows.push( '   ).click( function() { pongLayoutEditorMove(  "'+divId+'" ,"'+id+'", "l" ); } );' );
	rows.push( '   $("#'+id+'MoveR").button( {  text: false, icons: { primary: " ui-icon-carat-1-e" } } ' );
	rows.push( '   ).click( function() { pongLayoutEditorMove(  "'+divId+'" ,"'+id+'", "r" ); } );' );
	rows.push( '   $("#'+id+'MoveU").button( {  text: false, icons: { primary: " ui-icon-carat-1-n" } } ' );
	rows.push( '   ).click( function() { pongLayoutEditorMove(  "'+divId+'" ,"'+id+'", "u" ); } );' );
	rows.push( '   $("#'+id+'MoveD").button( {  text: false, icons: { primary: " ui-icon-carat-1-s" } } ' );
	rows.push( '   ).click( function() { pongLayoutEditorMove( "'+divId+'" ,"' +id+'", "d" ); } );' );
	rows.push( '   $("#'+id+'Del").button( {  text: false, icons : { primary: "ui-icon-close" } } ' );
	rows.push( '   ).click( function() { pongLayoutEditorDel( "'+divId+'" ,"'+id+'" ); } );' );
	rows.push( '   $("#'+id+'Change").button( {  text: false, icons: { primary: "ui-icon-pencil" } } ' );
	rows.push( '   ).click( function() { pongLayoutEditorChange( "'+divId+'" ,"'+id+'" ,"X" ); } );' );
	rows.push( '});' );
	rows.push( '</script>');			
	rows.push( "</div>" );
	return rows;
}

function pongLayoutEditorChange( divId, id ) {
	//alert( 'Change '+ id );
	if ( moduleConfig[ divId ].resourceFormId != null ) {
		udateModuleData( moduleConfig[ divId ].resourceFormId+'Content', {"struct_id":id } );
	}
}

function pongLayoutEditorDel( divId, id ) {
	//alert( 'Del '+ id );
	var paramsObj = {};
	paramsObj.edit = 'del';
	paramsObj.struct_id = id;
	pongLayoutBackendCall( "POST", divId, paramsObj, true );
}

function pongLayoutEditorSplit( divId, id, hv ) {
	//alert( 'Split '+id + " "+hv );
	var paramsObj = {};
	paramsObj.edit = 'split';
	paramsObj.struct_id = id;
	paramsObj.d = hv;
	pongLayoutBackendCall( "POST", divId, paramsObj, true );
}

function pongLayoutEditorMove( divId, id, dir ) {
	//alert( 'Move '+id + " "+dir );
	var paramsObj = {};
	paramsObj.edit = 'move';
	paramsObj.struct_id = id;
	paramsObj.d = dir;
	pongLayoutBackendCall( "POST", divId, paramsObj, true );
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

/** update data call back hook */
function layoutEditorUpdateData( divId, paramsObj ) {
	log( "layout-editor", "start '"+JSON.stringify(paramsObj)+"'");
	//alert(divId+": ... try to load "+paramsObj.rowId ); 
	if ( ( paramsObj != null ) && ( paramsObj.page_id != null ) ) {
		moduleConfig[ divId ].page_id = paramsObj.page_id;
	} else { 
		paramsObj = { "page_id":moduleConfig[ divId ].page_id };
	}
	pongLayoutBackendCall( "GET", divId, paramsObj, false );
	log( "layout-editor", "end.");
}


function pongLayoutBackendCall( method, divId, paramsObj, doUpdate ) {
	log( "layout-editor", "pongLayoutBackendCall: " +method+ " "+JSON.stringify(paramsObj)+" upd="+doUpdate);
	moduleConfig[ divId ].paramsObj = paramsObj;
	$.ajax( 
		{ 
			url: moduleConfig[ divId ].resourceURL, 
			type: method, 
			data: paramsObj 
		}
	).done(  
        function( dta ) {
          publishEvent( 'feedback', { text:'Layout backend call sucessful' } )
        	//alert( divId+' '+dta.layout.title );  
        	if ( dta.layout != null ) {
        	  pongLayoutEditorRenderHTML( divId,  moduleConfig[ divId ].resourceURL, paramsObj, dta.layout );	        		
        	}
        	return false;
        }
    ).always(
        function() {
        	//alert( divId+'  always...' );  
        	if ( doUpdate == true ) {
            	layoutEditorUpdateData( divId, moduleConfig[ divId ].paramsObj );        		
        	}
        	return false;
        }
    ).fail(
        function () { publishEvent( 'feedback', { text: 'ERROR: Layout backend problem' } ) }
    );
}

/*
//======= Code for "addActionBtn" hook ================================================
function layout-editor_AddActionBtn( id, modalName, resourceURL, paramObj ) {
	log( "layout-editor", "modalFormAddActionBtn "+id);
	//var action = res.actions[x];
	var html = "";
	log( "layout-editor", "Std Config Dlg:  " + modalName );
	var icon = "ui-icon-help"; // TODO change
	var jscall = '$( "#'+id+modalName+'Dialog" ).dialog( "open" );';
	var width  = "650"; if ( paramObj!= null && paramObj.width  != null ) { width  = paramObj.widht; }
	var height = "500"; if ( paramObj!= null && paramObj.height != null ) { height = paramObj.height; }
	html += '<div id="'+id+modalName+'Dialog">'+ resourceURL +" "+ modalName+"</div>";
	html += "<script> $(function() { $(  "+
		"\"#"+id+modalName+"Dialog\" ).dialog( { autoOpen: false, height: "+height+", width: "+width+" , modal: true, "+ // TODO: Refresh resource
		" buttons: { \"OK\": function() {  $( this ).dialog( \"close\" );  } } }); "+
		"});</script>";			
	html += '<button id="'+id+modalName+'Bt">'+modalName+'</button>';
	html += '<script>  $(function() { $( "#'+id+modalName+'Bt" ).button( { icons:{primary: "'+icon+'"}, text: false } ).click( '+
		"function() { "+jscall+" }); }); </script>";		
	return html;
}

//======= Code for "creModal" hook, requires "addActionBtn"  ================================================
function layout-editor_CreModalFromMeta( id, modalName, resourceURL, paramObj  ) {
	log( "PoNG-Help", "Get help: '"+resourceURL+"/help'");
	var lang = getParam( 'lang' );
	if ( lang == '' ) {
		lang = "EN";
	}	
	var resourceSub = ""; // e.g. "/help"
	$.get( resourceURL+resourceSub, 
		{ lang: lang }, // other params required?
		function( divHtml ) {
			$(  "#"+id+modalName+"Dialog" ).html( '<div class"layout-editor-modal">'+divHtml+'</div>' );
			log( "layout-editor", "loaded" );
		}
	).fail(
		function() {
			logErr( "layout-editor", "Can't load modal form content from '"+resourceURL+resourceSub );
		}
	);
}
*/