## Description
This module shows MediaWiki content in your portal. 

## Usage in "structure" 
Simply add a action to the <code>type</code> array with <code>"type": "pong-mediawiki"</code>

Example structure file extract:

	{
	   "layout": {
	      ...
	      "rows": [
	      {
	        "rowId": "bla",
	        '''"type" : "pong-mediawiki",'''
	        "resourceURL": "http://mh-svr.de/mw/",        
	        "resourceParam": { "page": "PoNG", "wikiRef":"/mw/index.php/", "wikiImg":"/mw/images/" },
	        ...
	      },
	      ...
	    ],
	    ...
	}

Since the REST API of the MediaWiki is used, there is no meta description file to be loaded. 

So all the definition for this view have to be provided in the layout structure file in the field <code>resourceParam</code>. 
You have to provide the fields:
* <code>page</code>: The initial page to be displayed.
* <code>wikiRef</code>: WIKI internal href start with this string.
* <code>wikiImg</code>: WIKI internal image src start with this string.
