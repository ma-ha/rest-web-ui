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
log( "PoNG-NavBar", "Loading Module");
var act = pageInfo[ 'layout' ];

function addNavBarHeaderHtml( divId, type , params ) {
	log( "PoNG-NavBar", "start addNavBarHeaderHtml");
	if ( act == null ) { act = ''; }
	
	if  ( moduleConfig[ divId ] != null ) {
		addNavBarHeaderRenderHtml( divId, type , params, moduleConfig[ divId ] );		
	} else {
		if ( params != null && params.confURL != null ) {
			log( "PoNG-NavBar",  "Load "+params.confURL  );
			$.getJSON( 
				params.confURL, 
				function ( nb ) {
				  moduleConfig[ divId ] = nb
				  addNavBarHeaderRenderHtml( divId, type , params, nb );
                  log( "PoNG-NavBar", ">>>>> start pongNavBarUpdateTimer"+divId+"() once per minute" );
		          setInterval( "pongNavBarUpdateTimer"+divId+"()", 60000 );
				}
			);
		} 		
	}
}

function addNavBarHeaderRenderHtml( divId, type , params, nb ) {
	log( "PoNG-NavBar", "add content " + JSON.stringify(nb) );
	var html = [];		
	var lang = '';
	if ( getParam( 'lang' ) != '' ) {
		lang = "&lang=" + getParam( 'lang' );	
	}	
	var role = '';
	if ( userRole != '' ) {
		role = "&role=" + getParam( 'role' );	
	}	
	for ( var i=0; i < nb.navigations.length; i++ ) {
		var showNav = true;
		var id = null
		if ( nb.navigations[i].id ) {
		  id = nb.navigations[i].id
		} else if ( nb.navigations[i].layout ) {
		  id = nb.navigations[i].layout.replace(/\//g, '');
		} else { id = i }
		if ( nb.navigations[i].userRoles != null ) {
			showNav = false;
			for ( var r = 0; r < nb.navigations[i].userRoles.length; r++ ) {
				if ( nb.navigations[i].userRoles[r] == userRole ) {
					 showNav = true;
				}
			}
		}
		if ( showNav ) {
			log( "PoNG-NavBar", "add "+i );
			
			// normal navigation tab
			var actClass = '';
			if ( nb.navigations[i].page_name == act && mode == 'php' ){
				actClass = 'pongNavBarItemActive';				
			} else 	if ( act == nb.navigations[i].layout ) {
				actClass = 'pongNavBarItemActive';
			}
			html.push( '<div id="navTab'+id+'" class="pongNavBarItem '+actClass+'">' );
			html.push( '<div id="navTab'+id+'Info" class="pongNavBarItemInfo">'+ (nb.navigations[i].info ? $.i18n( nb.navigations[i].info ):'') +'</div>' ); 

			if ( nb.navigations[i].page_name != null && mode == 'php' ){
				html.push( '<a href="show.php?layout='+nb.navigations[i].page_name+lang+role+'">'+ $.i18n( nb.navigations[i].label )+'</a>' );	
			} else if ( nb.navigations[i].layout != null) {
				html.push( '<a href="index.html?layout='+nb.navigations[i].layout+lang+role+'">'+ $.i18n( nb.navigations[i].label )+'</a>' );					
			} 
			else {
				html.push( '<div class="pongNavBarPullDown" id="navItem'+i+'">'+ $.i18n( nb.navigations[i].label )+'</div>' );         			  
			}
			
			// submenu
			if ( nb.navigations[i].menuItems && nb.navigations[i].menuItems.length > 0) {
				log( "PoNG-NavBar", " submenu "+i );
				var subMenu = nb.navigations[i].menuItems;
				html.push( '<div id="navSubMenu'+i+'" class="pongNavBarPullDownMenu">' );
		        for ( var j = 0; j < subMenu.length; j++ ) {
  		          var idS = null
  		          if ( subMenu[j].id ) {
  		            idS = subMenu[j].id
  		          } else if ( subMenu[j].layout ) {
  		            idS = subMenu[j].layout.replace(/\//g, '');
  		          } else { idS = i+'-'+j }
		            html.push( '<div class="pongNavBarPullDownItem">' )
		            html.push( '<div id="navTab'+idS+'Info" class="pongNavBarItemInfo">'+ (subMenu[j].info ? $.i18n( subMenu[j].info ):'') +'</div>' ); 
					if ( subMenu[j].page_name != null && mode == 'php' ){
						html.push( '<a href="show.php?layout='+subMenu[j].page_name+lang+role+'">'+ $.i18n( subMenu[j].label )+'</a><br>' );  
					} else if (subMenu[j].layout != null) {
						html.push( '<a href="index.html?layout='+subMenu[j].layout+lang+role+'">'+ $.i18n( subMenu[j].label )+'</a><br>' );         
					} 
					else {
						html.push( '<span class="pongNavBarPullItem" id="navItem'+i+'">'+ $.i18n( subMenu[j].label )+'</span>' );                
					}
                    html.push( '</div>' )
				}
				html.push( '</div>' );        
				html.push( '<script>' );        
				html.push( '$( "#navItem'+i+'" ).click( function(){ $( "#navSubMenu'+i+'" ).toggle() } );' );        
				html.push( '</script>' );        

			}
			html.push( '</div>' );  			
		}
	}
	html.push( '<script>' );
	html.push( '  function pongNavBarUpdateTimer'+divId+'() { ' );
	html.push( '      pongNavBarUpdate( "'+divId+'", { confURL:"'+params.confURL+'" } ); ' );
	html.push( '  }' );
	html.push( '</script>' );

	$( "#"+divId ).html( html.join( "\n" ) );
}

function pongNavBarUpdate( divId, params ) {
  log( "PoNG-NavBar", "Update info "+JSON.stringify(params) )
  if ( ! moduleConfig[ divId ] ) return
  $.getJSON( 
      params.confURL, 
      function ( nb ) {
        moduleConfig[ divId ] = nb
        var nb = moduleConfig[ divId ]
        for ( var i=0; i < nb.navigations.length; i++ ) {
          var showNav = true;
          var id = null
          if ( nb.navigations[i].id ) {
            id = nb.navigations[i].id
          } else if ( nb.navigations[i].layout ) {
            id = nb.navigations[i].layout.replace(/\//g, '');
          } else { id = i }  
          $( '#navTab'+id+'Info' ).html( ( nb.navigations[i].info ? nb.navigations[i].info : '' ) )
        }
      }
  )   
}
