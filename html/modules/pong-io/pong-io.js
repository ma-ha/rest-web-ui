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

function pongIoRenderHTML( divId, resourceURL, paramObj, pmd ) {
	log( "pong-io", "pongIoRenderHTML img:'"+pmd.imgURL+"'");
	
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
	
	$( "#"+htmlDivId ).html( contentItems.join( "\n" ) );

	var ctx = document.getElementById( divId+'Canvas' ).getContext("2d");

	if ( pmd.imgURL != null ) {
		var background = new Image();
		background.src = pmd.imgURL;
		ctx.drawImage( background, 0, 0 );   
	}
	
	pongIoUpdateData( divId, { makeJS: true } );
		
	// output
	log( "pong-io", "pongIoRenderHTML end.");

}

function pongIOmakeJS( divId  ) {
	log( "pong-io", "pongIOmakeJS "+divId );
	var pmd = moduleConfig[ divId ];
	var contentItems = [];
	contentItems.push( '<script>' );
	contentItems.push( '  $( function() { ' );
	contentItems.push( '    $( "#' +divId+ 'Canvas" ).click( function( e ) { ' );
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
						if ( ioSense[ divId ] && ioSense[ divId ][ io.id ] && ioSense[ divId ][ io.id ][ io.values[val] ] ) {
							//log( "pong-io", "sense ("+io.values[val] +")..." );
							var s = ioSense[ divId ][ io.id ][ io.values[val] ];
							//log( "pong-io", "sense "+ JSON.stringify(s) );
							if ( s.x1 && s.x2 && s.y1 && s.y2 ) {
								//log( "pong-io", "sense: " + JSON.stringify( s ) );
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
					
				}
			}
		}
	}
	contentItems.push( '  } ) } );' );
	contentItems.push( '</script>' );
	$( "#"+divId+'pong-io_Div' ).append( contentItems.join( "\n" ) );
	log( "pong-io", "pongIOmakeJS end." );
}

function pongIOcheckPotiSense( divId, x, y, id, s ) {
	if ( ( x > s.x1 ) && ( x < s.x2 ) && ( y > s.y1 ) && ( y < s.y2 ) ) {
		var val = s.min + ( x - s.x1 ) * ( s.max - s.min ) / ( s.x2 - s.x1 );
		log( "pong-io", "Poti: "+id +" >> "+val );
		$.ajax( 
			{ url: moduleConfig[ divId ].dataURL, 
			  type: "POST", 
			  dataType: "json",
			  data: { id:id, value:val, type:"Poti" }
			}
		).done(
			function( dta) {
				pongIOrenderData( divId, dta );
			}
		);
	}
}

function pongIOcheckSwitchSense( divId, x, y, id, val, s ) {
	if ( ( x > s.x1 ) && ( x < s.x2 ) && ( y > s.y1 ) && ( y < s.y2 ) ) {
		log( "pong-io", "Switch: "+id+" >> "+val );
		$.ajax( 
			{ url: moduleConfig[ divId ].dataURL, 
			  type: "POST", 
			  dataType: "json",
			  data: { id:id, value:val, type:"Switch" }
			}
		).done(
			function( dta) {
				pongIOrenderData( divId, dta );
			}
		);		  
	}
}

/** update data call back hook */
function pongIoUpdateData( divId, paramsObj ) {
	log( "pong-io", "pongIoUpdateData start ");
	
	$.getJSON( 
		moduleConfig[ divId ].dataURL, 
		function( dta ) {
			log( "pong-io", "pongIoUpdateData data start");
					
			pongIOrenderData( divId, dta );
			
			if ( paramsObj && paramsObj.makeJS ) {
				pongIOmakeJS( divId );				
			}
	
			log( "pong-io", "pongIoUpdateData data end.");	
		}
	);
	
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
			var ioDta = null;
			if ( dta && dta[ io.id ] ) {
				ioDta = dta[ io.id ];
			}
			if ( io.type && io.pos && io.pos.x && io.pos.y ) {
				
				if ( io.type == 'LED') {
					pongIOrenderLED( ctx, io, ioDta );
				} else if ( io.type == 'Switch') {
					pongIOrenderSwitch( divId, ctx, io, ioDta );
				} else if ( io.type == 'Poti') {
					pongIOrenderPoti( divId, ctx, io, ioDta );
				} else if ( io.type == 'Gauge') {
					pongIOrenderGauge( ctx, io, ioDta );
				} else if ( io.type == 'Display') {
					pongIOrenderDisplay( ctx, io, ioDta );
				} else if ( io.type == 'Graph') {
					pongIOrenderGraph( ctx, io, ioDta );
				} else if ( io.type == 'Img') {
					pongIOrenderImg( ctx, io, ioDta );
				}  
			}
		}		
	}
	log( "pong-io", "pongIOrenderData data end");
}

