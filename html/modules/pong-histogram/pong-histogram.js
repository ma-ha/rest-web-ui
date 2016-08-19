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

log( "pongHistogram", "load module"); // print this on console, when module is loaded



// ======= Code for "loadResourcesHtml" hook ================================================
function pongHistogram_DivHTML( divId, resourceURL, paramObj ) {
	log( "pongHistogram",  "Start divId="+divId+" resourceURL="+resourceURL );
	if ( moduleConfig[ divId ] != null ) {
		pongHistogram_RenderHTML( divId, resourceURL, paramObj, moduleConfig[ divId ]  );
	} else {
		$.getJSON( 
			resourceURL+"/pongHistogram", 
			function( pmd ) {
			  moduleConfig[ divId ] = pmd;
			  pongHistogram_RenderHTML( divId, resourceURL, paramObj, pmd );
			}
		);					
	}	
    log( "pongHistogram",  "End divId="+divId );
}
var pongHistogram = new Array();


function pongHistogram_RenderHTML( divId, resourceURL, paramObj, pmd ) {
	log( "pongHistogram", "RenderHTML "+divId );
	pongHistogram[ divId ] = new Array();
	var contentItems = [];
	var min = parseFloat( pmd.xAxisMin );
    var max = parseFloat( pmd.xAxisMax );
	contentItems.push( '<div id="'+divId+'pongHistogram_Div" class="pongHistogramDiv" style="height:100%;">' );
	var cnt = ( pmd.blockCount ? pmd.blockCount : 10 );
	var blockWidth = 100 / cnt;
	var css = 'class="pongHistogramBlock" style="height:100%; width:'+blockWidth+'%;float:left;"';
	for ( var i = 0; i < cnt; i++ ) {
	    var val1 = min + ( max - min ) / cnt * i ;
        var val2 = min + ( max - min ) / cnt * (i+1) ;
        pongHistogram[ divId ][i] = { x1:val1, x2:val2 };
	    contentItems.push( '<div '+css+' data-i="'+i+'">' );
        contentItems.push( '<div class="HistogramBlockContainer"  data-i="'+i+'">' );
        contentItems.push( '<div id="'+divId+'bar'+i+'" class="HistogramBlockBar" data-i="'+i+'"></div>' );
        contentItems.push( '</div>' );
        if ( pmd.xAxisUnit ) { val2 = val2 +  $.i18n( pmd.xAxisUnit ); }
        contentItems.push( '<div id="'+divId+'xLabel'+i+'" class="HistogramBlockText" data-i="'+i+'">'+val2+'</div>' );
        contentItems.push( '</div>' );	  
	}
	
	contentItems.push( '</div>' );
    contentItems.push( '<script>' );
    contentItems.push( '  $( ".pongHistogramBlock" ).on( "click", function() { ');
    contentItems.push( '    pongHistogram_ClickBar( "'+divId+'", $( this ).data( "i" ) ); } );' );
    contentItems.push( '</script>' );
	// output
	$( "#"+divId ).html( contentItems.join( "\n" ) );	
	$( ".HistogramBlockContainer" ).height( ($( ".pongHistogramBlock" ).height()-30) + "px" );
	if ( pmd.dataURL ) {
	  log( "pongHistogram", "Load "+pmd.dataURL );
	  $.getJSON( 
	      pmd.dataURL, 
	      { xMin:min, xMax:max },
          function( dta ) {
	        publishEvent( "feedback", {"text":"Histogram data loaded"} )
            pongHistogram_UpdateBars( divId, dta, min, max );
          }
      );  
    }
    log( "pongHistogram", "RenderHTML end.");

}

function pongHistogram_ClickBar( divId, barNo ) {
  log( "pongHistogram", "ClickBar "+divId );
  var pmd = moduleConfig[ divId ];
  var params = pongHistogram[ divId ][ barNo ];
  for ( var i=0; i < pmd.update.length; i++ ) {
    var parmStr = '{"'+pmd.update[i].x1+'":"'+params.x1+'","'+ pmd.update[i].x2+'":"'+params.x2+'"}';
    log( "pongHistogram", parmStr );
    var updParams = JSON.parse( parmStr );
    log( "pongHistogram", 'udateModuleData( "'+pmd.update[i].resId+'", '+JSON.stringify(updParams)+' )' );    
    udateModuleData( pmd.update[i].resId+'Content', updParams );
  }
  log( "pongHistogram", "ClickBar end.");
}


