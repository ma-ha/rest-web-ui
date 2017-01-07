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

log( "pong-io", "load module"); // print this on console, when module is loaded
var ioSense = new Array();

// ======= Code for "loadResourcesHtml" hook ================================================
function pongIoDivHTML( divId, resourceURL, paramObj ) {
	log( "pong-io",  "divId="+divId+" resourceURL="+resourceURL );
	ioSense[ divId ] = new Array();
	if ( moduleConfig[ divId ] != null ) {
		pongIoRenderHTML( divId, resourceURL, paramObj, moduleConfig[ divId ] );
	} else {
		$.getJSON( 
			resourceURL+"/pong-io", 
			function( pmd ) {
				moduleConfig[ divId ] = pmd;
				pongIoRenderHTML( divId, resourceURL, paramObj, pmd );
			}
		);					
	}	
}

//---------------------------------------------------------------------------------------

function pongIoRenderHTML( divId, resourceURL, paramObj, pmd ) {
	log( "pong-io", "pongIoRenderHTML img:'"+pmd.imgURL+"'");
	var background = new Image();	
	var contentItems = [];
	var dStyle = 'style="width=:100%; height:100%;"';
	var htmlDivId = divId+'pong-io_Div';
	contentItems.push( '<div id="'+htmlDivId+'" class="pong-io" '+dStyle+'>' );
	contentItems.push( '</div>' );
	$( "#"+divId ).html( contentItems.join( "\n" ) );
	
	contentItems = [];
	var w = $( '#'+htmlDivId ).width();
	var h = $( '#'+htmlDivId ).height();
	log( "pong-io", w+"px/"+h+"px" );
	contentItems.push( '<canvas id="'+divId+'Canvas" width="'+w+'px" height="'+h+'px">' );
	contentItems.push( '</canvas></div>' );
	contentItems.push( '<script>' );
	contentItems.push( '  function pongIoUpdateTimer'+divId+'() { ' );
	contentItems.push( '      pongIoUpdateData( "'+divId+'", null ); ' );
	contentItems.push( '  }' );
	contentItems.push( '</script>' );
	
	$( "#"+htmlDivId ).html( contentItems.join( "\n" ) );

	var ctx = document.getElementById( divId+'Canvas' ).getContext("2d");

	// draw background
	if ( pmd.imgURL != null ) {
		background.src = pmd.imgURL;
		background.onload = function() {
  			ctx.drawImage( background, 0, 0 ); 
  		  // draw panel
  		  pongIoUpdateData( divId, { makeJS: true } );
  	    };
	} else {
      pongIoUpdateData( divId, { makeJS: true } );	  
	}
	
	
	// create polling "loop"
	log( "pong-io", ">>>>> Try to create poolDataTimerId "+pmd.poll  );
	if ( pmd.poll ) {
		var t = parseInt( pmd.poll );
		log( "pong-io", ">>>>> create poolDataTimerId t="+t );
		if  ( ! isNaN( t ) ) {			
			poolDataTimerId = setInterval( "pongIoUpdateTimer"+divId+"()", t );
			log( "pong-io", ">>>>> startet pongIoUpdateTimer"+divId+"()" );
		}
	}
	
	log( "pong-io", "pongIoRenderHTML end.");
}

//---------------------------------------------------------------------------------------

function pongIOmakeJS( divId  ) {
	log( "pong-io", "pongIOmakeJS "+divId );
	var pmd = moduleConfig[ divId ];
	var contentItems = [];
	contentItems.push( '<script>' );
	contentItems.push( '  $( function() { var xMD = 0; xMD = 0;' );
	contentItems.push( '    $( "#' +divId+ 'Canvas" ).bind( "mousedown touchstart", function( evt ) { ' );
	contentItems.push( '      var e = evt;  ' );
	contentItems.push( '      if ( evt.originalEvent && evt.originalEvent.touches && evt.originalEvent.touches.length > 0 ) { ' );
	contentItems.push( '        e = evt.originalEvent.touches[0]; ' );
	contentItems.push( '      } ' );
	contentItems.push( '      xMD = e.pageX - $( "#' +divId+ 'Canvas" ).offset().left; ' );
	contentItems.push( '      yMD = e.pageY - $( "#' +divId+ 'Canvas" ).offset().top; return false;' );
	contentItems.push( '    } ); ' );
	contentItems.push( '    $( "#' +divId+ 'Canvas" ).bind( "click touchend", function( evt ) {' );
	contentItems.push( '      var e = evt;' );
	contentItems.push( '      if ( evt.originalEvent && evt.originalEvent.changedTouches && evt.originalEvent.changedTouches.length > 0 ) { ' );
	contentItems.push( '        e = evt.originalEvent.changedTouches[0]; ' );
	contentItems.push( '      } ' );
	contentItems.push( '      var x = e.pageX - $( "#' +divId+ 'Canvas" ).offset().left; ' );
	contentItems.push( '      var y = e.pageY - $( "#' +divId+ 'Canvas" ).offset().top; ' );
	//contentItems.push( '      alert( x+" / "+y ); ' );
	if ( pmd.io && pmd.io.length ) {
		
		for ( var c = 0; c < pmd.io.length; c++ ) {
			var io = pmd.io[c];
			if ( io.type ) {
				
				if ( io.type == 'Switch' && io.values && io.values.length ) {

	        log( "pong-io", io.type+' '+io.id );			
					for ( var val = 0; val < io.values.length; val++ ) {
		        log( "pong-io", io.values[val]  );
						if ( ioSense[ divId ] && ioSense[ divId ][ io.id ] && ioSense[ divId ][ io.id ][ io.values[val] ] ) {
							log( "pong-io", "sense ("+io.values[val] +")..." );
							var s = ioSense[ divId ][ io.id ][ io.values[val] ];
							log( "pong-io", "sense "+ JSON.stringify(s) );
							if ( s.x1 && s.x2 && s.y1 && s.y2 ) {
								log( "pong-io", "sense: " + JSON.stringify( s ) );
								contentItems.push( '      pongIOcheckSwitchSense( "'+divId+'", x, y, "'+io.id+'", "'+io.values[val]+'",'+JSON.stringify( s )+' ); ' );
							}
						}
					}
					
				} else if ( io.type == 'Poti' ) {

					log( "pong-io", io.type+' '+io.id );		
					if ( ioSense[ divId ] && ioSense[ divId ][ io.id ] ) {
						var s = ioSense[ divId ][ io.id ];
						contentItems.push( '      pongIOcheckPotiSense( "'+divId+'", x, y, "'+io.id+'", '+JSON.stringify( s )+' ); ' );						
					}
					
				}  else if ( io.type == 'Button' ) {

					log( "pong-io", io.type+' '+io.id );		
					if ( ioSense[ divId ] && ioSense[ divId ][ io.id ] ) {
						var s = ioSense[ divId ][ io.id ];
						contentItems.push( '      pongIOcheckButtonSense( "'+divId+'", x, y, "'+io.id+'", '+JSON.stringify( s )+' ); ' );						
					}
					
				}  else if ( io.type == 'Graph' ) {

					log( "pong-io", io.type+' '+io.id );		
					if ( ioSense[ divId ] && ioSense[ divId ][ io.id ] ) {
						var s = ioSense[ divId ][ io.id ];
						contentItems.push( '      pongIOcheckGraphSense( "'+divId+'", x, y, xMD, yMD, "'+io.id+'", '+JSON.stringify( s )+' ); ' );						
					}
					
				}

			}
		}
	}
	contentItems.push( '    return false;' );
	contentItems.push( '  } ) } );' );
	contentItems.push( '</script>' );
	$( "#"+divId+'pong-io_Div' ).append( contentItems.join( "\n" ) );
	log( "pong-io", "pongIOmakeJS end." );
}

