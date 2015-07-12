## Description
This module is a uses header hook to add a navigation DIV. 
The whole page is reloaded and the layout structure can be switched to a different one. 

This module uses the "layout" control feature of PoNG. So if you utilize the GET parameter "layout" the value  will be used to 
determine the layout definition, so if you load <code><nowiki>http://mysite.xyz/basedir/index.html?layout=XYZ</nowiki> the structure JSON is get from <code><nowiki>http://mysite.xyz/basedir/svc/layout/XYZ/structure</nowiki></code>

## Usage in "structure" 
Simply add a action to the <code>actions</code> array with <code>"type": "modal-form"</code>

Example [[PoNG Structure Specification|structure file]] extract:

	{
	   "layout": {
	      ...
	      "header": [
	      {
	         ...
	         "modules" : [ { "id": "MainNav", '''"type": "pong-navbar", "param": { "confURL":"nav" }''' } ] 
	      },
	      ...
	    ],
	    ...
	}

## Configuration 
The <code>confURL</code> should be like this example:

	{
	    "navigations" : [
	       { "layout":"main", "label":"Main"  },
	       { "layout":"crm", "label":"CRM"  }
	    }
	}

You can use <code>page_name</code> alternatively to identify pages for tabs -- if page_mode is set to php.

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
	                     "navigations": [
	                            {
	                                "layout": "123",
	                                "page_name": "ORLpAl",
	                                "label": "Tab1"
	                            },
	                            {
	                                "layout": "124",
	                                "page_name": "1fRK2h",
	                                "label": "tab2"
	                            }
	                     ]
	                }
	            } 
	        ] 
	     },
	     ...
	   ],
	   ...
	}

## Example result 
Generated HTML is:

	 <html>
	 <head>...</head>
	 <body>
	    <div id="maindiv" class="page-width">
	    <div id="header">
	                ...
	      <div id="MainNav" class="pong-navbar">
	        <div class="pongNavBarItem pongNavBarItemActive">
	            <a href="index.html?layout=main">
	                Main
	            </a>
	        </div>
	        <div class="pongNavBarItem">
	            <a href="index.html?layout=crm">
	                CRM
	            </a>
	        </div>
	     </div>
	     ...
