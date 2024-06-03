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
    dataURL           : null,
    expand            : {}
  };

  poTbl[ divId ].divId = divId;
}

function pongTableDivHTML( divId, resourceURL, params, theModuleConfig ) {
  log( "Pong-Table",  "pongTableDivHTML: divId="+divId+" resourceURL="+resourceURL );

  console.log( "Pong-Table",  "pongTableDivHTML: divId="+divId+" resourceURL="+resourceURL+"params=",params," theModuleConfig=", theModuleConfig );
  pongTableInit( divId, "PongTable" );


  if  ( moduleConfig[ divId ] != null ) {
    
    pongTableDivRenderHTML( divId, resourceURL, params, moduleConfig[ divId ] );
    
  } else if ( theModuleConfig ) {

    pongTableDivRenderHTML( divId, resourceURL, params, theModuleConfig );

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
  if ( ! tbl ) { return alert('ERROR: Table config missing!') }
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
  poTbl[ divId ].params = params;

  poTbl[ divId ].pongTableEndRow = tbl.maxRows;
  var contentItems = [];
  
  // create form if required
  contentItems = pongTableRenderFilterHTML( divId, resourceURL, params, tbl );	
  log( "Pong-Table", "cre table 1" );

  contentItems.push( '<div id="'+divId+'PongTableDiv"  class="pongTableDiv">' );
  contentItems.push( '<table id="'+divId+'PongTable" class="pongTable">' );
  // create table head
  contentItems.push( '<thead><tr class="'+divId+'HeaderRow HeaderRow">' );
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
      } else if ( tbl.cols[i].cellType == 'cssClass' ) {
        // do noting
      } else if ( tbl.cols[i].cellType == 'textLink' ) {
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
  contentItems.push( "</tr></thead><tbody>" );
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
      contentItems.push( "</tr></div>" );
    }	  
  }
  contentItems.push( "</tbody></table>" );
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
  
  if ( tbl.height ) {
    $( "#"+divId+'PongTableDiv' ).height(  tbl.height );
  } else 
  if ( ! $( '#'+divId ).hasClass( 'autoheight' ) ) { // floating length
    var tHeight = $( "#"+divId ).height();
    if ( $( '#'+divId+'SrchFrmDiv' ).height() ) {
      tHeight -= $( '#'+divId+'SrchFrmDiv' ).height();
    } 
    if ( $( '#'+divId+'Pagin' ).height() ) {
      tHeight -= $( '#'+divId+'Pagin' ).height();
    } 
    //alert( $( "#"+divId ).height() +' - '+ $( '#'+divId+'SrchFrmDiv' ).height() );
    $( "#"+divId+'PongTableDiv' ).height( tHeight );
  }

  // if there is no paginator:
  if ( ! tbl.maxRows ) {
    $( '#'+divId+'PongTableDiv' ).css( 'overflow', 'auto' );
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
      let dId = divId.replaceAll('-','_')
      pollHTML.push( '<script>' );
      pollHTML.push( '  function pongTableUpdateTimer'+dId+'() { ' );
      pollHTML.push( '       if ( poTbl[ "'+divId+'" ].polling ) { ' );
      if ( tbl  && tbl.filter ) {
        pollHTML.push( '        pongTableUpdateData( "'+divId+'", true  ); ' );
      } else {
        pollHTML.push( '        pongTableUpdateData( "'+divId+'", false ); ' );
      }
      pollHTML.push( '        }' );
      pollHTML.push( '  }' );
      pollHTML.push( '</script>' );
      $( "#"+divId ).append( pollHTML.join("\n") );
      log( "PoNG-Table", ">>>>> create pongTableUpdateTimer t="+t );
      poolDataTimerId = setInterval( "pongTableUpdateTimer"+dId+"()", t*1000 );
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
    if ( tbl.filter ) {
      pongTableUpdateData( divId, true );
    } else if ( params.subTableQry ) {
      pongTableUpdateData( divId, params.subTableQry );
    } else {
      pongTableUpdateData( divId, false );	  
    } 
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
      var postLst = [];						
      for( var y = 0; y < tbl.filter.dataReqParams.length; y++ ) {
        prop = tbl.filter.dataReqParams[y];
        contentItems.push( '<p><label for="'+divId+prop.id+'filter">'+ $.i18n( prop.label ) +'</label>' );
        var nameAndClass = 'name="'+prop.id+'" id="'+divId+prop.id+'filter" class="text ui-widget-content ui-corner-all"';
        if ( prop.description ) { nameAndClass += ' title="'+prop.description+'"'} 
        postLst.push( '"'+prop.id+'"'+": $( '#"+divId+prop.id+"filter' ).val()" );

        if ( prop.type && prop.type == 'date' ) {

          var fmt = $.i18n( ( prop.format ? prop.format : 'yy-mm-dd' ) ); 
          var editable = '';
          var datrStr  = ''  
          if ( prop.defaultVal ) {
            var unixDt = parseInt( prop.defaultVal  ); //TODO no default defined ??
            log( "Pong-Table", 'Filter Date  format:'+ fmt + ' '+unixDt);
            var theDate = ( unixDt > 30000000000 ? new Date( unixDt ) : new Date( unixDt*1000 ) );
            datrStr = $.datepicker.formatDate( fmt, theDate );
          }
          // var datrStr = moment( theDate ).format( fmt );
          contentItems.push( '<input type="text" '+	nameAndClass+' class="dateinput" value="'+datrStr+'" /></p>'
              +'<script> $( "#'+divId+prop.id+'filter" ).datepicker( {dateFormat:"'+fmt+'"} ); </script>' 
          );
        
        } else if ( prop.type && prop.type == 'select' && prop.options ) {

          var selVal = ( prop.defaultVal ? ' value="'+prop.defaultVal+'"' : '' );
          contentItems.push( '<select '+	nameAndClass + selVal+'>' );
          for ( var so = 0; so < prop.options.length; so++ ) {
            var optValue = ( prop.options[so].value ? 'value="'+prop.options[so].value+'"' : 'value="'+field.options[so].option+'"' );					 
            contentItems.push( '<option '+optValue+'>'+ $.i18n( prop.options[so].option ) +'</option>' );	
            log( "Pong-Table",'<option '+optValue+'>'+ $.i18n( prop.options[so].option ) +'</option>' )
          }
          contentItems.push( '</select></p>' );

        } else if ( prop.type && prop.type == 'checkbox'  ) {

          var cbValue = 'value="'+prop.id+'" ';
          var modifier = '';
          if ( prop.defaultVal != null && 
             ( prop.defaultVal === true || prop.defaultVal == 'true' ) ) { 
              modifier += ' checked'; 
          }
          contentItems.push( '<input type="checkbox" '+ cbValue + nameAndClass  + modifier +'/>' );
          
  
        } else { // default type => text 
          var val = '';
          if ( prop.defaultVal ) { val = prop.defaultVal }
          contentItems.push( '<input type="text" '+nameAndClass+' value="'+val+'" /></p>' );
        }
        // TODO add field types
      }
      log( "Pong-Table", "cre filter 3" );
      var btTxt = "Search";
      if ( tbl.filter.dataReqParamsBt != null ) { btTxt = tbl.filter.dataReqParamsBt}
      contentItems.push( '<button id="'+divId+'SrchBt">'+  $.i18n( btTxt ) +'</button>' );
      contentItems.push( '</fieldset>' );
      contentItems.push( "</form>" );


      log( "Pong-Table", "cre filter 4" );
      poTbl[ divId ].pongTableFilter = postLst.join( "," );

      log( "Pong-Table", "cre filter 5" );
      contentItems.push( "<script>" );
      contentItems.push( '$(function() { ' );
      contentItems.push( '    $( "#'+divId+'SrchBt" ).button().click( ' );
      contentItems.push( '       function( event ) { ' );
      contentItems.push( '           poTbl[ "'+divId+'" ].pongTableStartRow = 0; ');
      contentItems.push( '           poTbl[ "'+divId+'" ].pongTableEndRow = poTbl[ "'+divId+'" ].pongTableDef.maxRows; ');
      contentItems.push( '           event.preventDefault(); ' );
      contentItems.push( '           udateModuleData( "'+divId+'", { dataFilter: { '+poTbl[ divId ].pongTableFilter+' } } ); ' );
      contentItems.push( '          return false;  ' );
      contentItems.push( '       }' );
      contentItems.push( '     );  ' );
      contentItems.push( ' }); ' );
      contentItems.push( "</script>" );
      
      contentItems.push( '</div>' );
      log( "Pong-Table", "cre filter 6" );
    } if ( tbl.filter.dataReqParamsSrc == 'sessionInfo' ) {
      log( "Pong-Table", "cre filter sessionInfo (TODO)" );
      // TODO implement pongForm sessionInfo
    }
  }
  return contentItems;
}