//---------------------------------------------------------------------------------------

/** update data call back hook */
function pongIoUpdateData( divId, paramsObj ) {
	log( "pong-io", "pongIoUpdateData start ");
	
	$.ajax( {
		method: "GET",
		url: moduleConfig[ divId ].dataURL, 
		dataType: "json",
		beforeSend: function( request ) {
			if ( sessionInfo["OAuth"] != null && sessionInfo["OAuth"]["access_token"] != null && sessionInfo["OAuth"]["access_token"] != "" ) {
				request.setRequestHeader( "Authorization", "Bearer "+sessionInfo["OAuth"]["access_token"] ); 
			}
		}
	} ).done( function( dta ) {
		log( "pong-io", "pongIoUpdateData data start");
		
		pongIOrenderData( divId, dta );
		
		if ( paramsObj && paramsObj.makeJS ) {
			pongIOmakeJS( divId );				
		}
	
    publishEvent( 'feedback', {'text':'Processed response from I/O service '} )
		log( "pong-io", "pongIoUpdateData data end.");	
	} ).fail( function( ) {
      log( "pong-io", "pongIoUpdateData data start (fail mode)");
	    pongIOrenderData( divId, null );
      if ( paramsObj && paramsObj.makeJS ) {
        pongIOmakeJS( divId );        
      }
      publishEvent( 'feedback', {'text':'ERROR: I/O service not responding!'} )
      log( "pong-io", "pongIoUpdateData data end (fail mode)");
	} );

	log( "pong-io", "pongIoUpdateData end.");
}

function pongIOrenderData( divId,  dta ) {
	log( "pong-io", "pongIOrenderData data start");
	var pmd = moduleConfig[ divId ];
	var ctx = document.getElementById( divId+'Canvas' ).getContext("2d");
	if ( pmd.io && pmd.io.length ) {
		log( "pong-io", "IO: "+ pmd.io.length);			
		for ( var c = 0; c < pmd.io.length; c++ ) {
			var io = pmd.io[c];
			log( "pong-io", io.type+' '+io.id );			
			
			if ( io.dataURL ) {		// perform inner AJAX request

				$.ajax( {
					method: "GET",
					url: io.dataURL, 
					dataType: "json",
					beforeSend: function( request ) {
						if ( sessionInfo["OAuth"] != null && sessionInfo["OAuth"]["access_token"] != null && sessionInfo["OAuth"]["access_token"] != "" ) {
							request.setRequestHeader( "Authorization", "Bearer "+sessionInfo["OAuth"]["access_token"] ); 
						}
					}
				} ).done( function( dta ) {
					log( "pong-ioX", "inner data loader");
					if ( io.data ) {	
						var ioDta = null;
						if ( dta  ) {
							ioDta = new Object();
							ioDta.value = getSubData( dta, io.data );
						}
						pongIOrender( divId, ctx, io, ioDta );
					} else {
						pongIOrender( divId, ctx, io, dta );							
					}
			    publishEvent( 'feedback', {'text':'Processed response from I/O service '} )
					log( "pong-io", "inner data loader data end.");	
				} );
			
			} else if ( io.data ) {		// point to data to evaluate
				
				var ioDta = null;
				if ( dta  ) {
					ioDta = new Object();
					ioDta.value = getSubData( dta, io.data );
				}
				pongIOrender( divId, ctx, io, ioDta );
		    publishEvent( 'feedback', {'text':'Updated I/O view'} )

			} else { // default simple data "value" field expected

				var ioDta = null;
				if ( dta && dta[ io.id ] ) {
					ioDta = dta[ io.id ];
				}
				pongIOrender( divId, ctx, io, ioDta );
				
			}
						
		} // loop		
	}
	log( "pong-io", "pongIOrenderData data end");
}


function pongIOrender( divId, ctx, io, ioDta ) {
  if ( io.type && io.pos && io.pos.x && io.pos.y ) {
    if ( io.type == 'LED' || io.type == 'Light' ) {
      pongIOrenderLED( divId, ctx, io, ioDta );
    } else if ( io.type == 'Switch') {
      pongIOrenderSwitch( divId, ctx, io, ioDta );
    } else if ( io.type == 'Button' ) {
      pongIOrenderButton( divId, ctx, io, ioDta );
    } else if ( io.type == 'Poti') {
      pongIOrenderPoti( divId, ctx, io, ioDta );
    } else if ( io.type == 'Gauge') {
      pongIOrenderGauge( ctx, io, ioDta );
    } else if ( io.type == 'Display') {
      pongIOrenderDisplay(  divId, ctx, io, ioDta );
    } else if ( io.type == 'Graph') {
      pongIOrenderGraph( divId, ctx, io, ioDta );
    } else if ( io.type == 'Img') {
      pongIOrenderImg( ctx, io, ioDta );
    } else if ( io.type == 'Label') {
      pongIOrenderLabel(divId, ctx, io, ioDta, io.pos.x, io.pos.y );
    }  
  }	
}

