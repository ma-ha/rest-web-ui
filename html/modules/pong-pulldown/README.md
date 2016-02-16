## Description (This is in concept phase)
This module is a uses header hook to add a pull down menu. It cleans up the header by hiding prio 2 functionality. 

You can use this module multiple times in the header, e.g. for "menu" and "user settings".

## Usage in "structure" 
Simply add a action to the <code>actions</code> array with <code>"type": "modal-form"</code>

Example [[PoNG Structure Specification|structure file]] extract:

	{
	   "layout": {
	      ...
	      "header": [
	      {
	         ...
	         "modules" : [ { "id": "PMenu", "type": "pong-pulldown", "param": { "confURL":"menu" } } ] 
	      },
	      ...
	    ],
	    ...
	}

## Configuration 
A HTTP GET request to <code>confURL</code> should return something like this:

	{
		"title": "Menu",
	    "menuItems" : [
	       { "html":"<b>Menu:</b>" },
	       { "pageLink":"mainPage", "label":"Home" },
	       { "html":"<a href=\"help.html\" target=\"_blank\">help</a>" }
	    ]
	}

### menuItems
"menuItems" can be:
* "html" 
* "pageLink"

## Usage with embedded configuration 
Example:

	{
	  "layout": {
	     ...
	     "header": [
	     {
	        ...
	        "modules" : [ 
	            {  
	               "id": "MainNav", 
	               "type": "pong-pulldown", 
	               "moduleConfig": {
						"title": "Menu",
	                     "menuItems": [
						       { ... },
						       { ... }
	                     ]
	                }
	            } 
	        ] 
	     },
	     ...
	   ],
	   ...
	}
