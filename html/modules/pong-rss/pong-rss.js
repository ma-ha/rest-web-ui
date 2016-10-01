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

// print this on console, when module is loaded:
log( "PongRss", "load module") 

// ======= Code for "loadResourcesHtml" hook ================================================
function pongRss_DivHTML( divId, resourceURL, paramObj ) {
	log( "PongRss",  "divId="+divId+" resourceURL="+resourceURL );
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
	// output
	$( "#"+divId ).html( contentItems.join( "\n" ) )
	
	 if ( pmd.rssURLs ) {
    for ( var i = 0; i < pmd.rssURLs.length; i++ ) {

      $.ajax({
            type: 'GET',
            url: pmd.rssURLs[i],
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
          })
    }    
  }

	log( "PongRss", "end.")
}

function pongRss_print( divId, rssXML ) {
  log( "PongRss", "print ");
  
  var ci = []
  var rss = xml2json( rssXML ) 
  log( "PongRss", "print xml2json done");
  if ( rss.rss && rss.rss.channel ) {
    log( "PongRss", "print ch");
    var ch = rss.rss.channel
    ci.push( '<h2>'+ch.title+'</h2>' )
    ci.push( '<ul>' )
    for ( var j = 0; j < ch.item.length; j++ ) {
      log( "PongRss", "print item "+j);
      
      var date = new Date( ch.item[j].pubDate )
      var fDate = $.datepicker.formatDate( $.i18n( 'yy-mm-dd' ), date ) + ' '+date.getHours()+':'+date.getMinutes()
      log( "PongRss", "print date ");
      ci.push( '<li>'
          + fDate
          + ': <a href="'+ch.item[j].link
          + '" class="ui-icon ui-icon-extlink" target="_blank"></a> '
          + ch.item[j].title+'</li>' )        
    }
    ci.push( '</ul>' )
  }

  $( '#'+divId+'PongRss_Div' ).html( ci.join( "\n" ) )

  log( "PongRss", "print end.");
}

	

/** update data call back hook */
function pongRss_UpdateData( divId, paramsObj ) {
	log( "PongRss", "start '"+pmd.description+"'");
	
	
	log( "PongRss", "end.");
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