//---------------------------------------------------------------------------------------

function pongIOrenderGauge( ctx, def, dta ) {
	log( "pong-io", "pongIOrenderGauge '"+def.id+"': "+JSON.stringify(dta) );
	// TODO IO: implement gauge

	log( "pong-io", "pongIOrenderGauge end.");
}

//---------------------------------------------------------------------------------------

function pongIOrenderButton( divId, ctx, def, dta ) {
	log( "pong-ioX", "pongIOrenderButton '"+def.id+"': "+JSON.stringify(dta) );
	if ( ! def.pos || ! def.pos.x || ! def.pos.y ) { log( "pong-ioX", "pos.x or pos.y  not set"); return; }
	var x = parseInt( def.pos.x );
	var y = parseInt( def.pos.y );
	var w = 50;
	var h = 25;
	if ( def.width  ) {  w = parseInt( def.width ); }
	if ( def.height ) {  h = parseInt( def.height ); }
	ctx.beginPath();
	ctx.lineWidth   = "2";
	ctx.strokeStyle = "#00F";
	ctx.fillStyle   = "#DDD";
	if ( def.lineCol ) { ctx.strokeStyle = def.lineCol; }
	if ( def.fillCol ) { ctx.fillStyle   = def.fillCol; }
	ctx.rect( x, y, w, h );
	ctx.stroke();
	ctx.fill();  	
	ioSense[ divId ][ def.id ] = new Object();
	ioSense[ divId ][ def.id ].x1 = x;
	ioSense[ divId ][ def.id ].x2 = x + w;
	ioSense[ divId ][ def.id ].y1 = y;
	ioSense[ divId ][ def.id ].y2 = y + h;
	
	if ( def.values  &&  def.values.length  ) {
			
		var ledDef = new Object;
		if ( def.led ) {
			ledDef = def.led;
		} else {
			ledDef.id = def.id+"LED";
			ledDef.pos = new Object();
			ledDef.pos.x = x + 2;
			ledDef.pos.y = y + 2;
			ledDef.ledHeight = 3;
		}
		var ledDta = new Object();
		ledDta.value = 0;
		if ( dta && dta.value ) {
			for ( var i = 0; i < def.values.length; i++ ) {
				var btVal = def.values[ i ];
			    //log( "pong-io", "btnVal is " + JSON.stringify( btVal ) );
				if ( btVal.buttonState == dta.value ) { 
					ledDta.value = btVal.led; 
				    //log( "pong-io", " led: " + btVal.led );
				}				    
			}
		}
		pongIOrenderLED( divId, ctx, ledDef, ledDta );	
		
	}
	
	if ( def.label ) {
		var xx = x + w/2, yy = y + h/2; 
		ctx.textAlign = "center"; 
		ctx.textBaseline = "middle"; 
		textOut( divId, def, ctx, def.label, xx, yy, { strokeStyle:"#DDD" } );
	}
	
	log( "pong-ioX", "pongIOrenderButton end.");
}

function pongIOcheckButtonSense( divId, x, y, id, s ) {
	log( "pong-io", "pongIOcheckButtonSense: "+x+"/"+y+"  "+s.x1+"-"+s.x2+"/"+s.y1+"-"+s.y2);
	if ( ( x > s.x1 ) && ( x < s.x2 ) && ( y > s.y1 ) && ( y < s.y2 ) ) {
		log( "pong-io", "Button: "+id );
		$.ajax( 
			{ url: moduleConfig[ divId ].dataURL, 
			  type: "POST", 
			  dataType: "json",
			  contentType: "application/json",
			  data: JSON.stringify( { id:id, type:"Button" } ), // backend is responsible for state and value
			  beforeSend: function( request ) {
					if ( sessionInfo["OAuth"] != null && sessionInfo["OAuth"]["access_token"] != null && sessionInfo["OAuth"]["access_token"] != "" ) {
						request.setRequestHeader( "Authorization", "Bearer "+sessionInfo["OAuth"]["access_token"] ); 
					}
				}				
			}
		).done(
			function( dta) {
				pongIOrenderData( divId, dta );
        publishEvent( 'feedback', {'text':'Processed response from I/O service '} )
			}
    ).fail(
        function() { publishEvent( 'feedback', {'text':'ERROR: I/O service not responding!'} ) }
    );      
	}
}

//---------------------------------------------------------------------------------------

function pongIOrenderSwitch( divId, ctx, def, dta ) {
	log( "pong-io", "pongIOrenderSwitch '"+def.id+"': "+JSON.stringify(dta) );
	ioSense[ divId ][ def.id ] = new Array();
	var x = parseInt( def.pos.x );
	var y = parseInt( def.pos.y );
	ctx.textAlign = "start";
	ctx.textBaseline = "middle";
	if ( def.values && def.values.length ) { 
		ctx.beginPath();
		ctx.strokeStyle = "#00F";
		ctx.fillStyle   = "#DDD";
		if ( def.lineCol ) { ctx.strokeStyle = def.lineCol; }
		if ( def.fillCol ) { ctx.fillStyle   = def.fillCol; }
		ctx.arc( x, y, 15, 0 ,2*Math.PI );
		ctx.stroke();		
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo( x, y );
		var xx = x + 17
		if ( def.values.length == 2 ) {
			var yy = y - 8;
			textOut( divId, def, ctx, def.values[0], xx, yy );
			pongIOaddSwitchSense( divId, def.id, def.values[0], xx, yy );
			if ( dta && dta.value ) {
			  if ( def.values[0] == dta.value ) {
	        pongIOrenderSwitchLine( ctx, x+10, y-10, def );
			  }
			} else if ( def.defaultValue && def.defaultValue == def.values[0] ){ // first value is default
	       pongIOrenderSwitchLine( ctx, x+10, y-10, def );
			} 
			yy = y + 8;
			textOut( divId, def, ctx, def.values[1], xx, yy );
			pongIOaddSwitchSense( divId, def.id, def.values[1], xx, yy );
			if ( dta && dta.value ) {
			  if (def.values[1] == dta.value ) {
	        pongIOrenderSwitchLine( ctx, x+10, y+10, def );
			  }
			} else if ( def.defaultValue && def.defaultValue == def.values[1] ){ // second value is default
         pongIOrenderSwitchLine( ctx, x+10, y+10, def );
      } 
		} else if ( def.values.length == 3 ) {
			var yy = y - 12;
			textOut( divId, def, ctx, def.values[0], xx, yy );
			pongIOaddSwitchSense( divId, def.id, def.values[0], xx, yy );
			if ( dta && dta.value ) {
        if ( def.values[0] == dta.value ) {
          pongIOrenderSwitchLine( ctx, x+10, y-10, def );
        }
      } else if ( def.defaultValue && def.defaultValue == def.values[0] ){ // first value is default
        pongIOrenderSwitchLine( ctx, x+10, y-10, def );        
      }
			yy = y;
			textOut( divId, def, ctx, def.values[1], xx, yy );
			pongIOaddSwitchSense( divId, def.id, def.values[1], xx, yy );
			if ( dta && dta.value ) {
        if ( def.values[1] == dta.value ) {
          pongIOrenderSwitchLine( ctx, x+15, y, def );
        } 
			} else if ( def.defaultValue && def.defaultValue == def.values[1] ){ // second value is default
        pongIOrenderSwitchLine( ctx, x+15, y, def );			  
			}
			yy = y + 12;
			textOut( divId, def, ctx, def.values[2], xx, yy );
			pongIOaddSwitchSense( divId, def.id, def.values[2], xx, yy );
			if ( dta && dta.value ) {
        if ( def.values[2] == dta.value ) {
          pongIOrenderSwitchLine( ctx, x+10, y+10, def );
        }
			} else if ( def.defaultValue && def.defaultValue == def.values[1] ){ // second value is default
        pongIOrenderSwitchLine( ctx, x+10, y+10, def );
			}
		}
	}
	
	log( "pong-io", "pongIOrenderSwitch end.");
}

