This module adds a search field to the header of the page.

The search will send the parameter to a list of views on a target page.

## Usage in "structure"

	 { 
	 	"layout": {
	      ...
	      "header": {
	        ...
	        "modules" : [ 
	           { 
	              "id":"Search", 
	              "type": "pong-search", 
	              "page": "searchpage",
	              "update": ["MyTable","MyMap"]
	            },
	           ...
	        ]
	      }
	      ...