// ============================================================================

function pongTablePostSelectChange( divId, dataUrl, tbl, val ) {
  var rowIdVal  =  ""; 
  var postParam =  { };
  var tblDef = poTbl[ divId ].pongTableDef;
  if ( ( typeof tblDef.rowId === 'string' ) ) {
    var rowIdVal =  poTbl[ divId ]["pongTableData"][ tbl.data("r") ][ tblDef.rowId ]; 
    postParam[ tblDef.rowId ] = rowIdVal; 
  } else if ( Array.isArray( tblDef.rowId ) ) {
    for ( var x = 0; x < tblDef.rowId.length; x++ ) {
      postParam[ tblDef.rowId[x] ] = poTbl[ divId ].pongTableData[ tbl.data("r") ][ tblDef.rowId[x] ];
    }
  } else {  // something is wrong
    log( "Pong-Table", "can't evaluate params for pongTablePostSelectChange" );
    return; 
  }
  var colId =  tbl.data("cid"); 
  postParam[ colId ] = val;
  log( "Pong-Table", "Post "+dataUrl+"  " + JSON.stringify(postParam) ); 
  $.post( 
    dataUrl, postParam, 
    function( response ) { }, 
    "json"
  ).done( 
    function(){ publishEvent( "feedback", {"text":"Row saved sucessfully"} ) } 
  ).fail( function( e ){ 
    if ( e && e.status != 200 ) { alert("Error:\\n"+e.responseText ) }
    publishEvent( "feedback", {"text":"ERROR: Could not save row!"} ) 
  });
}