function pongIOrenderSwitchLine( ctx, xt, yt, def ) {
	log( "pong-io", xt +" / " + yt );
	ctx.strokeStyle = "#00F";
	ctx.fillStyle   = "#DDD";
	if ( def.lineCol ) { ctx.strokeStyle = def.lineCol; }
	if ( def.fillCol ) { ctx.fillStyle   = def.fillCol; }
	ctx.lineTo( xt, yt ); 
	ctx.stroke();	
}

function pongIOaddSwitchSense( divId, id, val, xx, yy ) {
	log( "pong-io", "pongIOaddSwitchSense" );
	ioSense[ divId ][ id ][ val ] = new Object();
	ioSense[ divId ][ id ][ val ].x1 = xx;
	ioSense[ divId ][ id ][ val ].x2 = xx + 30;
	ioSense[ divId ][ id ][ val ].y1 = yy - 7;
	ioSense[ divId ][ id ][ val ].y2 = yy + 7;	
}

function pongIOchangeSwitchUserClick( divId, id, val ) {
  var ctx = document.getElementById( divId+'Canvas' ).getContext("2d");
  var pmd = moduleConfig[ divId ];
  for ( var c = 0; c < pmd.io.length; c++ ) {
    var io = pmd.io[c];
    if ( io.id == id ) {
      pongIOrenderSwitch( divId, ctx, io, { 'value':val} );      
    }
  }
}

function pongIOcheckSwitchSense( divId, x, y, id, val, s ) {
  log( "pong-io", "pongIOcheckSwitchSense: "+id );
	if ( ( x > s.x1 ) && ( x < s.x2 ) && ( y > s.y1 ) && ( y < s.y2 ) ) {
	  pongIOchangeSwitchUserClick( divId, id, val );
		log( "pong-io", "Switch: "+id+" >> "+val );
		$.ajax( 
			{ url: moduleConfig[ divId ].dataURL, 
			  type: "POST", 
			  dataType: "json",
			  contentType: "application/json",
			  data: JSON.stringify( { id:id, value:val, type:"Switch" } ),
			  beforeSend: function( request ) {
					if ( sessionInfo["OAuth"] != null && sessionInfo["OAuth"]["access_token"] != null && sessionInfo["OAuth"]["access_token"] != "" ) {
						request.setRequestHeader( "Authorization", "Bearer "+sessionInfo["OAuth"]["access_token"] ); 
					}
				}				
			}
		).done(
			function( dta) {
				pongIOrenderData( divId, dta );
		    publishEvent( 'feedback', {'text':'Processed response from I/O service '} )
			}
		).fail(
		    function() { publishEvent( 'feedback', {'text':'ERROR: I/O service not responding!'} ) }
		);		  
	}
}

//---------------------------------------------------------------------------------------

function pongIOrenderPoti( divId, ctx, def, dta ) {
	log( "pong-io", "pongIOrenderPoti '"+def.id+"': "+JSON.stringify(dta) );
	var x = parseInt( def.pos.x );
	var y = parseInt( def.pos.y );
	var w = parseInt( def.width );
	var min = parseInt( def.min );
	var max = parseInt( def.max );
	ctx.beginPath();
	ctx.lineWidth   = "2";
	ctx.strokeStyle = "#00F";
	ctx.fillStyle   = "#DDD";
	if ( def.lineCol ) { ctx.strokeStyle = def.lineCol; }
	if ( def.fillCol ) { ctx.fillStyle   = def.fillCol; }
	ctx.rect( x, y, w, 20 );
	ctx.stroke();
	ctx.fill();  	
	ioSense[ divId ][ def.id ] = new Object();
	ioSense[ divId ][ def.id ].x1 = x;
	ioSense[ divId ][ def.id ].x2 = x + w;
	ioSense[ divId ][ def.id ].y1 = y;
	ioSense[ divId ][ def.id ].y2 = y + 20;
	ioSense[ divId ][ def.id ].min = min;
	ioSense[ divId ][ def.id ].max = max;
	if ( dta && dta.value != null ) {
		log( "pong-io", "pongIOrenderPoti "+x+" + "+w+" * "+dta.value+" / ( "+max+" -"+ min+" )" );
		ctx.beginPath();
		var xx = x + ( w - 5 ) * dta.value / ( max - min );
		log( "pong-io", "pongIOrenderPoti xx="+xx );
		var yy = y ;
		ctx.rect( xx, y, 5, 20 );
		ctx.strokeStyle = "#00A";
		ctx.fillStyle   = "#117";
		if ( def.lineCol ) { ctx.strokeStyle = def.lineCol; }
		if ( def.fillCol ) { ctx.fillStyle   = def.fillCol; }
		ctx.stroke();
		ctx.fill();  	
	}
	log( "pong-io", "pongIOrenderPoti end.");
}


