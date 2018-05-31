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
log( "PoNG-MediaWiki", "load module");
var pMwList = [];


function pongMediaWikiDivHTML( divId, wikiURL, fparam ) {
	log( "PoNG-MediaWiki",  "divId="+divId+" resourceURL="+wikiURL );
	var url = wikiURL+"api.php?action=parse&format=json&callback=?";

	var param = {};
	
	if ( fparam != null && fparam.page != null  && fparam.wikiRef != null  && fparam.wikiImg != null ) {
		param = fparam;
	} else 	if  ( moduleConfig[ divId ] != null ) {
		if ( moduleConfig[ divId ].page != null ) {
			param.page = moduleConfig[ divId ].page;
		} 
		if ( moduleConfig[ divId ].wikiRef != null ) {
			param.wikiRef = moduleConfig[ divId ].wikiRef;
		}
		if ( moduleConfig[ divId ].wikiImg != null ) {
			param.wikiImg = moduleConfig[ divId ].wikiImg;			
		}
	
	} 

	if ( pMwList[divId] == null  ) {
		pMwList[divId] = [];  
		for ( var i = 0; i < 3; i++ ) { pMwList[divId][i] = ""; } 
	}
	var lang = getParam( 'lang' );
	if ( lang == '' ) {
		lang = "EN";
	}
	
	url = url.replace( '${lang}', lang );
	log( "PoNG-MediaWiki",  "url="+url);

	
	if ( param != null && param.page != null  && param.wikiRef != null  ) {
		
		var startPage = "Main_Page";
		if ( typeof param.page === 'string' ) {
			startPage = param.page;
			log( "PoNG-MediaWiki",  "string startPage="+startPage);
		} else {
			if ( param.page['EN'] != null ) {
				startPage = param.page['EN'];	
			}
			if ( param.page[ lang ] != null ) {
				startPage = param.page[ lang ];	
				log( "PoNG-MediaWiki",  "startPage["+lang+"]="+startPage);
			}
		}

		$.getJSON(
			url, 
			{ 
				page: startPage,
				limit:1,
				prop:"text|images",
				uselang: lang.toLowerCase()
			}, 
			function(data) {
				var html = [];
				html.push( '<p class="wiki-breadcrump" id="'+divId+'Top">' );
				for ( var i = 0; i < 3; i++ ) { 
					if ( pMwList[divId][i] != "" ) {
						html.push( '<a href="'+param.wikiRef+pMwList[divId][i]+'">'+pMwList[divId][i]+'</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' );			
					}
					if ( i < 2 ) {
						pMwList[divId][i] = pMwList[divId][i+1];
					}
				}
				pMwList[divId][2] = startPage; 
				html.push( '</p><hr/>' );
				html.push( data['parse']['text']['*'] );
				html.push( '<script>' );
				html.push( '$( "#'+divId+' a" ).click( ' );
				html.push( '  function( ) { ' ); 
				html.push( '     if ( $(this).attr("href").substring( 0, "'+param.wikiRef+'".length ) == "'+param.wikiRef+'" ) {' ); 
				html.push( '  	     //alert ( $(this).attr("href") + "  "+ $(this).attr("href").substring( "'+param.wikiRef+'".length  ) );' );
				html.push( '  	     var page = $(this).attr("href").substring( "'+param.wikiRef+'".length  );' );
				html.push( '         pongMediaWikiDivHTML( "'+divId+'", "'+wikiURL+'", { "page":page, "wikiRef":"'+param.wikiRef+'", "wikiImg":"'+param.wikiImg+'" } );' );
				html.push( '         return false; ' );
				html.push( '     }' );
				html.push( '  } ' );
				html.push( ');' );
				html.push( '</script>' );
				$( '#'+divId ).html( html.join( "\n" ) );
				$( '#'+divId ).scrollTop( 0 );
        if ( param.wikiImg ) {        
  				$( '#'+divId+' img' ).each( 
  					function() {
  						var imgURL = wikiURL + 'images/' + $(this).attr('src').substring( param.wikiImg.length );
  						$(this).attr( 'src', imgURL );
  					}
  				);
        }
			}
		);
	}
}		
