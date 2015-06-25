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
log( "Modal-Form", "Loading Module");

function modalFormAddActionBtn( id, modalName, resourceURL ) {
	log( "Modal-Form", "modalFormAddActionBtn "+id);
	//var action = res.actions[x];
	var html = "";
	log( "Modal-Form", "Std Config Dlg:  " + modalName );
	var icon = "ui-icon-gear";
	var jscall = "$( \"#"+id+modalName+"Dialog\" ).dialog( \"open\" );";
	var width  = "650";
	var height = "500"; 
	html += "<div id=\""+id+modalName+"Dialog\">"+ resourceURL +" "+ modalName+"</div>";
	html += "<script> $(function() { $(  "+
		"\"#"+id+modalName+"Dialog\" ).dialog( { autoOpen: false, height: "+height+", width: "+width+" , modal: true, "+ // TODO: Refresh resource
		" buttons: { \"OK\": function() { "+id+modalName+"FormSubmit(); $( this ).dialog( \"close\" );  },"+
		" Cancel: function() { $( this ).dialog( \"close\" ); } } }); "+
		"});</script>";			
	html += "<button id=\""+id+modalName+"Bt\">"+modalName+"</button>";
	html += "<script>  $(function() { $( \"#"+id+modalName+"Bt\" ).button( { icons:{primary: \""+icon+"\"}, text: false } ).click( "+
		"function() { "+jscall+" }); }); </script>";		
	return html;
}


function modalFormCreModalFromMeta( id, modalName, resourceURL ) {
	log( "Modal-Form", "Gen Form: "+resourceURL+"  "+modalName );
	$.getJSON( resourceURL+"/modal/"+modalName+"/meta", 
		function( d ) {
			// crunch form
			var contentItems = [];
			contentItems.push( "<form id=\""+id+modalName+"Form\" action=\""+resourceURL+"/modal/"+modalName+"/\" method=\"post\"><fieldset>" );
			postLst = [];
			if ( d.propertiesList != null )
			for( var y = 0; y < d.propertiesList.length; y++ ) {
				prop = d.propertiesList[y];
				contentItems.push( "<label for=\""+id+prop.name+"\">"+prop.label+"</label><br/>" );
				var nameAndClass = "name=\""+prop.name+"\" id=\""+id+prop.name+"\" class=\"text ui-widget-content ui-corner-all\"";
				postLst.push( prop.name+": $( '#"+id+prop.name+"' ).val()" );
				if ( prop.type == null ) {
					contentItems.push( "<input type=\"text\" "+nameAndClass+"/><br/>" );
				} else if ( prop.type == "textarea" ) {
					var cols = "50";
					var rows = "5";
					if ( prop.cols != null ) { cols = prop.cols }
					if ( prop.rows != null ) { rows = prop.rows }
					contentItems.push( "<textarea cols=\""+cols+"\" rows=\""+rows+"\" "+nameAndClass+"/><br/>" );
					getTextFromRes( resourceURL+"/modal/"+modalName, prop.name , id+prop.name ); 
				} else if ( prop.type == "int" ) {
					contentItems.push( "<input type=\"text\" "+nameAndClass+"/><br/>" );
					getValueFromRes( resourceURL+"/modal/"+modalName, prop.name , id+prop.name ); 
				} else if ( prop.type == "password" ) {
					contentItems.push( "<input type=\"password\" "+nameAndClass+"/><br/>" );
					getValueFromRes( resourceURL+"/modal/"+modalName, prop.name , id+prop.name ); 
				} else {
					contentItems.push( "<input type=\"text\" "+nameAndClass+"/><br/>" );
					getValueFromRes( resourceURL+"/modal/"+modalName, prop.name , id+prop.name ); 
				}
				
			}
			contentItems.push( "</fieldset></form>" );
			contentItems.push( "<script>" );
			contentItems.push( "function "+id+modalName+"FormSubmit() { " );
			contentItems.push( "  $.post( \""+resourceURL+"/modal/"+modalName+"/\", { "+postLst.join( " , " )+" } ); }" );
			contentItems.push( "</script>" );
			$(  "#"+id+modalName+"Dialog" ).html( contentItems.join( "" ) );
		}
	).always(
		function() {
			// ???
		}
	);
}