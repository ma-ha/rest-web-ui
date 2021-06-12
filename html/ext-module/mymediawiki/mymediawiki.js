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
log( "My-MediaWiki", "load module");
var pMwList = [];


function mymediawiki_loadResourcesHtml( divId, wikiURL, fparam ) {
  log( "mymediawiki",  "divId="+divId+" resourceURL="+wikiURL );
  //console.log( 'wikiURL: '+wikiURL)
  var url = wikiURL+"api.php?action=parse&format=json&callback=?";

  var param = {};
  
  if ( fparam != null && fparam.page != null  && fparam.wikiRef != null  && fparam.wikiImg != null ) {
    param = fparam;
  } else   if  ( moduleConfig[ divId ] != null ) {
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
  if ( moduleConfig[ divId ].noImgClick ) {
    param.noImgClick = moduleConfig[ divId ].noImgClick;      
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
  log( "mymediawiki",  "url="+url);

  
  if ( param != null && param.page != null  && param.wikiRef != null  ) {
    
    var startPage = "Main_Page";
    if ( fparam && fparam.get && fparam.get.page ) {
      //console.log( fparam.get.page +' > '+ decodeURIComponent( fparam.get.page )  );
      startPage = decodeURIComponent( fparam.get.page ); // using jquery
    } else if ( typeof param.page === 'string' ) {
      //console.log( param.page +' > '+ decodeURIComponent( param.page )  );
      startPage = decodeURIComponent( param.page );
      log( "mymediawiki",  "string startPage="+startPage);
    } else {
      if ( param.page['EN'] != null ) {
        startPage = param.page['EN'];  
      }
      if ( param.page[ lang ] != null ) {
        startPage = param.page[ lang ];  
        log( "mymediawiki",  "startPage["+lang+"]="+startPage);
      }
    }
    mymediawiki_SetTitle( divId, startPage );

    $.getJSON(
      url, 
      { 
        page: startPage,
        //limit:1,
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
        mymediawiki_SetTitle( divId, data['parse']['title'] );
        html.push( '</p><hr/>' );
        html.push( data['parse']['text']['*'] );
        html.push( '<script>' );
        html.push( '$( "#'+divId+' a" ).click( ' );
        html.push( '  function( ) { ' ); 
        if ( param.noImgClick ) {
          html.push( '     if ( $(this).attr("class") == "image" ) {' ); 
          html.push( '         return false;' ); 
          html.push( '     } ' ); 
        } else {
          html.push( '     if ( $(this).attr("class") == "image" ) {' ); 
          html.push( '         var page = $(this).find("img").attr("src"); ');
          html.push( '         if ( page.indexOf("/thumb","") > 0 ) { ');
          html.push( '           var page = page.replace("/thumb",""); ');
          html.push( '           var page = page.substr( 0, page.lastIndexOf("/") ); ');
          html.push( '           }' );
          html.push( '         window.open( page, "_blank");' ); 
          html.push( '         console.log(page); return false;  }' );   
        }
        html.push( '     if ( $(this).attr("href").substring( 0, "'+param.wikiRef+'".length ) == "'+param.wikiRef+'" ) {' ); 
        //html.push( '         //alert ( $(this).attr("href") + "  "+ $(this).attr("href").substring( "'+param.wikiRef+'".length  ) );' );
        html.push( '         var page = $(this).attr("href").substring( "'+param.wikiRef+'".length  );' );
        html.push( '         pongMediaWikiDivHTML( "'+divId+'", "'+wikiURL+'", { "page":page, "wikiRef":"'+param.wikiRef+'", "wikiImg":"'+param.wikiImg+'" } );' );
        html.push( '         return false; ' );
        html.push( '     }' );
        html.push( '  } ' );
        html.push( ');' );
        html.push( '</script>' );
        $( '#'+divId ).html( html.join( "\n" ) );
        $( '#'+divId ).scrollTop( 0 );
       
        if ( param.wikiImg  &&  param.wikiImg !== 'undefined' ) {
          $( '#'+divId+' img' ).each( 
            function() {
              var imgURL = wikiURL.replace( '${lang}', lang ) + 'images/' + $(this).attr('src').substring( param.wikiImg.length );
              //console.log( 'loaf IMG '+imgURL )
              $(this).attr( 'src', imgURL );
              $(this).removeAttr( 'srcset' );
            }
          );
        }
      }
    );
  }
}    

function mymediawiki_SetTitle( divId, pageName ) {
  // console.log( viewsMap[ divId ] );
  let viewTitel = viewsMap[ divId ].title;
  if ( viewTitel ) {
    // console.log( 'viewTitel '+pageName );
    viewTitel = viewTitel.replace( '${page}', pageName ).replace( /_/g , ' ');
    // console.log( 'viewTitel '+viewTitel );
    let titleId = '#' + divId.replace( 'Content', '' ) + 'Title';
    $( titleId ).html( viewTitel )
  }
}

function mymediawiki_update( divId, paramsObj ) {
}

function mymediawiki_setData( id, modalName, resourceURL, paramObj ) {
}

function mymediawiki_CreModal( id, modalName, resourceURL, paramObj  ) {
}


function mymediawiki_addActionBtn() {

}
function mymediawiki_init() {

}

/*
- init
- loadResourcesHtml
- addActionBtn
- afterPageLoad
- creModal
- update
- setData

- addHeaderHtml
- addFooterHtml
*/