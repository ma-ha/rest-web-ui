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

log( "pong_map", "load module"); // print this on console, when module is loaded
pong_map_dta = null;
pong_map_route = [];

// ======= Code for "loadResourcesHtml" hook ================================================
function pong_map_DivHTML( divId, resourceURL, paramObj ) {
	log( "pong_map",  "divId="+divId+" resourceURL="+resourceURL );
	if ( moduleConfig[ divId ] != null ) {
		log( "pong_map", "moduleConfig= '"+JSON.stringify( moduleConfig[ divId ] )+"'");
		pong_map_RenderHTML( divId, resourceURL, paramObj, moduleConfig[ divId ]  );
	} else {
		log( "pong_map", "moduleConfig: getJSON( "+resourceURL+"/pong_map )" );
		$.getJSON( 
			resourceURL+"/pong_map", 
			function( pmd ) {
				pong_map_RenderHTML( divId, resourceURL, paramObj, pmd );
			}
		);					
	}	
}
var pong_map_jsLoad = false;

function pong_map_RenderHTML( divId, resourceURL, paramObj, pmd ) {
	log( "pong_map", "pong_map_RenderHTML start divId:"+divId);
	
	var contentItems = [];
	contentItems.push( '<div id="'+divId+'_pong_map" class="pong_map" style="width:100%; height:100%">' );
	contentItems.push( '</div>' );
	// output
	$( "#"+divId ).html( contentItems.join( "\n" ) );
	
	
	var mapJsUrl = "http://www.mapquestapi.com/sdk/leaflet/v2.s/mq-map.js";
	var geocoderJsUrl = "https://www.mapquestapi.com/sdk/leaflet/v1.s/mq-geocoding.js";
	var routingJsUrl = "http://www.mapquestapi.com/sdk/leaflet/v1.s/mq-routing.js";
	
    $.getScript( mapJsUrl+"?key="+pmd.mapKey ).done( 
		function ( script, textStatus ) { 
			$.getScript( geocoderJsUrl+"?key="+pmd.mapKey ).done( 
				function ( script, textStatus ) { 
					log( 'pong_map', ' load '+mapJsUrl+': '+textStatus );
					$.getScript( routingJsUrl+"?key="+pmd.mapKey ).done( 
						function ( script, textStatus ) { 
							pong_map_createMap( divId, pmd );
						}
					).fail( 
						function( jqxhr, settings, exception ) { log( 'pong_map', ' load '+routingJsUrl+': '+exception ); } 
					); 
				} 
			).fail( 
				function( jqxhr, settings, exception ) { log( 'pong_map', ' load '+geocoderJsUrl+': '+exception ); } 
			); 
		} 
	).fail(
		function( jqxhr, settings, exception ) { log( 'pong_map', ' load '+mapJsUrl+': '+exception ); } 
	);
	
	log( "pong_map", "pong_map_RenderHTML end." );
}

function pong_map_createMap( divId, pmd ) {
	var lat = 51.400694; // 40.731701;
	var lon = 7.186241; // -73.993411;
	var zoom = 10;
	if ( pmd != null ) {
		if ( pmd.lat  != null ) { lat = pmd.lat; } 
		if ( pmd.lon  != null ) { lon = pmd.lon; } 
		if ( pmd.zoom != null ) { zoom = pmd.zoom; }	
	}
	log( "pong_map", "create Leaflet map" );
	if ( sessionInfo["OAuth"] != null && sessionInfo["OAuth"]["access_token"] == '' ) {
		log( "pong_map", "--------> Uiiiiii --- should wait for oauth ..." );		
 	    
	}
	var mapTimerId = setInterval( 
			
		function () {	
			if ( sessionInfo["OAuth"] != null && sessionInfo["OAuth"]["access_token"] == '' ) {
				log( "pong_map", "--------> Uiiiiii --- should wait for oauth ..." );		   
			} else {
				clearInterval( mapTimerId );
				log( "pong_map", " ... oauth done ;-)" );
		
				log( "pong_map", " CREATE MAP" );
				pong_map_dta =
					L.map( divId+'_pong_map' , 
							{
							    layers: MQ.mapLayer(),
							    center: [ lat, lon ],
							    zoom: zoom
							}
					);
				log( "pong_map", " Map Done!!!" );
		
			}	
		}, 
		500 // timer interval 
	); 		

}
		
/** update data call back hook */
function pong_map_Update( divId, pmd ) {
	log( "pong_map", "pong_map_Update start (divId: "+divId+"): "+JSON.stringify( pmd ) );

	if ( pmd == null ) {
		log( "pong_map", "pong_map_Update OUCH! param==null -> end.");
		return;
	}
	if ( pong_map_dta == null  ) {
		log( "pong_map", "pong_map_Update OUCH! pong_map_dta == null -> end." );	
		return;
	} else {
		log( "pong_map", "pong_map_Update map ok! " );
	}
	
	// search mode:
	if ( pmd.search != null ) {
		pong_map_addSearchPin ( pmd.search, pmd.label, true );		
	}
	
	if ( pmd.routeTo != null && pong_map_route.length > 0 ) {
		
		log( "pong_map", "pong_map_Update route to: '"+pong_map_route[ pong_map_route.length-1 ]+"' > '"+pmd.routeTo+"' " );		        
		pong_map_addSearchPin ( pmd.routeTo, pmd.label, false );
		pong_map_addRoute (  pong_map_route[ pong_map_route.length-1 ], pmd.routeTo );
        pong_map_route.push( pmd.routeTo );	
		log( "pong_map", "pong_map_Update route to done. "+JSON.stringify( pong_map_route )  );
		
	} else 
		log( "pong_map", "pong_map_Update routeTo == null " );		
	
	if ( pmd.clearRoute != null ) {
		log( "pong_map", "pong_map_Update clearRoute" );		
		pong_map_route = [];
	}
	
	// other modes required? e.g. reverse geocoding or route
	
	log( "pong_map", "pong_map_Update end.");
}

function pong_map_addRoute ( a, b ) {
    dir = MQ.routing.directions();
    dir.route( { locations: [ a, b ] } );
    pong_map_dta.addLayer(
    	MQ.routing.routeLayer( { directions: dir, fitBounds: true } )
    );
}

function pong_map_addSearchPin ( search, label, setView ) {
	log( "pong_map", "pong_map_Update searching: '"+search+"' " );		
	MQ.geocode(  ).search( search )
		.on( 'success', 
			function( e ) {	
				var best = e.result.best,
				    latlng = best.latlng;
				log( "pong_map", "pong_map_Update best result: "+latlng );		
				
				if ( setView ) {
					pong_map_dta.setView( latlng, 12 );					
					}
				pong_map_route.push( search );
				 
				log( "pong_map", "pong_map_Update best set marker " );
				if ( label != null ) {
					L.marker( [ latlng.lat, latlng.lng ] ).addTo( pong_map_dta ).bindPopup( label ).openPopup();							
				} else {
				    L.marker( [ latlng.lat, latlng.lng ] ).addTo( pong_map_dta );			
				}
				log( "pong_map", "pong_map_Update best result done. " );		
			}
		);		
	log( "pong_map", "pong_map_Update geocode done. " );		
}

