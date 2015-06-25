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
log( "PoNG-I18N", "Loading Module");

function addI18NHeaderHtml( divId, type , params ) {
	log( "PoNG-I18N", "start addNavBarHeaderHtml "+divId);
	var layout = '';
	if ( getParam( 'layout' ) != '' ) {
		layout = "&layout=" + getParam( 'layout' );	
	}	
	var role = '';
	if ( userRole != '' ) {
		role = "&role=" + getParam( 'role' );	
	}	

	if ( params != null && params.langList != null ) {
		log( "PoNG-I18N", "add languages");
		var divHtml = [];		
		for ( var i=0; i < params.langList.length; i++ ) {
			var lang = params.langList[i]; 
			log( "PoNG-I18N", "add "+lang );
			
			var actClass = '';
			if ( pageInfo["lang"] == lang ) {
				actClass = 'i18nItemActive';
			}
			divHtml.push( '<div class="i18nItem '+actClass+'">' );
			if ( mode == 'php' ) {
				if ( params != null && params.get != null ) { // else makes no sense
					divHtml.push( '<a href="show.php?lang='+lang+layout+role+'" class="transferSessionLink">'+
							'<img src="img/i18n/png/'+lang.toLowerCase()+'.png"'
							+' alt="'+lang+'" title="'+ $.i18n( 'Switch to' ) +' '+lang+'" border="0"></a>' );
				}
			} else {
				divHtml.push( '<a href="index.html?lang='+lang+layout+role+'" class="transferSessionLink">'+
						'<img src="img/i18n/png/'+lang.toLowerCase()+'.png"'
						+' alt="'+lang+'" title="'+ $.i18n( 'Switch to' ) +' '+lang+'" border="0"></a>' );				
			}
			divHtml.push( '</div>' );
			
		}

		$( "#"+divId ).html( divHtml.join( "\n" ) );
		//log( "PoNG-I18N", "done "+divHtml.join( "\n" ));	
	} 
}