// ============================================================================

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
  contentItems.push( '  $( "#'+divId+'PongTable" ).on( "change", ".changeSelect", ' );
  contentItems.push( '         function( event ) { ' );
  contentItems.push( '            var tbl = $(this); ' );
  contentItems.push( '            pongTablePostSelectChange( "'+divId+'", "'+dataUrl+'", tbl, this.value ); ' );
  contentItems.push( '            event.preventDefault(); return false; ' );
  contentItems.push( '         } ); ');
  
  // TODO: change to something like "pongTablePostSelectChange"
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
  contentItems.push( '            var colId =  tbl.data("cid"); ' );
  contentItems.push( '            var colVal =  tbl.is(":checked"); ' ); // TODO: need if(checkbox) ???
  contentItems.push( '            postParam[ colId ] =  colVal; ' );
  //contentItems.push( '            alert( "Post '+dataUrl+' "+ JSON.stringify(postParam) ); ' );
  contentItems.push( '            $.post( ' );
  contentItems.push( '               "'+dataUrl+'", postParam, function( response ) { }, "json"' );
  contentItems.push( '               ).done( ' );
  contentItems.push( '                  function(){ publishEvent( "feedback", {"text":"Row saved sucessfully"} ) } ' );
  contentItems.push( '               ).fail( function( e ) { ' );
  contentItems.push( '                 if ( e && e.status != 200 ) { alert("Error:\\n"+e.responseText ) }');
  contentItems.push( '                 publishEvent( "feedback", {"text":"ERROR: Could not save row!"} ) ' );
  contentItems.push( '               });');
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
  contentItems.push( '  ).on( "mouseout", ".editableTblCell,.editableTblCellX", ' );
  contentItems.push( '         function() { $(this).parent().toggleClass( "optedithighlight", false ); return $(this); }' );
  contentItems.push( '  );' );
  contentItems.push( '  $( "#'+divId+'PongTable" ).on( "focus", ".editableTblCell", ' );
  contentItems.push( '     function() { pongTableSpanToInput( $(this) ); }');
  contentItems.push( '  ).on( "focusout", ".editableTblCellX", function() { ' );
  contentItems.push( '     var tbl = $(this); ' );
  contentItems.push( '     pongTableInputToSpan( tbl );');
  contentItems.push( '     if ( tbl.data("before") !== tbl.val() ) { ' );
  contentItems.push( '        tbl.data("before", tbl.val()); ' ); 
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
  contentItems.push( '        var colId =  tbl.data("cid"); ' );		
  contentItems.push( '        var colVal =  tbl.val(); ' );
  contentItems.push( '        postParam[ colId ] =  colVal; ' );
  contentItems.push( '        $.post( ' );
  contentItems.push( '           "'+dataUrl+'", postParam , function(response) {  }, "json"' );
  contentItems.push( '        ).done( ' );
  contentItems.push( '           function(){ publishEvent( "feedback", {"text":"Row saved sucessfully"} ) } ' );
  contentItems.push( '        ).fail( function( e ) { ' );
  contentItems.push( '           if ( e && e.status != 200 ) { alert("Error:\\n"+e.responseText )}');
  contentItems.push( '           publishEvent( "feedback", {"text":"ERROR: Could not save row!"} ) ' );
  contentItems.push( '        });');
  //contentItems.push( '        alert( "Post Data Error: { '+tbl.rowId+': "+rowIdVal+", "+colId+": "+colVal+" }   (r="+tbl.data("r") + "/c="+tbl.data("c")+") not stored!!"  ); ' );
  contentItems.push( '     }' );
  contentItems.push( '     return tbl;' );
  contentItems.push( '  }); ');
  contentItems.push( " }); </script>" );

  return contentItems;
}

function pongTableSpanToInput( tbl ) {
  var colVal = tbl.html().trim(); 
  if ( colVal == "&nbsp;&nbsp;&nbsp;&nbsp;" ) { colVal=""; }
  var attr = 'id="'+tbl.attr("id")+'" '; 
  attr += 'value="'+colVal+'" '; 
  attr += 'data-before="'+colVal+'" '; 
  attr += 'data-r="'+tbl.data("r")+'" '; 
  attr += 'data-c="'+tbl.data("c")+'" '; 
  attr += 'data-cid="'+tbl.data("cid")+'" '; 
  tbl.parent().html( '<input '+attr+' class="editableTblCellX"><div class="ui-icon ui-icon-pencil editmarker"></div>' ); 
  $( "#"+tbl.attr("id") ).focus(); 
}