function pongIOcheckPotiSense( divId, x, y, id, s ) {
	if ( ( x > s.x1 ) && ( x < s.x2 ) && ( y > s.y1 ) && ( y < s.y2 ) ) {
		var val = s.min + ( x - s.x1 ) * ( s.max - s.min ) / ( s.x2 - s.x1 );
		log( "pong-io", "Poti: "+id +" >> "+val );
		$.ajax( 
			{ url: moduleConfig[ divId ].dataURL, 
			  type: "POST", 
			  dataType: "json",
			  contentType: "application/json",
			  data: JSON.stringify( { id:id, value:val, type:"Poti" } ),
			  beforeSend: function( request ) {
					if ( sessionInfo["OAuth"] != null && sessionInfo["OAuth"]["access_token"] != null && sessionInfo["OAuth"]["access_token"] != "" ) {
						request.setRequestHeader( "Authorization", "Bearer "+sessionInfo["OAuth"]["access_token"] ); 
					}
				}				
			}
		).done(
			function( dta) {
				pongIOrenderData( divId, dta );
        publishEvent( 'feedback', {'text':'Processed response from I/O service '} )
			}
    ).fail(
        function() { publishEvent( 'feedback', {'text':'ERROR: I/O service not responding!'} ) }
    );      
	}
}
//---------------------------------------------------------------------------------------

function pongIOrenderDisplay( divId, ctx, def, dta ) {
	log( "pong-io", "pongIOrenderDisplay '"+def.id+"': "+JSON.stringify(dta) );
	var x = parseInt( def.pos.x );
	var y = parseInt( def.pos.y );
	var w = parseInt( def.width )*10;
	log( "pong-io", x+"/"+y+"/"+w );
	ctx.beginPath();
	ctx.lineWidth   = "2";
	ctx.strokeStyle = "#00A";
	ctx.fillStyle   = "#DDD";
	if ( def.lineCol ) { ctx.strokeStyle = def.lineCol; }
	if ( def.fillCol ) { ctx.fillStyle   = def.fillCol; }
	ctx.rect( x, y, w, 20 );
	ctx.stroke();
	ctx.fill();  		
	if ( dta  && dta.value  ) {
		var opt = new Object();
		opt.fillStyle   = "#040";
		opt.strokeStyle = "#0F0";
		ctx.textAlign = "end"; 
		ctx.textBaseline = "bottom"; 
		var xx = x + w - 4;
		var yy = y + 17;
		log( "pong-io", "ctx.fillText( "+dta.value+","+ xx+","+yy+" );" );
//		ctx.fillText( dta.value, xx, yy );
		textOut( divId, def, ctx, dta.value, xx, yy, opt );
	}	
	log( "pong-io", "pongIOrenderDisplay end.");
}

//---------------------------------------------------------------------------------------

function pongIOrenderImg( ctx, def ) {
	log( "pong-io", "pongIOrenderImg '"+def.id );
	var background = new Image();	
	if ( def.imgURL && def.pos && def.pos.x && def.pos.y ) {
		background.src = def.imgURL;
		background.onload = function() {
			if ( def.width && def.height ) {
				ctx.drawImage( background, def.pos.x, def.pos.y, def.width, def.height ); 
			} else {
				ctx.drawImage( background, def.pos.x, def.pos.y ); 				
			}
	    };
	}
	log( "pong-io", "pongIOrenderImg end.");
}

//---------------------------------------------------------------------------------------

function pongIOrenderLED( divId, ctx, def, dta ) {
	log( "pong-io", "pongIOrenderLED '"+def.id+"': "+JSON.stringify(dta) );
	var x = parseInt( def.pos.x );
	var y = parseInt( def.pos.y );
	ctx.beginPath();
	if ( dta == null || dta.value == null ) {
		log( "pong-io", "LED null" );
		ctx.strokeStyle = "grey";
		ctx.fillStyle   = "grey";
	} else if ( dta.value == "1" ) {
		log( "pong-io", "LED green" );
		ctx.strokeStyle = "#0f0";
		ctx.fillStyle   = "#0f0";
	} else if ( dta.value == "0" ) {
		log( "pong-io", "LED black" );
		ctx.strokeStyle = "black";
		ctx.fillStyle   = "black";
	}  else if ( dta.value == "-1" ) {
		log( "pong-io", "LED red" );
		ctx.strokeStyle = "red";
		ctx.fillStyle   = "red";
	}  else if ( dta.value == "2" ) {
		log( "pong-io", "LED red" );
		ctx.strokeStyle = "yellow";
		ctx.fillStyle   = "yellow";
	} else if ( def.values && def.values.length ) { 
		for ( var i = 0; i < def.values.length; i++ ) {
			if ( def.values[i].value  &&  dta.value == def.values[i].value  &&  def.values[i].color ) {
				log( "pong-io", "LED "+ def.values[i].value+" > " + def.values[i].color );
				ctx.strokeStyle = def.values[i].color;
				ctx.fillStyle   = def.values[i].color;				
			}
		}
	} else {
		log( "pong-io", "LED other" );
		ctx.strokeStyle = "grey";
		ctx.fillStyle   = "grey";
	}
	var ledW = 7, ledH = 7;
	if ( def.ledWidth  ) { ledW = parseInt( def.ledWidth ); }
	if ( def.ledHeight ) { ledH = parseInt( def.ledHeight ); }
	ctx.rect( x, y, ledW, ledH );
	ctx.fill();  		
	if ( def.labels && def.labels.length ) {
		for ( var i = 0; i < def.labels.length; i++ ) {
			log( "pong-ioX", i+ "  ");
			var tx = x + ledW / 2;
			var ty = y + ledH / 2;
			log( "pong-ioX", i+ "  " + tx+"/"+ty );
			if ( def.labels[i].posX ) { tx = def.labels[i].posX; }
			if ( def.labels[i].posY ) { ty = def.labels[i].posY; }
			pongIOrenderLabel( divId, ctx, def.labels[i], dta, tx, ty );
		}		
	} 
	log( "pong-io", "pongIOrenderLED end.");
}

//---------------------------------------------------------------------------------------

