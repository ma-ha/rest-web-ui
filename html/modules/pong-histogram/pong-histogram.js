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
	log( "pongHistogram",  "divId="+divId+" resourceURL="+resourceURL );
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
	    contentItems.push( '<div '+css+'>' );
        contentItems.push( '<div class="HistogramBlockContainer">' );
        contentItems.push( '<div id="'+divId+'bar'+i+'" class="HistogramBlockBar"></div>' );
        contentItems.push( '</div>' );
        contentItems.push( '<div id="'+divId+'xLabel'+i+'" class="HistogramBlockText">'+val2+'</div>' );
        contentItems.push( '</div>' );	  
	}
	
	contentItems.push( '</div>' );
	// output
	$( "#"+divId ).html( contentItems.join( "\n" ) );	

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
    log( "pongHistogram", "end.");

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
    $( '#'+divId+'bar'+i ).height( h+'px' );
    $( '#'+divId+'xLabel'+i ).html( dta[i][ pmd.dataX ] );
  }  
  log( "pongHistogram", 'end' );
}


/** update data call back hook */
function pongHistogram_UpdateData( divId, paramsObj ) {
	log( "pongHistogram", "start '"+pmd.description+"'");
	
	
	log( "pongHistogram", "end.");
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