function pongIOrenderGauge( ctx, def, dta ) {
	log( "pong-io", "pongIOrenderGauge '"+def.id+"': "+JSON.stringify(dta) );
	// TODO IO: implement gauge

	log( "pong-io", "pongIOrenderGauge end.");
}

function pongIOswitchClick( def, x, y ) {
	log( "pong-io", "pongIOgetSwitchJS ("+x+"/"+y+")  "+JSON.stringify(def) );
	// TODO
	log( "pong-io", "pongIOgetSwitchJS: end" );
}


function pongIOrenderSwitch( divId, ctx, def, dta ) {
	log( "pong-io", "pongIOrenderSwitch '"+def.id+"': "+JSON.stringify(dta) );
	ioSense[ divId ][ def.id ] = new Array();
	var x = parseInt( def.pos.x );
	var y = parseInt( def.pos.y );
	ctx.font = "14px Courier";
	ctx.textAlign = "start";
	ctx.textBaseline = "middle";
	if ( def.values && def.values.length ) { 
		ctx.beginPath();
		ctx.strokeStyle = "#00F";
		ctx.fillStyle   = "#DDD";
		ctx.arc( x, y, 15, 0 ,2*Math.PI );
		ctx.stroke();		
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo( x, y );
		var xx = x + 17
		if ( def.values.length == 2 ) {
			var yy = y - 8;
			ctx.fillStyle   = "#00F";
			ctx.fillText( def.values[0], xx, yy );
			pongIOaddSwitchSense( divId, def.id, def.values[0], xx, yy );
			if ( dta && dta.value && def.values[0] == dta.value ) {
				pongIOrenderSwitchLine( ctx, x+10, y-10 );
			}
			yy = y + 8;
			ctx.fillStyle   = "#00F";
			ctx.fillText( def.values[1], xx, yy );
			pongIOaddSwitchSense( divId, def.id, def.values[1], xx, yy );
			if ( dta && dta.value && def.values[1] == dta.value ) {
				pongIOrenderSwitchLine( ctx, x+10, y+10 );
			}
		} else if ( def.values.length == 3 ) {
			var yy = y - 12;
			ctx.fillStyle   = "#00F";
			ctx.fillText( def.values[0], xx, yy );
			pongIOaddSwitchSense( divId, def.id, def.values[0], xx, yy );
			if ( dta && dta.value && def.values[0] == dta.value ) {
				pongIOrenderSwitchLine( ctx, x+10, y-10 );
			}
			yy = y;
			ctx.fillStyle   = "#00F";
			ctx.fillText( def.values[1], xx, yy );
			pongIOaddSwitchSense( divId, def.id, def.values[1], xx, yy );
			if ( dta && dta.value && def.values[1] == dta.value ) {
				pongIOrenderSwitchLine( ctx, x+15, y );
			}
			yy = y + 12;
			ctx.fillStyle   = "#00F";
			ctx.fillText( def.values[2], xx, yy );
			pongIOaddSwitchSense( divId, def.id, def.values[2], xx, yy );
			if ( dta && dta.value && def.values[2] == dta.value ) {
				pongIOrenderSwitchLine( ctx, x+10, y+10 );
			}
		}
	}
	
	log( "pong-io", "pongIOrenderSwitch end.");
}

