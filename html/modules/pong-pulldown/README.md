## Description (This is in concept phase)
This module is a uses header hook to add a pull down menu. 

## Usage in "structure" 
Simply add a action to the <code>actions</code> array with <code>"type": "modal-form"</code>

Example [[PoNG Structure Specification|structure file]] extract:

	{
	   "layout": {
	      ...
	      "header": [
	      {
	         ...
	         "modules" : [ { "id": "PMenu", '''"type": "pong-pulldown", "param": { "confURL":"nav" }''' } ] 
	      },
	      ...
	    ],
	    ...
	}

## Configuration 
The <code>confURL</code> should be like this example:

	{
	    "menuItems" : [
	       { ... },
	       { ... }
	    }
	}


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
	               "type": "pong-navbar", 
	               "moduleConfig": {
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