function pongIOrenderLabel( divId, ctx, def, dta, x , y ) {
	log( "pong-ioX", "pongIOrenderLabel "+JSON.stringify(def) );
	ctx.textAlign = "center";
	ctx.textBaseline = "bottom";
	if ( def.label ) {
		textOut( divId, def, ctx, def.label, x, y, null )
	} else if ( def.link ) {
		// TODO
	} else if ( def.data && def.format ) {
		var txt = getSubData( dta, def.data );
		log( "pong-ioX", " "+def.data+": "+txt );
		if ( txt ) {
			textOut( divId, def, ctx, sprintf( def.format, txt ), x, y, null );				
		}
	} 		
	log( "pong-io", "pongIOrenderLabel end.");
}

function sprintf() {
    var args = arguments,
    string = args[0],
    i = 1;
    return string.replace(/%((%)|s|d)/g, function (m) {
        // m is the matched format, e.g. %s, %d
        var val = null;
        if (m[2]) {
            val = m[2];
        } else {
            val = args[i];
            // A switch statement so that the formatter can be extended. Default is %s
            switch (m) {
                case '%d':
                    val = parseFloat(val);
                    if (isNaN(val)) {
                        val = 0;
                    }
                    break;
            }
            i++;
        }
        return val;
    });
}


// ---------------------------------------------------------------------------------------

function pongIOrenderGraph( divId, ctx, def, dta ) {
	log( "pong-io", "pongIOrenderGraph '"+def.id+"': "+JSON.stringify(def) );
	if ( def.pos  &&  def.pos.x != null  &&  def.pos.y != null  &&  def.width  &&  def.height &&
		 def.layout && def.layout.yAxis  &&  def.layout.yAxis.min != null  &&  def.layout.yAxis.max != null ) {} else { 
		log( "pong-io", "pongIOrenderGraph: Config not OK! End.");
		return;
	} 
	var x = parseInt(def.pos.x) , y = parseInt(def.pos.y) , w = parseInt(def.width) , h = parseInt(def.height) , 
		yMin = parseFloat( def.layout.yAxis.min ) , yMax = parseFloat( def.layout.yAxis.max );
	isa = { xAxis:{}, yAxis:{} };
	ioSense[ divId ][ def.id ] = isa;
	isa.yAxis.xmin = x-40;	isa.yAxis.ymin = y;
	isa.yAxis.xmax = x+10;	isa.yAxis.ymax = y+h;

	// if ( def.layout.xAxis && def.layout.xAxis.axisType == 'time' ) {
	// 	ctx.beginPath();
	// 	ctx.strokeStyle = "#FFF";
	// 	ctx.fillStyle   = "#FFF";
	// 	ctx.lineWidth    = "1";
	// 	ctx.rect( x-40, y+h+1, w+80, 21 );
	// 	ctx.stroke();
	// 	ctx.fill();         
	// }

	ctx.beginPath();
	ctx.strokeStyle = "#FFF";
	ctx.fillStyle   = "#FFF";
	ctx.lineWidth    = "1";
	ctx.rect( x-40, y-10, w+80, h+30 );
	ctx.stroke();
	ctx.fill();         


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
		textOut(  divId, def, ctx, def.layout.name, xx, y, {"font":"10pt Arial"} );		
	}
		
	// draw y axis
	var lYmin = yMin , lYmax = yMax , yLogType = false ;
	if ( def.layout.yAxis.axisType && def.layout.yAxis.axisType == "logarithmic" ) {  
		yLogType = true;
		lYmin = Math.log( yMin );
		lYmax = Math.log( yMax );		
	}
	log( "pong-io", "Graph y-min="+lYmin );	
	log( "pong-io", "Graph y-max="+lYmax );	
	// render grid
    if ( def.layout.yAxis.grid && def.layout.yAxis.grid.length ) {
      var gCol = "#EEE";
      if ( def.layout.yAxis.gridColor ) { gCol = def.layout.yAxis.gridColor; }
      log( "pong-io", "Graph y-grid col: "+gCol );
      //var xx = x + 4, xt= x - 3;
      for ( var c = 0; c < def.layout.yAxis.grid.length; c++ ) {
          var l = parseFloat( def.layout.yAxis.grid[c] );
          if ( ! isNaN( l ) &&  lYmin <= l  &&  l <= lYmax  ) {
              var ly = h * (  l - lYmin ) / ( lYmax - lYmin );
              if ( yLogType ) {
                  ly = h * ( Math.log(l) - lYmin ) / ( lYmax - lYmin );
                  log( "pong-io", "Graph y-grid="+h+" "+y+" "+ly+"   (Log("+l+")="+Math.log(l)+")" );
              }
              var lyy = Math.round( y  + h - ly ); 
              log( "pong-io", "Graph y-grid: "+x+"/"+lyy+" -- "+x+w+"/"+lyy );
              ctx.beginPath();
              ctx.strokeStyle = gCol;
              ctx.moveTo( x     , lyy );
              ctx.lineTo( x + w , lyy );
              ctx.stroke();
          }
      }
    }

	// render graph lables
	ctx.textAlign = "end";
	ctx.textBaseline = "middle";
	if ( def.layout.yAxis.labels && def.layout.yAxis.labels.length ) {
		var xx = x + 4, xt= x - 3;
		for ( var c = 0; c < def.layout.yAxis.labels.length; c++ ) {
			var l = parseFloat( def.layout.yAxis.labels[c] );
			if ( ! isNaN( l ) &&  lYmin <= l  &&  l <= lYmax ) {
				var ly = h * (  l - lYmin ) / ( lYmax - lYmin );
				if ( yLogType ) {
					ly = h * ( Math.log(l) - lYmin ) / ( lYmax - lYmin );
					log( "pong-io", "Graph y-lbl="+h+" "+y+" "+ly+"   (Log("+l+")="+Math.log(l)+")" );
				}
				var lyy = Math.round( y	 + h - ly ); 
				log( "pong-io", "Graph y-lbl: "+x+"/"+lyy+" -- "+xx+"/"+lyy);
                ctx.beginPath();
                ctx.moveTo( x,  lyy );
				ctx.strokeStyle = "#00A";
				ctx.fillStyle   = "#DDD";
				ctx.lineTo( xx, lyy );
				ctx.stroke();
				textOut(  divId, def, ctx, l, xt, lyy, {"font":"8pt Arial"} );
			}
		}
	}
	
	if ( def.layout.xAxis && def.layout.xAxis.axisType == 'time' ) {
	  var cnt = 10
	  if ( def.layout.xAxis.labelCnt ) {
	    cnt = parseInt( def.layout.xAxis.labelCnt );
	  }
	  var dx = w / cnt;
	  log( "pong-io",  'do time '+dx );
	  var xMin = null; 
	  var xMax = null;

	  if ( dta  && dta.length ) { 
	    for ( var c = 0; c < dta.length; c++ ) {
	      var g = dta[c];
	      if ( g.data && g.data.length ) {
	        xMin = g.data[0][0]; 
	        xMax = g.data[0][0];
	        for ( var i = 0; i < g.data.length; i++ ) {
	          if ( xMax < g.data[i][0] ) { xMax = g.data[i][0] }
	          if ( xMin > g.data[i][0] ) { xMin = g.data[i][0] }
	        }
	      }
	    }
	  }
	  log( "pong-io", "##### Min/Max "+ xMin+" / "+xMax  );
	  var nDef = JSON.parse( JSON.stringify(def) );
	  nDef.textAlign = 'center';
	  for ( var xi = 0; xi <= cnt; xi++) {
        if ( xi != 0  &&  xi != cnt  &&  def.layout.xAxis.gridColor ) {
          ctx.beginPath();
          ctx.strokeStyle = def.layout.xAxis.gridColor;
          ctx.fillStyle   = def.layout.xAxis.gridColor;
          ctx.moveTo( x+dx*xi, y+1   );
          ctx.lineTo( x+dx*xi, y+h-1 );
          ctx.stroke();        
        }
	    ctx.beginPath();
	    ctx.moveTo( x +dx*xi,  y+h );
	    ctx.strokeStyle = "#00A";
	    ctx.fillStyle   = "#DDD";
	    ctx.lineTo( x+dx*xi,  y+h-5 );
	    ctx.stroke();
	    if ( xMin && xMax ) {
	      var lblDt = xMin + ( xMax - xMin ) * xi / cnt;
	      var lbl = ( new Date( lblDt ) ).toLocaleTimeString();
	      textOut(  divId, nDef, ctx, lbl, x+dx*xi, y+h+10, {"font":"8pt Arial"} );
	      if ( xi == 0 || xi == cnt ) {
	        lbl = ( new Date( lblDt ) ).toLocaleDateString();
	        textOut(  divId, nDef, ctx, lbl, x+dx*xi, y+h+20, {"font":"8pt Arial"} );                       
	      } 
	    }           
	  } 
	} 
	   
	// draw graphs
	if ( dta  && dta.length ) {
		for ( var c = 0; c < dta.length; c++ ) {
			var g = dta[c];
			log( "pong-io", ">>>>>>>>>>> #d="+ g.data.length  );
			if ( g.data && g.data.length ) {
				var xMin = g.data[0][0]; xMax = g.data[0][0];
				for ( var i = 0; i < g.data.length; i++ ) {
					if ( xMax < g.data[i][0] ) { xMax = g.data[i][0] }
					if ( xMin > g.data[i][0] ) { xMin = g.data[i][0] }
				}
				if ( xMin == xMax ) { xMax += 1; }
				log( "pong-io", " xMin="+xMin+" xMax="+xMax );
				var drawL = false;
				ctx.beginPath();
				ctx.strokeStyle = "#99F";
				if ( def.layout.colors && def.layout.colors[ g.name ] ) {
					ctx.strokeStyle = def.layout.colors[ g.name ];
				}
				for ( var i = 0; i < g.data.length; i++ ) {
					var xx = x + Math.round(  w * ( g.data[i][0] - xMin ) / ( xMax - xMin) );
					//log( "pong-io", " xx = "+xx +"    > "+g.data[i][0]+" "+w+" "+x );
					var yy = y;
					if ( yLogType ) {
						yy = y + h - Math.round( h * ( Math.log( g.data[i][1] ) - lYmin ) / ( lYmax - lYmin ) );
						//log( "pong-io", " xx = "+xx +"   d="+g.data[i][1]+" / yy = "+yy );
					} else {
						yy = y + h - Math.round( h * ( g.data[i][1] - lYmin ) / ( lYmax - lYmin ) );
					}
					//log( "pong-io", " xx = "+xx +"   d="+g.data[i][1]+" / yy = "+yy );
					if ( yMin <= g.data[i][1] && g.data[i][1] <= yMax && drawL ) {
						//log( "pong-io", " lineto( "+xx+" / "+yy+" )" );
						ctx.lineTo( xx, yy );												
						ctx.stroke();
					} else {
						//log( "pong-io", " moveto( "+xx+" / "+yy+" )" );
						ctx.moveTo( xx, yy );						
					}
					if ( yMin <= g.data[i][1] && g.data[i][1] <= yMax ) { drawL = true; } else { drawL = false; }
				}
			}
			//if ( g.length ) {
			//}
			
		}
	}
	
	// TODO IO: implement graph
	log( "pong-io", "pongIOrenderGraph end.");
}


