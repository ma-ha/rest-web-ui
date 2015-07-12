This module enables the transfer of a sessioInfo object for navigation links and i18n switches. 

## Usage in "structure"

	 { 
	 	"layout": {
	      ...
	      "header": {
	        ...
	        "modules" : [ 
	           { "id":"PongSession", "type": "pong-session" },
	           ...
	        ]
	      }
	      ...

## Use in other modules 
simly add the ''transferSessionLink'' class to the anchor, e.g.

	<a href="..." class="transferSessionLink">link</a>
