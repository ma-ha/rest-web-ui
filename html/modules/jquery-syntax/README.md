## Description
This is not a view module, but it can be used in any other module.

This module is baed on [jquery-syntax](https://github.com/ioquatix/jquery-syntax).

## Usage
Mark this module as required in the module map:

	moduleMap[ "myModule" ] = {
		"requires": [ "jquery-syntax" ],
		...
	}

Example usage in JS code (high level function):

	...
 	$( '#myView' ).html( '<div id="myCodeBlock"></div>' );
 	jQuerySyntaxInsertCode( 'myCodeBlock', javaCode, 'java', { theme: 'modern', blockLayout: 'fixed' }  );
	...

Example usage in JS code (native):

	function myModuleInit () {
		...
	    $( "#myDialog" ).html( 
	    	'<div class="syntax-div">' +
	    	  '<pre class="syntax brush-yaml">' +
	    	    theCode +
	    	  '</pre>'+
	    	'</div>' );
		jQuery.syntax( { theme: 'modern', blockLayout: 'fixed' } );
		...
	}