function pongIOcheckGraphSense(  divId, x, y, xMD, yMD,  id, s ) {
	var def = null;
	var updateRequired = false;
	for ( var i = 0; i < moduleConfig[ divId ].io.length; i++ ) {
		if ( def = moduleConfig[ divId ].io[i].id == id ) {
			def = moduleConfig[ divId ].io[i];	break;
		}
	}
	if ( def == null ) { return; }

	if ( s.yAxis && s.yAxis.xmin && s.yAxis.xmax && s.yAxis.ymin && s.yAxis.ymax  ) {
		if ( s.yAxis.xmin < x && x < s.yAxis.xmax && s.yAxis.ymin < yMD && yMD < s.yAxis.ymax ) { // click is for this axis
			var yAxis = def.layout.yAxis;
			var yAxismin = parseFloat( yAxis.min );
			var yAxismax = parseFloat( yAxis.max );
			console.log( 's.yAxis.ymin:'+s.yAxis.ymin+' s.yAxis.ymax:'+s.yAxis.ymax+'  y:'+y+' yMD:'+yMD+' id:'+id )
			console.log( 'yAxismin:'+yAxismin+'  yAxismax:'+yAxismax )
			if ( yAxis.type != 'logarithmic' ) { 
				var yStart = yAxismin + ( yAxismax - yAxismin )*( s.yAxis.ymax - yMD )/( s.yAxis.ymax - s.yAxis.ymin );
				var yEnd   = yAxismin + ( yAxismax - yAxismin )*( s.yAxis.ymax - y   )/( s.yAxis.ymax - s.yAxis.ymin );
				// yMax scaling:
				var midYAxis = yAxismin + ( yAxismax - yAxismin ) / 2;
				if ( ( yStart > midYAxis ) ) {
					if ( yAxis.scaleHiMin && yAxis.scaleHiMax ) { // y-Max scaling allowed
						console.log( 'NEW-yMAX  Y: '+yStart+' >> '+yEnd )
						var nYmax =  yAxismin + ( yAxismax - yAxismin ) *  ( yStart - yAxismin) / ( yEnd - yAxismin ) ;
						console.log( '    scaling: '+nYmax  );
						def.layout.yAxis.max = nYmax;
						if ( def.layout.yAxis.max < yAxis.scaleHiMin ) { def.layout.yAxis.max = yAxis.scaleHiMin; }
						if ( def.layout.yAxis.max > yAxis.scaleHiMax ) { def.layout.yAxis.max = yAxis.scaleHiMax; }
						updateRequired = true;
					}
				} else {  
					if ( yAxis.scaleHiMin && yAxis.scaleHiMax ) { // y-Max scaling allowed
						console.log( 'NEW-yMIN  Y: '+yStart+' >> '+yEnd );
						var nYmin =  yAxismax - ( yAxismax - yAxismin ) *  ( yStart - yAxismax) / ( yEnd - yAxismax ) ;
						console.log( '    scaling: '+nYmin  );
						def.layout.yAxis.min = nYmin;
						if ( def.layout.yAxis.min < yAxis.scaleLoMin ) { def.layout.yAxis.min = yAxis.scaleLoMin; }
						if ( def.layout.yAxis.min > yAxis.scaleLoMax ) { def.layout.yAxis.min = yAxis.scaleLoMax; }
						updateRequired = true;
					}
				}
			} else { // logarithmic
				//TODO
			}
		}
	}
	if ( updateRequired ) { // re-render IO view...
		pongIoUpdateData( divId )
	}
}