/** Change labels an height of histogram bars */
function pongHistogram_UpdateBars( divId, dta, xMin, xMax ) {
  log( "pongHistogram", "UpdateBars "+divId);
  
  var pmd = moduleConfig[ divId ];
  var cnt = ( pmd.blockCount ? pmd.blockCount : 10 );
  // get y-axis scaling
  var yMax = pmd.yAxisMax;
  if ( !yMax || yMax == 'auto' ) { 
    yMax = 0;
    for ( var i = 0; i < cnt; i++ ) {
      if ( parseFloat( dta[i][ pmd.dataY ] ) > yMax ) { 
        yMax = parseFloat( dta[i][ pmd.dataY ] );
      }
    }
  }
  var yH = $( '.HistogramBlockContainer' ).height();
  log( "pongHistogram", 'yH='+yH);

  // scale bars in % height
  for ( var i = 0; i < cnt; i++ ) {
    //var bar = pongHistogram[ divId ][i];
    var h = parseFloat( dta[i][ pmd.dataY ] ) / parseFloat( yMax ) * yH;
    h = ( h > 100 ? 100 : h );
    log( "pongHistogram", ' bar '+i+' '+ JSON.stringify( dta[i]) + ' '+ pmd.dataY+' '+ pmd.xAxisMax + ' h='+h );
    $( '#'+divId+'bar'+i ).height( h+'px' ); // set height of bar
    $( '#'+divId+'bar'+i ).attr( 'title', dta[i][ pmd.dataY ]+'#' );
    if (  dta[i][ pmd.dataX ] ) { // update label
      $( '#'+divId+'xLabel'+i ).html( dta[i][ pmd.dataX ] );      
    } 
  }  
  log( "pongHistogram", 'UpdateBars end' );
}


//======= Code for hook ================================================
/** update data call back hook */
function pongHistogram_UpdateData( divId, paramsObj ) {
	log( "pongHistogram", "UpdateData start "+divId );
	//TODO implement	
	log( "pongHistogram", "UpdateData end.");
}


//======= Code for hook ================================================
/** set data call back hook */
function pongHistogram_SetData( divId, data, dataDocSubPath ) {
    log( "pongHistogram", "SetData start "+divId);
    log( "pongHistogram", JSON.stringify(data) );
    var pmd = moduleConfig[ divId ];
    var hist = [];
    for ( var i = 0; i < pmd.blockCount; i++ ) {
      hist[i] = {};
      hist[i][ pmd.dataY ] = 0;
    }
    log( "pongHistogram", JSON.stringify(hist) );
    log( "pongHistogram", JSON.stringify( pongHistogram[ divId ]) );
    for ( var i = 0; i < data.length; i++ ) {
      var val = parseFloat( data[i][ pmd.dataX ] );
      log( "pongHistogram", 'val='+val );          
      for ( var j = 0; j < pongHistogram[ divId ].length; j++ ) {
        var x1 = parseFloat( pongHistogram[ divId ][j].x1 );
        var x2 = parseFloat( pongHistogram[ divId ][j].x2 );
        if ( x1 < val && val <= x2 ) {
          log( "pongHistogram", x1 +" < "+val+" < "+x2+"    -> "+j);      
          hist[j][ pmd.dataY ] = hist[j][ pmd.dataY ] + 1;
        }
      }
    }
    log( "pongHistogram", JSON.stringify(hist) );
    pongHistogram_UpdateBars( divId, hist );
    log( "pongHistogram", "SetData end.");
}

//======= Code for "addActionBtn" hook ================================================
function pongHistogram_AddActionBtn( id, modalName, resourceURL, paramObj ) {
	log( "pongHistogram", "modalFormAddActionBtn "+id);
	//var action = res.actions[x];
	var html = "";
	log( "pongHistogram", "Std Config Dlg:  " + modalName );
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
function pongHistogram_CreModalFromMeta( id, modalName, resourceURL, paramObj  ) {
	log( "PoNG-Help", "Get help: '"+resourceURL+"/help'");
	var lang = getParam( 'lang' );
	if ( lang == '' ) {
		lang = "EN";
	}	
	var resourceSub = ""; // e.g. "/help"
	$.get( resourceURL+resourceSub, 
		{ lang: lang }, // other params required?
		function( divHtml ) {
			$(  "#"+id+modalName+"Dialog" ).html( '<div class"pongHistogrammodal">'+divHtml+'</div>' );
			log( "pongHistogram", "loaded" );
		}
	).fail(
		function() {
			logErr( "pongHistogram", "Can't load modal form content from '"+resourceURL+resourceSub );
		}
	);
}
