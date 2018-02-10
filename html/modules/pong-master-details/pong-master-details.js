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
log( "PoNG-Master-Details", "Loading Module");

function pongMasterDetailsHTML( divId, resourceURL, params ) {
	log( "PoNG-Master-Details", "Create view id='"+divId+"': "+resourceURL);
	
	if ( moduleConfig[ divId ] != null ) {
		pongMasterDetailsRenderHTML( divId, resourceURL, params, moduleConfig[ divId ]  ) 
	} else {
		$.getJSON( 
			resourceURL+"/pong-master-details", 
			function( pmd ) {
				pongMasterDetailsRenderHTML( divId, resourceURL, params, pmd );
			}
		);					
	}	
}

function pongMasterDetailsRenderHTML( divId, resourceURL, params, pmd ) {
	log( "PoNG-Master-Details", "start '"+pmd.description+"'");

	var contentItems = [];
	contentItems.push( '<div id="'+divId+'PongMasterDetailsDiv" class="pongMasterDetailsFrm">' );
	contentItems.push( '<form id="'+divId+'PongMasterDetailsFrm">' );
	contentItems.push( '<fieldset>' );
	if ( pmd.label != null ) {				
		contentItems.push( '<legend>'+ $.i18n( pmd.label )  +'</legend>' );
	}
	postLst = [];						
	var first = true;
	for ( var i = 0; i < pmd.fields.length; i++ ) {
		var field = pmd.fields[i];
		log( "PoNG-Master-Details", "field '"+field.id+"'");

		contentItems.push( '<div class="pongMasterDetailsFrmField">' );
		
		if ( field.cellType == 'id' ) {
			
		} else {
			contentItems.push( '<p><label for="'+divId+field.id+'">'+ $.i18n( field.label ) +'</label>' );
			var nameAndClass = 'name="'+field.id+'" id="'+divId+field.id+'" class="text ui-widget-content ui-corner-all"'; 
			postLst.push( field.id+": $( '#"+divId+field.id+"' ).val()" )
			contentItems.push( '<input type="text" '+nameAndClass+'/>' );
			if ( first ) { 
				contentItems.push( '<button id="'+divId+'MasterSrchBt">'+  $.i18n( 'Lookup' ) +'</button>' );
				contentItems.push( '<script>' );
				contentItems.push( '  $(function() { ' );
				contentItems.push( '       $( "#'+divId+'MasterSrchBt" ).click(' );
				contentItems.push( '          function() { ' );
				contentItems.push( '              $( "#'+divId+'PongMasterModalSrchDialog" ).dialog( "open" ); return false;' );
				contentItems.push( '          }' );
				contentItems.push( '       ); ' );
				contentItems.push( '  }); ' );
				contentItems.push( '</script>' );		
				first = false;
			}
			contentItems.push( '</p>' );
									
		}
		contentItems.push( '</div>' );				
	}
	
	contentItems.push( '</form>' );
	contentItems.push( '</fieldset>' );
	contentItems.push( '</div>' );

	// Load Master Data 
	var idParam = '';
	if ( params != null && params.id != null ) {
		idParam = '?'+pmd.id+'='+params.id;
		log( "PoNG-Master-Details", 'Data Query "'+idParam+'"');
		$.getJSON( 
				resourceURL+idParam, 
				function( master ) {
					for ( var i = 0; i < pmd.fields.length; i++ ) {
						log( "PoNG-Master-Details", pmd.fields[i].id+	' >>  #'+divId+field.id+'  value >>'+master[ pmd.fields[i].id ] );
						$( '#'+divId+pmd.fields[i].id ).val( master[ pmd.fields[i].id ] );
					}							
				}
		);
		idParam = params.id;
	}
	
	var getLst = [];
	// Set up master data search from (modal dialog)
	contentItems.push( '<div id="'+divId+'PongMasterModalSrchDialog" class="pongMasterModalSrchDialog">' );
	for ( var i = 0; i < pmd.searchFilter.searchFields.length; i++ ) {
		var fld = pmd.searchFilter.searchFields[i];
		contentItems.push( '<p><label for="'+divId+"Srch"+fld.id+'">'+ $.i18n( fld.label ) +'</label>' );
		var nameAndClass = 'name="'+fld.id+'" id="'+divId+'Srch'+fld.id+'" class="text ui-widget-content ui-corner-all"'; 
		getLst.push( fld.id+": $( '#"+divId+'Srch'+fld.id+"' ).val()" )
		contentItems.push( '<input type="text" '+nameAndClass+'/></p>' );				
	}
	contentItems.push( '<button id="'+divId+'MasterGetSrchBt">'+  $.i18n( 'Lookup' ) +'</button>' );
	contentItems.push( '<div id="'+divId+'SrchResult" class="pongMasterModalSrchResult"></div>' );
	
	contentItems.push( '<script>' );
	contentItems.push( '  $(function() { ' );
	contentItems.push( '       $( "#'+divId+'MasterGetSrchBt" ).click(' );
	contentItems.push( '          function() { ' );
	contentItems.push( '             $.getJSON( "'+resourceURL+'", { '+ getLst.join(', ') +' },' );
	contentItems.push( '                  function( data ) { ' );
	contentItems.push( '                      pongMasterModalSearchTable( "'+divId+'", "'+resourceURL+'", '+JSON.stringify( pmd )+', data ); ' );
	contentItems.push( '                      return false; ' );
	contentItems.push( '                  } ' );
	contentItems.push( '             );' );
	contentItems.push( '          }' );
	contentItems.push( '       ); ' );
	contentItems.push( '  }); ' );
	contentItems.push( '</script>' );		

	contentItems.push( '</div>' );
	contentItems.push( '<script>' );
	contentItems.push( '$( function() { ' );
	contentItems.push( '  $( "#'+divId+'PongMasterModalSrchDialog" ).dialog( ' );
	contentItems.push( '       { autoOpen: false, height: 600, width:600, modal: true ' );
	contentItems.push( '         ,buttons: { ' );
	contentItems.push( '            "'+$.i18n("Cancel")+'": function() { $( this ).dialog( "close" ); }' );
	contentItems.push( '          } ' );
	contentItems.push( '        } ); ' );
	contentItems.push( '} );' );
	contentItems.push( '</script>' );

	for ( var i = 0; i < pmd.associations.length; i++ ) {
		var ass = pmd.associations[i];
		log( "PoNG-Master-Details", "association: '"+ass.label+"'");
		contentItems.push( '<div class="pongMasterDetailsDetails">' );
		contentItems.push( '<h4>'+ $.i18n( ass.label ) +'</h4>' );
		contentItems.push( '<div id="'+divId+'D'+i+'">' );
		contentItems.push( '...' );
		contentItems.push( '</div>' );
		contentItems.push( '</div>' );
	}
	
	$( "#"+divId ).html( contentItems.join( "\n" ) );
	
	for ( var i = 0; i < pmd.associations.length; i++ ) {
		var ass = pmd.associations[i];
		log( "PoNG-Master-Details", "association data: '"+ass.label+"'");
		if ( ass.tableDef != null ) {
			pongTableDivHTML( divId+'D'+i , ass.resourceURL, { "filter": [ { "field": pmd.id , "value": idParam } ], "def": ass.tableDef  }  ); 
		} else if ( ass.listDef != null ) {
			pongListDivHTML( divId+'D'+i , ass.resourceURL, { "filter": [ { "field": pmd.id, "value": idParam } ], "def": ass.listDef  }  ); 	
		} else  {
			pongTableDivHTML( divId+'D'+i , ass.resourceURL ); 
		}
	}
}