//---------------------------------------------------------------------------------------

/** helper */
function textOut( divId, def, ctx, txt, x, y, opt ) {
	log( "pong-io", "textOut: "+divId+ " "+x+"/"+y);
	var pmd = moduleConfig[ divId ];
	if ( def.textAlign ) {	ctx.textAlign = def.textAlign; } 
	if ( def.textBaseline ) {	ctx.textAlign = def.textBaseline; } 

	if ( def.font ) {	ctx.font = def.font; } 
		else if ( pmd.font ) { ctx.font   = pmd.font; } 
			else if ( opt && opt.font ) { ctx.font   = opt.font; } 
				else { ctx.font   = "14px Courier"; }

	if ( def.textFillColor ) {	ctx.fillStyle = def.textFillColor; } 
		else if ( pmd.textFillColor ) { ctx.fillStyle   = pmd.textFillColor; } 
			else if ( opt && opt.fillStyle ) { ctx.fillStyle   = opt.fillStyle; } 
				else { ctx.fillStyle   = "#00F"; }
	
	if ( def.textStrokeColor ) {	ctx.strokeStyle = def.textStrokeColor; } 
		else if ( pmd.textStrokeColor ) { ctx.strokeStyle   = pmd.textStrokeColor; } 
			else if ( opt && opt.strokeStyle ) { ctx.strokeStyle   = opt.strokeStyle; } 
				else { ctx.strokeStyle   = "#FFF"; }
	
	ctx.strokeText( txt, x, y );
	ctx.fillText(   txt, x, y );
	
	//log( "pong-io", "textOut end.");
}

//---------------------------------------------------------------------------------------
//name: Hermite resize
//about: Fast image resize/resample using Hermite filter with JavaScript.
//author: ViliusL
//demo: http://viliusle.github.io/miniPaint/
function resample_hermite(canvas, W, H, W2, H2){
	var time1 = Date.now();
	W2 = Math.round(W2);
	H2 = Math.round(H2);
	var img = canvas.getContext("2d").getImageData(0, 0, W, H);
	var img2 = canvas.getContext("2d").getImageData(0, 0, W2, H2);
	var data = img.data;
	var data2 = img2.data;
	var ratio_w = W / W2;
	var ratio_h = H / H2;
	var ratio_w_half = Math.ceil(ratio_w/2);
	var ratio_h_half = Math.ceil(ratio_h/2);
	
	for(var j = 0; j < H2; j++){
		for(var i = 0; i < W2; i++){
			var x2 = (i + j*W2) * 4;
			var weight = 0;
			var weights = 0;
			var weights_alpha = 0;
			var gx_r = gx_g = gx_b = gx_a = 0;
			var center_y = (j + 0.5) * ratio_h;
			for(var yy = Math.floor(j * ratio_h); yy < (j + 1) * ratio_h; yy++){
				var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
				var center_x = (i + 0.5) * ratio_w;
				var w0 = dy*dy //pre-calc part of w
				for(var xx = Math.floor(i * ratio_w); xx < (i + 1) * ratio_w; xx++){
					var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
					var w = Math.sqrt(w0 + dx*dx);
					if(w >= -1 && w <= 1){
						//hermite filter
						weight = 2 * w*w*w - 3*w*w + 1;
						if(weight > 0){
							dx = 4*(xx + yy*W);
							//alpha
							gx_a += weight * data[dx + 3];
							weights_alpha += weight;
							//colors
							if(data[dx + 3] < 255)
								weight = weight * data[dx + 3] / 250;
							gx_r += weight * data[dx];
							gx_g += weight * data[dx + 1];
							gx_b += weight * data[dx + 2];
							weights += weight;
							}
						}
					}		
				}
			data2[x2]     = gx_r / weights;
			data2[x2 + 1] = gx_g / weights;
			data2[x2 + 2] = gx_b / weights;
			data2[x2 + 3] = gx_a / weights_alpha;
			}
		}
	console.log("hermite = "+(Math.round(Date.now() - time1)/1000)+" s");
	canvas.getContext("2d").clearRect(0, 0, Math.max(W, W2), Math.max(H, H2));
	canvas.width = W2;
	canvas.height = H2;
	canvas.getContext("2d").putImageData(img2, 0, 0);
}
