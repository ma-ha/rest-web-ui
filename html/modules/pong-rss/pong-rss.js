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

// print this on console, when module is loaded:
log( "PongRss", "load module") 

var rssData = {}
var rssCounter = {}
var rssTimer = {}

// ======= Code for "loadResourcesHtml" hook ================================================
function pongRss_DivHTML( divId, resourceURL, paramObj ) {
	log( "PongRss",  "divId="+divId+" resourceURL="+resourceURL );
	rssData[divId] = []
	rssCounter[divId] = 0
	if ( moduleConfig[ divId ] != null ) {
		pongRss_RenderHTML( divId, resourceURL, paramObj, moduleConfig[ divId ]  )
	} else {
		$.getJSON( 
			resourceURL+"/PongRss", 
			function( pmd ) {
			  moduleConfig[ divId ] = pmd
				pongRss_RenderHTML( divId, resourceURL, paramObj, pmd )
			}
		);					
	}	
}
function pongRss_RenderHTML( divId, resourceURL, paramObj, pmd ) {
	log( "PongRss", "start "+JSON.stringify(pmd) ) 
	var contentItems = []
	contentItems.push( '<div id="'+divId+'PongRss_Div" class="PongRss">' )	
	contentItems.push( '</div>' )
	if ( pmd.pollDataSec ) {
    var t = parseInt( pmd.pollDataSec );
    contentItems.push( '<script>' );
    contentItems.push( '  function  pongRss_UpdateTimer'+divId+'() { ' );
    if  ( ! isNaN( t ) ) {  
      contentItems.push( '    pongRss_UpdateData( "'+divId+'", '+JSON.stringify( paramObj.get )+' ); ' );
    }
    contentItems.push( '  }' );
    contentItems.push( '</script>' );
	}
	// output
	$( "#"+divId ).html( contentItems.join( "\n" ) )
	
	// do it:
  log( "PongRss", "Call update" ) 
	pongRss_UpdateData( divId, paramObj )

	
  if ( pmd.pollDataSec ) {
    log( "PongRss", "Start update timer" ) 
    rssTimer[divId] = setInterval( "pongRss_UpdateTimer"+divId+"()", t*1000 );
  }
	log( "PongRss", "end.")
}



/** update data call back hook */
function pongRss_UpdateData( divId, paramsObj ) {
  log( "PongRss", "pongRss_UpdateData ");
  
  var pmd = moduleConfig[ divId ] 
  if ( pmd.rssURLs ) {
    rssData[divId] = []

    for ( var i=0; i < pmd.rssURLs.length; i++  ) {
      log( "PongRss", pmd.rssURLs[i].url ) 
      rssCounter[divId]++

      $.ajax({
            type: 'GET',
            url: pmd.rssURLs[i].url,
            crossDomain: true,
            crossOrigin: true,
            cache: false,
            success: 
              function( rssXML  ) {
                if( $.trim( rssXML ) == "false" ) {
                  alert("Fail to recived data");
                }
                else {
                  pongRss_print( divId, rssXML )
                }  
              }
      }).always( 
        function() {
          rssCounter[divId]--
          log( "PongRss", "rssCounter[divId]="+rssCounter[divId])
          if ( rssCounter[divId] == 0 ) {
            pongRss_rssToHTML( divId ) 
          }
        }
      )
    }    
  }
  
  log( "PongRss", "pongRss_UpdateData end.");
}


function pongRss_rssToHTML( divId ) {
  log( "PongRss", 'pongRss_rssToHTML start...');
  rssData[divId].sort( pongRss_CmpFields )
  log( "PongRss", 'sorted');
  var ci = []
  ci.push( '<ul>' )
  for ( var i = 0; i < rssData[divId].length; i++ ) {
    ci.push( rssData[divId][i].li )
//    log( "PongRss", rssData[divId][i].li );

  }
  ci.push( '</ul>' )
  $( '#'+divId+'PongRss_Div' ).html( ci.join( "\n" ) )
  log( "PongRss", "pongRss_rssToHTML end.");
}


function pongRss_print( divId, rssXML ) {
  log( "PongRss", 'print: ')
  //alert( rssXML )
  var rss = xml2json( rssXML ) 
  log( "PongRss", "print xml2json done");
  var items = null
  var rssName = ''
  log( "PongRss", JSON.stringify(rss) )
  if ( rss && rss.rss && rss.rss.channel ) {
    log( "PongRss", "print RSS")
    rssName = $.i18n( rss.rss.channel.title )
    items = rss.rss.channel.item 
  } else if ( rss && rss['rdf:RDF'] && rss['rdf:RDF'].channel ){
    log( "PongRss", "print RDF ")
    rssName = $.i18n( rss['rdf:RDF'].channel.title )
    items = rss['rdf:RDF'].item
  } else if ( rss && rss.feed ){
    log( "PongRss", "print RDF ")
    rssName = $.i18n( rss.feed.title )
    items = rss.feed.entry
  } 
  if ( items ) {
    log( "PongRss", "ch ");
    log( "PongRss", "#"+items.length )
    for ( var j = 0; j < items.length; j++ ) {
      //log( "PongRss", "print item "+j)
     
      var date = 'Invalid Date'
      if (items[j].pubDate   ) { date = new Date( items[j].pubDate ) }
      if (items[j].published ) { date = new Date( items[j].published ) }
      var fDate = ''
      if ( date != 'Invalid Date' ) { 
        //log( "PongRss", "print date "+date )
        var dH = date.getHours() < 10   ? '0'+date.getHours()   : date.getHours()
        var dM = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()
        fDate = $.datepicker.formatDate( $.i18n( 'yy-mm-dd' ), date ) + ' '+ dH+':'+dM +': '          
      } else { date = new Date() }
      //log( "PongRss", "print line ");
      
      var rssLine = 
        '<li><span class="rss-date">' + fDate 
          + '</span> <a href="'+( items[j].link == '' ? items[j].id : items[j].link )
          + '" class="ui-icon ui-icon-extlink rss-link" target="_blank"></a> '
          + items[j].title+' <span class="rss-title">('+rssName +')</span></li>'    
          
      //log( "PongRss", "print li ");

      rssData[divId].push( { date:date, li:rssLine } )
      //log( "PongRss", "print done ");
    }      
  }
  log( "PongRss", "print end.");
}

	
// wow, thanks: http://stackoverflow.com/questions/1773550/convert-xml-to-json-and-back-using-javascript
//  xml2json( Jquery(this).find('content').eq(0)[0] )
function xml2json( xml ) {
  try {
    var obj = {};
    if ( xml.children.length > 0 ) {
      for ( var i = 0; i < xml.children.length; i++ ) {
        var item = xml.children.item( i )
        var nodeName = item.nodeName

        if ( typeof (obj[nodeName]) == "undefined" ) {
          obj[nodeName] = xml2json( item )
        } else {
          if ( typeof (obj[nodeName].push) == "undefined" ) {
            var old = obj[nodeName]

            obj[nodeName] = []
            obj[nodeName].push( old )
          }
          obj[nodeName].push( xml2json( item ) )
        }
      }
    } else {
      obj = xml.textContent
    }
    return obj
  } catch ( e ) {
    log( "PongRss", e.message )
  }
}

function pongRss_CmpFields( a, b ) {
  if ( a.date > b.date  ) {
    return -1 
  } else {
    return 1
  }
}