function pongTableInputToSpan( tbl ) {
  var attr = 'id="'+tbl.attr("id")+'" '; 
  attr +=  'data-r="'+tbl.data("r")+'" '; 
  attr +=  'data-c="'+tbl.data("c")+'" '; 
  attr +=  'data-cid="'+tbl.data("cid")+'" '; 
  var cVal =  tbl.val(); 
  if ( cVal == "" ) { cVal = "&nbsp;&nbsp;&nbsp;&nbsp;";}
  if ( cVal.indexOf('http://') == 0 || cVal.indexOf('https://') == 0 || cVal.indexOf('sftp://') == 0 ) {
    tbl.parent().html( '<a href="'+cVal.trim()+'" class="ui-icon  ui-icon-extlink linkicon" target="_blank"></a>&nbsp;'
      +'<span '+attr+' class="editableTblCell" contenteditable="true">'+cVal+'</span>'
      +'<div class="ui-icon ui-icon-pencil editmarker"></div>' ); 
  }else {
    tbl.parent().html( '<span '+attr+' class="editableTblCell" contenteditable="true">'
      +cVal+'</span><div class="ui-icon ui-icon-pencil editmarker"></div>' ); 
  }
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
function pongTableUpdateData( divId, doFilter ) {
 console.log( "Pong-Table",  'update '+divId, doFilter );
  var tblDef = poTbl[ divId ].pongTableDef;
  var paramsObj = null;
  if ( doFilter && tblDef.filter) {
    var fPar = {};
    for( var y = 0; y < tblDef.filter.dataReqParams.length; y++ ) {
      prop = tblDef.filter.dataReqParams[y];
      if ( prop.type != 'checkbox' ) {
        fPar[ prop.id] = encodeURI( $( '#'+divId+prop.id+'filter' ).val() );
      } else {
        fPar[ prop.id] = $( '#'+divId+prop.id+'filter' ).is(':checked');
      }
    } 
    paramsObj =  { dataFilter: fPar }
  } else if ( doFilter ) {
    paramsObj = doFilter;
  }
  console.log( "Pong-Table",  'update paramsObj= ',paramsObj );

  if ( poTbl[ divId ].resourceURL != '-' ) {
    
    var callParams = {} // merge paramsObj and GET-params:
    if ( paramsObj == null) {
      callParams = poTbl[ divId ].params.get;
    } else {
      if ( poTbl[ divId ].params.get ) {
        callParams = JSON.parse( JSON.stringify ( poTbl[ divId ].params.get ) );
        for ( var attr in paramsObj ) { 
          callParams[ attr ] = paramsObj[ attr ]; 
        }  
      }
    }
    console.log( "Pong-Table",  'update parma= ',callParams );

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
  console.log( "Pong-Table",  'set data hook: '+divId+ " "+dataDocSubPath );
  console.log( "Pong-Table", data );  
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
// TODO get resize working
  
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
  
  console.log( "Pong-Table", poTbl[ divId ].pongTableDef );
  var dtaArr = poTbl[ divId ].pongTableData;
  var rowSt  = 0;
  var rowEn  = dtaArr.length;
  var i = 0;
  console.log( "tblCells rowEn", rowEn )
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
    if ( rowSt > dtaArr.length ) {
      poTbl[ divId ].pongTableStartRow = 0;
      poTbl[ divId ].pongTableEndRow   = poTbl[ divId ].pongTableDef.maxRows;
      rowSt = 0;
      rowEn = poTbl[ divId ].pongTableDef.maxRows;
    }
    log( "Pong-Table", "update paginaor label" );  
    var rPP = parseInt( poTbl[ divId ].pongTableDef.maxRows );
    var maxP = Math.ceil( dtaArr.length / rPP );
    var curP = Math.round( rowEn / rPP );
    $( "#"+divId+'PaginLbl' ).html( $.i18n( "page" )+" "+curP+"/"+maxP+ " ("+dtaArr.length+" "+$.i18n("rows")+")" );
    $( '#'+divId+'PongTable' ).find( "td" ).html( '...' );

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
            ( tbl.cols[c].cellType != 'textLink' ) && 
            ( tbl.cols[c].cellType != 'cssClass' ) && 
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
    var rowIdVal =  dtaArr[r][ poTbl[ divId ].pongTableDef.rowId ];
    //console.log( '>>>>>>>> '+ poTbl[ divId ].pongTableDef.rowId + JSON.stringify(dtaArr[r]) )
    if ( r < dtaArr.length ) {
      log( "Pong-Table", "row "+r );	
      var cellDta = dtaArr[r];
      
      
      for ( var c = 0; c < poTbl[ divId ].pongTableDef.cols.length; c++ ) {
        log( "Pong-Table", "col "+c );	
        var cellDef = poTbl[ divId ].pongTableDef.cols[c];
        var cellId =  '#'+divId+'R'+i+'C'+c; 
        tblUpdateCell( divId, cellDef, r, c, i, cellDta, cellId, rowIdVal, divId );
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

function tblUpdateCell( divId, cellDef, r, c, i, cellDta, cellId, rowIdVal, tblDiv ) {
  log( "Pong-Table", 'tblUpdateCell '+cellId+' cellDef:'+JSON.stringify( cellDef ) );
  
  var dataUrl = '';
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
    cellVal += '';
    if ( ( cellDef.editable != null ) && ( ( cellDef.editable == "true" ) || ( cellDef.editable === true)) ) { 
      var lnkIco = "";
      if ( cellVal.indexOf('http://') == 0 || cellVal.indexOf('https://') == 0 || cellVal.indexOf('sftp://') == 0 ) {
        lnkIco = '<a href="'+cellVal.trim()+'" class="ui-icon  ui-icon-extlink linkicon" target="_blank"></a>&nbsp;';
      }
      editable = 'contenteditable="true" class="editableTblCell" data-r="'+r+'" data-c="'+c+'" data-cid="'+cellDef.id+'"'; 
      $( cellId ).html( '<div style="position:relative" class="editable cell'+cellDef.id.replace(/\./g,'')+'"">'
        +lnkIco+'<span id="'+divId+'R'+i+cellDef.id+'" '+editable+'>'+cellVal + '</span>'
        +'<div class="ui-icon ui-icon-pencil editmarker"></div></div>' );
    } else { 
      if ( cellVal.indexOf('http://') == 0 || cellVal.indexOf('https://') == 0 ) {
        $( cellId ).html( '<span id="'+divId+'R'+i+cellDef.id+'" class="cell'+cellDef.id.replace(/\./g,'')+'"><a href="'+ cellVal +'" target="_blank">'+ cellVal +'</a></span>' );
      } else {
        $( cellId ).html( '<span id="'+divId+'R'+i+cellDef.id+'" class="cell'+cellDef.id.replace(/\./g,'')+'">'+ cellVal +'</span>' );             
        //TODO why additional span ?? $( cellId ).html( '<span id="'+divId+'R'+i+cellDef.id+'">'+ cellVal +'</span><span class="ui-icon ui-icon-plusthick " style="display:inline-block" />' );             
      }
    }
  } else if ( cellType == 'number' ) {

    var noStr = '-';
    if ( cellVal != '' ){
      noStr = cellVal;
      if ( cellDef.digits ) {
        var noVal = Number.parseFloat( cellVal );
        var digits = Number.parseInt( cellDef.digits );
        if ( ! isNaN( noVal) && ! isNaN( digits) ) { 
          noStr = noVal.toFixed( digits ); 
        }
      }
    }
    if ( ( cellDef.editable != null ) && ( ( cellDef.editable == "true" ) || ( cellDef.editable === true)) ) { 
      editable = 'contenteditable="true" class="editableTblCell" data-r="'+r+'" data-c="'+c+'" data-cid="'+cellDef.id+'"'; 
      $( cellId ).html( '<div style="position:relative" class="editable cell'+cellDef.id.replace(/\./g,'')+'""><span id="'+divId+'R'+i+cellDef.id+'" '+editable+'>'+noStr + '</span><div class="ui-icon ui-icon-pencil editmarker"></div></div>' );
    } else { 
        $( cellId ).html( '<span id="'+divId+'R'+i+cellDef.id+'" class="cell'+cellDef.id.replace(/\./g,'')+'">'+ noStr +'</span>' );             
    }

  } else if ( cellType == 'date' || cellType == 'datems' ) {
    
    var cls = 'cell'+cellDef.id.replace(/\./g,'') + ' pongDate '
    var fmt = $.i18n( ( cellDef.format ? cellDef.format : 'YYYY-MM-DD HH:mm' ) ); 
    //console.log( JSON.stringify(cellDef) )
    var unixDt = parseInt( cellVal )
    log( "Pong-TableX", 'Date: ID="'+cellId+ '"  format:'+ fmt + ' '+unixDt);
    var theDate = ( cellType == 'datems' ? new Date( unixDt ) : new Date( unixDt*1000 ) );
    //old 
    //var datrStr = $.datepicker.formatDate( fmt, theDate );
    // new
    var datrStr = '-';
    if ( ! isNaN( unixDt ) ) { datrStr = moment( theDate ).format( fmt ); }
    if ( ( cellDef.editable != null ) && ( ( ( ( cellDef.editable == "true" ) || ( cellDef.editable === true)) )  && poTbl[ tblDiv ] && poTbl[ tblDiv ].dataURL) ) {
      editable = ' data-r="'+r+'" data-c="'+c+'"  data-cid="'+cellDef.id+'"';
      var cID = divId+'R'+i+cellDef.id;
      //poTbl[ tblDiv ].pongTableDef.rowId;
      $( cellId ).html( '<div style="position:relative" class="editable cell'+cellDef.id.replace(/\./g,'')+' editdatepicker">'
          +'<span id="'+cID+'" class="'+cls+'" '+editable+'>'+ datrStr +'</span>'
          +'<div id="'+cID+'editmarker" class="ui-icon ui-icon-pencil editmarker"></div></div>'
          +'<script>$("#'+cID+'").datepicker( "isDisabled" ); '
          +'$("#'+cID+'editmarker").click( function(){ $("#'+cID+'").datepicker("dialog", new Date('+theDate.valueOf()+'), '
          +'function(d){ var dtv=new Date(d).valueOf();'
          +'$.post( "'+poTbl[ tblDiv ].dataURL+'", { '+poTbl[ tblDiv ].pongTableDef.rowId+':"'+rowIdVal+'", '+cellDef.id+':dtv }, function(response) { }, "json"'
          +' ).done( function(){ publishEvent( "feedback", {"text":"Row saved sucessfully"} ) } ' 
          +' ).fail( function(e){ if ( e && e.status != 200 ) { alert("Error:\\n"+e.responseText ) } publishEvent( "feedback", {"text":"ERROR: Could not save row!"} ) } );' 
          // known: wrong data still in poTbl[ tblDiv ].pongTableData -- but who cares
          +'$( "#'+cID+'" ).html( moment( new Date( d ) ).format( "'+fmt+'" ) ); '
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

    var cID = cellId.substr(1)+'Canvas';
    $( cellId ).html( '<canvas id="'+ cID +'" width="auto" height="auto"></canvas>'
      + '<div id="'+cID+'TT" class="tableCanvasToolTip" style="display:none;"></div>' 
      + '<script>'
      + 'var canvas = document.getElementById( "'+cID+'" );'
      + 'canvas.addEventListener( "mousemove", function( evt ) { pongTblCanvasMouse( "'+cID+'", "'+divId+'",evt ); });'
      + '</script>'
      );
    var canvas = document.getElementById( cID );
    canvas.width  = $( cellId ).innerWidth()
    canvas.height = $( cellId ).innerHeight()
    // canvas.addEventListener( 'mousemove', function(evt) {
    //   pongTblCanvasMouse( canvas, evt );
    // });
    var def    = JSON.parse( JSON.stringify( cellDef ) )
    def.pos    = { x:0, y:0 }
    def.width  = canvas.width
    def.height = canvas.height
    var ctx = canvas.getContext("2d")
    
    pongTblRenderGraph( divId, ctx, def, cellVal, cID );
    
    
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
    
    if ( ( cellDef.editable != null ) && ( ( cellDef.editable == "true" ) || ( cellDef.editable === true)) ) { 
      editable = 'class="postchange"  data-r="'+r+'" data-c="'+c+'" data-cid="'+cellDef.id+'""';
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
    $( cellId ).html( '<input type="checkbox" class="rowSelector"  data-r="'+r+'" data-c="'+c+'"  data-cid="'+cellDef.id+'" value="selected" id="'+divId+'R'+i+cellDef.id+'" '+selected+' />' );
    
  } else if ( cellType == 'linkLink' || cellType == 'link' ) {
    
    var target = '';
    if ( cellDef.target != null ) {
      target = 'target="'+cellDef.target+'"';
    }
    var url = cellVal;
    if ( cellDef.URL != null ) {
      url = cellDef.URL;
    }
    if ( url && url != '' && poTbl[ tblDiv ].pongTableDef.rowId != null ) {
      //if ( ( ajaxType == 'GET' ) || ( ajaxType == 'DELETE' ) ) {
        url = addRowIdGetParam ( tblDiv, url, cellDta );
      //} 
      //param = getRowIdPostParam ( divId, cellDta );         
    } 
    if ( url != '' ) {
      $( cellId ).html( '<a href="'+url+'" id="'+divId+'R'+i+cellDef.id+'" '+target+' class="cell'+cellDef.id.replace(/\./g,'')+'">'+$.i18n( cellDef.label )+'</a>' );
    } else {
       $( cellId ).html( '' )
    }
    
  } else if ( cellType == 'select' && cellDef.options ) {
    var selVal = ( cellVal ? ' value="'+cellVal+'"' : '' );
    var html = '<select id="'+divId+'R'+i+cellDef.id+'"' + selVal+' class="changeSelect" data-r="'+r+'" data-c="'+c+'" data-cid="'+cellDef.id+'">';
    for ( var so = 0; so < cellDef.options.length; so++ ) {
      var optValue = ( cellDef.options[so].value ? cellDef.options[so].value : cellDef.options[so].option );					 
      var selY = '';
      if ( cellVal === optValue ) { selY = 'selected' }
      html += '<option value="'+optValue+'"  '+selY+'>'+ $.i18n( cellDef.options[so].option ) +'</option>';	
      log( "Pong-Table",'<option value="'+optValue+'" '+selY+'>'+ $.i18n( cellDef.options[so].option ) +'</option>' )
    }
    html +='</select>';
    $( cellId ).html( html )

  } else if ( cellType == 'img' ) {

    if ( cellDef.nozoom  ) {
      if ( cellVal ) {
        $( cellId ).html( '<img src="'+cellVal+'" id="'+divId+'R'+i+cellDef.id+'" class="img'+divId+'C'+c+' pongtblimg" />'); 
      }

    } else {
      var tblImg  = cellVal; // TODO impl zoom image
      var zoomImg = cellVal; // TODO impl zoom image
      
//    //search for zoom image def
    if ( poTbl[ tblDiv ] && poTbl[ tblDiv ].pongTableDef )
      for ( var cZI = 0; cZI < poTbl[ tblDiv ].pongTableDef.cols.length; cZI++ ) {
        var cellDefZI = poTbl[ tblDiv ].pongTableDef.cols[ cZI ];
        if ( cellDefZI.cellType == 'largeimg' && cellDefZI.forImg && cellDefZI.forImg == cellDef.id ) { // found
          var cellValZI = getSubData( cellDta, cellDefZI.id );
          if ( cellValZI != null ) { zoomImg = cellValZI }              
        }
        if ( cellDefZI.cellType == 'button' && cellDefZI.expand && 
            cellDefZI.expand.divs &&  cellDefZI.expand.divs.length > 0 ) {
          for ( var cZJ = 0; cZJ < cellDefZI.expand.divs.length; cZJ++ ) {
            var cellDefZj = cellDefZI.expand.divs[ cZJ ];
            if ( cellDefZj.cellType == 'largeimg' && cellDefZj.forImg && cellDefZj.forImg == cellDef.id ) { // found
              var cellDefZj = getSubData( cellDta, cellDefZj.id );
              if ( cellDefZj != null ) { zoomImg = cellDefZj }
            }              
          }
        }
      }

      $( cellId ).html( '<img src="'+tblImg+'" data-zoom-image="'+zoomImg+'" id="'+divId+'R'+i+cellDef.id+'" class="img'+divId+'C'+c+' pongtblzoomimg" />'); 
      $( cellId ).append( '<script> $(function() {  $( "#'+divId+'R'+i+cellDef.id+'" ).elevateZoom(); } ); </script>' );
    }
    
  }  else if ( cellType == 'button'  ) {
    
    var contentItems = [];
    var ajaxType = 'POST';
    var param = '';
    var icon = 'ui-icon-gear';
    if ( ( cellDef.method != null ) && ( cellDef.method.length != null ) ) {
      if ( cellDef.method == 'DEL-POST' ) {
        param = ',"actn":"DEL"';
        icon = 'ui-icon-trash';
      } else if ( cellDef.method == 'expand' ) {
        icon = 'ui-icon-triangle-1-s';
        ajaxType = 'expand';
      } else if ( cellDef.method == 'subTable' ) {
        icon = 'ui-icon-triangle-1-s';
        ajaxType = 'subTable';
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
    log( "Pong-Table", cellDef.label+" icon="+icon );
    var url = poTbl[ tblDiv ].resourceURL;
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
    
    if ( cellDef.label ) {
      contentItems.push( '<button id="'+divId+'R'+i+cellDef.id+'" class="pong-table-btn">'+cellDef.label+'</button>' );
    } else if ( cellVal != '' ) {
      contentItems.push( '<button id="'+divId+'R'+i+cellDef.id+'" class="pong-table-btn">'+cellVal+'</button>' );
    } else {
      contentItems.push( '<button id="'+divId+'R'+i+cellDef.id+'" class="pong-table-btn"></button>' );
    }
    
    contentItems.push( '<script>' );
    contentItems.push( '  $( function() { ' );
    if ( icon.lenght != 0 ) {
      contentItems.push( '       $( "#' +divId+'R'+i+cellDef.id+ '" ).button( { icons: { primary: "'+icon+'" } } )' );            
    } 
    if ( ajaxType == 'expand' ||  ajaxType == 'subTable') {
        contentItems.push( '       $( "#' +divId+'R'+i+cellDef.id+ '" ).click(' );
        contentItems.push( '         function() {  ' );
        contentItems.push( '           pongTableExpand( "'+ajaxType+'", "'+divId+'", ' +
           '"#'+divId+'R'+i+cellDef.id+'", '+r+', '+JSON.stringify(cellDef)+');' );
        contentItems.push( '           return false;');
        contentItems.push( '         }');
        contentItems.push( '       ); ' );
    } else if ( ajaxType == 'JS'  ) {
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
    if ( cellVal && cellVal != '' ) {
      $( '#'+divId+'R'+i+cellDef.label ).append( '<span id="'+cellId+'" data-link="'+cellVal+'" data-target="'+target+'" class="ui-icon ui-icon-extlink tbl-link-icon"/>' );
    }  
  } else if ( cellType == 'textLink'  ) {
    
      var target = "_parent";
      if ( cellDef.target ) { target = cellDef.target; }
      if ( cellVal && cellVal != '' ) {
        var text = $( '#'+divId+'R'+i+cellDef.label ).parent().html()
        $( '#'+divId+'R'+i+cellDef.label ).parent().html( '<a href="'+cellVal+'" id="'+cellId+'" target="'+target+'" class="tbl-link">'+text+'</a>' );
      }
  
  } else if ( cellType == 'rating'  ) {
      
    ratingType = "5star";
    if ( cellDef.ratingType != null ) {
      ratingType = cellDef.ratingType;
    }
    if ( cellVal != '' ) { 
      $( cellId ).html( '<img class="RatingImg cell'+cellDef.id+'"" src="'+modulesPath+"pong-table/rating/"+ratingType+cellVal+'.png" id="'+divId+'R'+i+cellDef.id+'"/>' );
    } else {
      $( cellId ).html( '' );
    }
  } else if ( cellType == 'cssClass' ) {

    if ( cellVal && ! poTbl[ divId ].pongTableDef.maxRows ) { // only for non paging
      $( cellId ).parent().addClass( cellVal )
    }
    
  } else {
    // ???
  } 

}

// ----------------------------------------------------------------------------
/** expand row to show additional data */
function pongTableExpand( mode, divId, id, r, cellDef ) {
  if ( poTbl[ divId ].expand[ 'row' + r ] === id ) { // request to collapse extra data
    pongTableUnExpand( divId, id, r );
    return;
  }
  if ( poTbl[ divId ].expand[ 'row' + r ] ) {
    // row is expanded, but other data is requested (other button in row)
    pongTableUnExpand( divId, id, r );
  }
  log( "Pong-Table",  'Expand divId=' + divId + ' id='+id+' row=' + r );

  // render empty structure:
  var expandDivId = divId+'R'+r+'E';
  var contentItems = [];

  if ( mode == 'subTable' ) {

    let subTbl = cellDef.subTable;
    let expClass = divId+'RowExpand tableSubTableRow';
    $( '#'+divId+'R'+r ).after( 
      '<tr id="'+divId+'R'+r+'ExpRow" class="'+expClass+'">' +
      '<td colspan="100%">' +
      '<div id="'+expandDivId+'" class="subTableDiv"></div>' +
      '</td></tr>' 
    );
    // fill data into structure
    let rowDta = poTbl[ divId ].pongTableData[r];
    let params = {};
    if ( subTbl.queryId ) {
      let qry = {};
      for ( let colId of subTbl.queryId ) {
        qry[ colId ] = rowDta [ colId ];
      }
      params = {
        subTableQry : qry
      }
    } else {
      alert('Sub-Table "queryId" missing in config!')
      return
    }
    
    pongTableDivHTML( expandDivId, subTbl.resourceURL, params, subTbl.moduleConfig );

  } else {

  let divs = cellDef.expand.divs;
    contentItems.push( '<div id="'+expandDivId+'">' );
    renderPongListDivHTMLsub( contentItems, expandDivId, divs, r, 0 );
    contentItems.push( '</div>' );
    let expClass = divId+'RowExpand tableExpandRow';
    $( '#'+divId+'R'+r ).after( 
      '<tr id="'+divId+'R'+r+'ExpRow" class="'+expClass+'">' +
      '<td colspan="100%">' +
      contentItems.join( '\n' ) +
      '</td></tr>' 
    );
    // fill data into structure
    var rowDta = poTbl[ divId ].pongTableData[r];
    log( "Pong-Table",  '  rowDta=' +JSON.stringify( rowDta ) );
    pongListUpdateRow( expandDivId, divs, rowDta, r, 0, r, divId );
  }

  // remember what which button and row was expanded
  $( id ).button( { icons: { primary: 'ui-icon-circle-triangle-n' } })
  poTbl[ divId ].expand[ 'row' + r ] = id;
}

function pongTableUnExpand( divId, id, r ) {
  log( "Pong-Table",  'Un-Expand div=' + divId + ' id='+id+' row=' + r );
  $( '#'+divId+'R'+r+'ExpRow' ).remove(); 
  // remove the remember what which button and row was expanded
  $( poTbl[ divId ].expand[ 'row' + r ] ).button(
    { icons: { primary: 'ui-icon-triangle-1-s' } } )
  poTbl[ divId ].expand[ 'row' + r ] = null;
}

// ----------------------------------------------------------------------------

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
    if ( url.indexOf("?") > -1 ) { url += '&'; } else { url += '?'; }
    url += rid+'='+cellDta[ rid ];
    if ( rid != 'id' ) { 
      url += '&id='+cellDta[ rid ]; 
    }
  } else if ( Array.isArray( rid ) ) {
    var first = true;
    for ( var x = 0; x < rid.length; x++ ) {
      if ( url.indexOf("?") > -1 ) { url += '&'; } else { url += '?'; }
      url += rid[x]+'='+cellDta[ rid[x] ];
    }
  } else {
    if ( url.indexOf("?") > -1 ) { url += '&'; } else { url += '?'; }
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
var pongTblGraphTT = { }

function pongTblRenderGraph( divId, ctx, def, dta, canvasId ) {
  log( "Pong-Table", "pongIOrenderGraph '"+def.id+"': "+JSON.stringify(def) );
  if ( def.pos  &&  def.pos.x != null  &&  def.pos.y != null  &&  def.width  &&  def.height &&
     def.layout && def.layout.yAxis  &&  def.layout.yAxis.min != null  &&  def.layout.yAxis.max != null ) {} else { 
    log( "Pong-Table", "pongIOrenderGraph: Config not OK! End.");
    return;
  }
  if ( ! pongTblGraphTT[ canvasId ] ) { pongTblGraphTT[ canvasId ] = []; }
  var xLbl = 0;
  if (  def.layout.yAxis.labelCnt || def.layout.yAxis.labels && def.layout.yAxis.labels.length ) {
    xLbl = 5;
  }
  var x = parseInt(def.pos.x)  + xLbl*6,
      y = parseInt(def.pos.y)  + xLbl,
      w = parseInt(def.width)  - xLbl*6, 
      h = parseInt(def.height) - xLbl*2, 
      yMin = parseFloat( def.layout.yAxis.min ), // avoid: graphs with auto min
      yMax = ( yMin < 0 ? 1 : yMin+1 );
  if ( def.layout.yAxis.max == 'auto' ) {
    // find a scale for y axis
    var dtaMax = 1;
    if ( dta  && dta.length ) {
      for ( var c = 0; c < dta.length; c++ ) {
        var g = dta[c];
        if ( g.data && g.data.length ) {
          for ( var i = 0; i < g.data.length; i++ ) {
            if ( dtaMax < g.data[i][1] ) { dtaMax = g.data[i][1] }
          }
        }
      }
    }
    while ( yMax < dtaMax ) { 
      yMax = yMax * 2.5; 
      if ( yMax < dtaMax ) { yMax = yMax * 2;  }
      if ( yMax < dtaMax ) { yMax = yMax * 2;  }
    }
  } else {
    yMax = parseFloat( def.layout.yAxis.max );
  }

  if ( def.layout.yAxis.labelCnt ) {
    var lCnt = parseInt(  def.layout.yAxis.labelCnt );
    def.layout.yAxis.labels = []
    for ( var i = 0; i < lCnt; i++ ) {
      def.layout.yAxis.labels.push( ( yMin + ( yMax-yMin )*i / (lCnt-1) ) + '' );
    }
  }
  //console.log( def.layout.yAxis.labels );

  ctx.beginPath();
  ctx.strokeStyle = "#00A";
  ctx.fillStyle   = "#DDD";
  ctx.lineWidth    = "1";
  if ( def.lineCol ) { ctx.strokeStyle = def.lineCol; }
  if ( def.fillCol ) { ctx.fillStyle   = def.fillCol; }
  ctx.rect( x, y, w, h );
  ctx.stroke();
  ctx.fill();     
  
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
        pongTblCnvTxt(  divId, def, ctx, l, xt, lyy, {"font":"7pt Arial"} );
      }
    }
  }

  if ( def.layout.name ) {
    var xx = x + w/2, yy = y-6;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    pongTblCnvTxt(  divId, def, ctx, def.layout.name, xx, y+15, {"font":"8pt Arial"} );   
  }
 
  // draw graphs
  ctx.rect( x, y, w, h );
  ctx.clip();
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
          drawL = true;
          if ( drawL ) {
            //log( "Pong-Table", " lineto( "+xx+" / "+yy+" )" );
            ctx.lineTo( xx, yy );                       
            ctx.stroke();
            pongTblGraphTT[ canvasId ].push( { xx:xx, yy:yy, x:g.data[i][0], y:g.data[i][1] } );
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
    // console.log( pongTblGraphTT ); 
  }   

  // TODO IO: implement graph
  log( "Pong-Table", "pongIOrenderGraph end.");
}


function pongTblCanvasMouse( id, divId, evt ) {
  // console.log( evt );
  var canvas = document.getElementById( id );
  if ( ! canvas ) { return; }
  // console.log( canvas.id );
  var rect = canvas.getBoundingClientRect();
  var x = evt.clientX - rect.left;
  var y = evt.clientY - rect.top;
  var parentDiv = document.getElementById( divId ).getBoundingClientRect();
  var pts = pongTblGraphTT[ id ]
  // console.log( pts );
  if ( ! pts ) { return }
  var showTT = false;
  for ( var i = 0; i < pts.length; i++ ) {
    // console.log( canvas.id + ' '+ x + ' ' +y + ' ' + pts[i].x + ' ' + pts[i].y );
    if ( x >= pts[i].xx - 5  &&  x <= pts[i].xx + 5 &&
         y >= pts[i].yy - 5  &&  y <= pts[i].yy + 5 ) {
      //console.log( canvas.id + ' '+ x + ' ' +y + ' ' + pts[i].x + ' ' + pts[i].y );
      var ttDiv = document.getElementById( id+'TT' );
      // console.log( ttDiv );
      if ( ttDiv ) {
        ttDiv.innerHTML = pts[i].x + ' / ' + pts[i].y ;
        ttDiv.style.position = 'absolute';
        ttDiv.style.left = evt.clientX - parentDiv.left +  5 + 'px';
        ttDiv.style.top  = evt.clientY - parentDiv.top  - 10 + 'px';
        ttDiv.style.display = 'block';
        // ttDiv.style.border = '2px';
        // ttDiv.style.borderColor = 'black';
        // ttDiv.style.borderStyle = 'solid';
        showTT = true;  
      }
    }
  } 
  if ( ! showTT ) {
    var ttDiv = document.getElementById( id+'TT' );
    if ( ttDiv ) {
      ttDiv.style.position = 'absolute';
      ttDiv.style.display = 'none';  
    }
  }
}

//---------------------------------------------------------------------------------------
/** "pong-list" functions */

/** Render recursivley one row of empty DIVs, generate nested data cell structure  */
function renderPongListDivHTMLsub( contentItems, divId, divs, r, cx ) {
  log( "PoNG-List", 'div row='+r+'/'+cx );
  for ( var c = 0; c < divs.length; c ++ ) {
    log( "PoNG-List", 'div '+cx+'/'+c );
    if ( divs[c].cellType == 'div' ) {
      log( "PoNG-List", 'div-x '+divs[c].id );
      contentItems.push( '<div class="pongListCell pongListCell'+divs[c].id.replace(/\./g,'')+'" id="'+divId+'R'+r+'X'+cx+'C'+c+'">' );
      if ( divs[c].divs ) {
        renderPongListDivHTMLsub( contentItems, divId, divs[c].divs, r, cx+c ); 
      }      
      contentItems.push( '</div>'  );
    } else if ( ( divs[c].cellType != 'tooltip' ) && 
                ( divs[c].cellType != 'largeimg' ) && 
                ( divs[c].cellType != 'cssClass' ) && 
                ( divs[c].cellType != 'textLink' ) && 
                ( divs[c].cellType != 'linkFor' ) ) {
      log( "PoNG-List", 'div-n '+divs[c].id );
      contentItems.push( '<div class="pongListCell pongListValCell pongListCell'+divs[c].id.replace(/\./g,'')
          +'" id="'+divId+'R'+r+'X'+cx+'C'+c+'"></div>'  );
      log( "PoNG-List", 'div end' );
    } else if (divs[c].cellType == 'cssClass' ) {
      contentItems.push( '<div id="'+divId+'R'+r+'X'+cx+'C'+c+'" style="display:none;"/>' );
    }
  }
}

/** fill recursively empty cells of one row with data */
function pongListUpdateRow( divId, divs, rowDta, r, cx, i, tblDiv ) {
  log( "PoNG-List", 'upd-div row='+r+'/'+cx );
  for ( var c = 0; c < divs.length; c ++ ) {
    log( "PoNG-List", 'upd-div '+cx+'/'+c );
    if ( divs[c].cellType == 'div' ) {
      log( "PoNG-List", 'upd-div-x '+divs[c].id );
      if ( divs[c].divs ) {
        pongListUpdateRow( divId, divs[c].divs, rowDta, r, cx+c, i, tblDiv  ); 
      }      
    } else {
      var cellId = '#'+divId+'R'+i+'X'+cx+'C'+c;
      log( "PoNG-List", 'upd-div-n '+cellId );
      var dtaArr = poTbl[ tblDiv ].pongTableData;
      var rowIdVal =  dtaArr[r][ poTbl[ tblDiv ].pongTableDef.rowId ];
      tblUpdateCell( divId, divs[c], r, c, i, rowDta, cellId, rowIdVal, tblDiv );
   }
  }
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