function pongMasterModalSearchTable ( divId, resourceURL, pmd, data ) {
	log( 'PoNG-Master-Details', 'pongMasterModalSearchTable'+divId ); 
	var tbl = [];
	tbl.push( '<table id="'+divId+'pongMasterModalSearchTable" class="pongMasterModalSearchTable">' );
	for ( var i = 0; i < data.length; i++ ) {
		tbl.push( '<tr>' );
		for ( var j = 0; j < pmd.searchFilter.searchFields.length ; j++ ) {
			tbl.push( '<td>'+data[i][ pmd.searchFilter.searchFields[ j ].id ] +'</td>' );
		}
		tbl.push( '<td><a href="' +data[i][ pmd.id ] +'" class="selectMasterLnk">'+ $.i18n( "Select" )+'</a></td>' );
		tbl.push( '</tr>' );
	}
	tbl.push( '</table>' );
	tbl.push( '<script>' );
	tbl.push( ' $( "#'+divId+'pongMasterModalSearchTable a" ).click( ' );
	tbl.push( '   function() { ' ); 
	tbl.push( '      $( "#'+divId+'PongMasterModalSrchDialog" ).dialog( "close" );');
	tbl.push( '      pongMasterDetailsHTML( "'+divId+'", "'+resourceURL+'", { "id": $(this).attr("href") } );' );
	tbl.push( '      return false;' ); 
	tbl.push( '   }' ); 
	tbl.push( ' );' ); 
	tbl.push( '</script>' );
	$( "#"+divId+'SrchResult' ).html( tbl.join( "\n" ) );
}