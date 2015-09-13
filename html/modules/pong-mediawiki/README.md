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
	        "type" : "pong-mediawiki",
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

## i18n Support
The language is passed in the REST API call as uselang parameter.

However, in Wikipedia the language code is part of the URL, so you can use a placeholder <code>${lang}</code> in the <code>ressourceURL</code> to direct to the Wikipedia instance set by the i18n header module.

Since the page can also vary with the language (e.g. "Hauptseite", "Main page", ...) the page param can configured as object with attributes.

## Full Working Example
                   
	{
	    "layout": {
	        "title": "Wikipedia",
	        "descr": "Wikipedia Main Page",
	        "page_width": "990",
	        "header": {
	            "logoText": "WIKI Demo",
	            "modules": [
	                {
	                    "type": "i18n",
	                    "param": {
	                        "langList": [ "EN", "DE" ]
	                    }
	                }
	            ]
	        },
	        "rows": [
	            {
	                "rowId": "WikiDemo",
	                "height": "700px",
	                "resourceURL": "http://${lang}.wikipedia.org/w/",
	                "title": "Wikipedia per REST API",
	                "moduleConfig": {
	                    "page": {
	                        "EN": "Main_Page",
	                        "DE": "Wikipedia:Hauptseite",
	                        "IT": "Pagina_principale"
	                    },
	                    "wikiRef": "/wiki/",
	                    "wikiImg": "images/"
	                },
	                "type": "pong-mediawiki",
	                "decor": "decor"
	            }
	        ],
	        "footer": {
	            "copyrightText": "... by PoNG"
	        }
	    }
	}