function pongIOrenderSwitchLine( ctx, xt, yt ) {
	log( "pong-io", xt +" / " + yt );
	ctx.strokeStyle = "#00F";
	ctx.fillStyle   = "#DDD";
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
	if ( dta && dta.value ) {
		log( "pong-io", "pongIOrenderPoti "+x+" + "+w+" * "+dta.value+" / ( "+max+" -"+ min+" )" );
		ctx.beginPath();
		var xx = x + ( w - 5 ) * dta.value / ( max - min );
		log( "pong-io", "pongIOrenderPoti xx="+xx );
		var yy = y ;
		ctx.rect( xx, y, 5, 20 );
		ctx.strokeStyle = "#00A";
		ctx.fillStyle   = "#117";
		ctx.stroke();
		ctx.fill();  	
	}
	log( "pong-io", "pongIOrenderPoti end.");
}


function pongIOrenderDisplay( ctx, def, dta ) {
	log( "pong-io", "pongIOrenderDisplay '"+def.id+"': "+JSON.stringify(dta) );
	var x = parseInt( def.pos.x );
	var y = parseInt( def.pos.y );
	var w = parseInt( def.width )*10;
	log( "pong-io", x+"/"+y+"/"+w );
	ctx.beginPath();
	ctx.lineWidth   = "2";
	ctx.strokeStyle = "#0F0";
	ctx.fillStyle   = "#DDD";
	ctx.rect( x, y, w, 20 );
	ctx.stroke();
	ctx.fill();  		
	if ( dta  || dta.value  ) {
		ctx.fillStyle   = "#040";
		ctx.font = "14px Courier";
		ctx.textAlign = "end"; 
		ctx.textBaseline = "bottom"; 
		var xx = x + w - 4;
		var yy = y + 15;
		log( "pong-io", "ctx.fillText( "+dta.value+","+ xx+","+yy+" );" );
		ctx.fillText( dta.value, xx, yy );
	}	
	log( "pong-io", "pongIOrenderDisplay end.");
}

function pongIOrenderImg( ctx, def, dta ) {
	log( "pong-io", "pongIOrenderImg '"+def.id+"': "+JSON.stringify(dta) );
	// TODO IO: implement img
	
	
	log( "pong-io", "pongIOrenderImg end.");
}

function pongIOrenderGrapgh( ctx, def, dta ) {
	log( "pong-io", "pongIOrenderImg '"+def.id+"': "+JSON.stringify(dta) );
	// TODO IO: implement graph

	log( "pong-io", "pongIOrenderImg end.");
}

function pongIOrenderLED( ctx, def, dta ) {
	log( "pong-io", "pongIOrenderLED '"+def.id+"': "+JSON.stringify(dta) );
	var x = parseInt( def.pos.x );
	var y = parseInt( def.pos.y );
	ctx.beginPath();
	if ( dta == null || dta.value == null ) {
		log( "pong-io", "null" );
		ctx.strokeStyle = "grey";
		ctx.fillStyle   = "grey";
		ctx.rect( x, y, 7, 7 );
		ctx.fill();  		
	} else if ( dta.value == "1" ) {
		log( "pong-io", "green" );
		ctx.strokeStyle = "#0f0";
		ctx.fillStyle   = "#0f0";
		ctx.rect( x, y, 7, 7 );
		ctx.fill();  		
	} else if ( dta.value == "0" ) {
		log( "pong-io", "black" );
		ctx.strokeStyle = "black";
		ctx.fillStyle   = "black";
		ctx.rect( x, y, 7, 7 );
		ctx.fill();  		
	}  else if ( dta.value == "-1" ) {
		log( "pong-io", "red" );
		ctx.strokeStyle = "red";
		ctx.fillStyle   = "red";
		ctx.rect( x, y, 7, 7 );
		ctx.fill();  		
	}  else if ( dta.value == "2" ) {
		log( "pong-io", "red" );
		ctx.strokeStyle = "yellow";
		ctx.fillStyle   = "yellow";
		ctx.rect( x, y, 7, 7 );
		ctx.fill();  		
	} else {
		log( "pong-io", "other" );
		ctx.strokeStyle = "grey";
		ctx.fillStyle   = "grey";
		ctx.rect( x, y, 7, 7 );
		ctx.fill();  				
	}
	log( "pong-io", "pongIOrenderLED end.");
}