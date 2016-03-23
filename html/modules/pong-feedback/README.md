# Feedback for User
The idea is to give a user orientation what happens behind the 
intransparent AJAX lifecycle.

User my be notified, if data is successfully loaded, if a row is saved 
successfully or in an case of an error,  how the user can react. 
It is less than twittering, because the messages should be as short as 
possible, because the user should only get something like a pulse.

## Technique behind the scenes
The main framework provides a lightweight pub-sub inside each web page.
Views and modules of the page can communicate between each other by
publishing events and consuming subscribed events. 

The "feedback" events can be send by any module (code) running in the page.
This _pong-feedback_ view is a simple but effective way to show the 
information in the footer of the page.

If no feedback module is configured, the events are stored, but ignored.

## Usage
Example (extract of _demo-feedback_

```javascript
{
	"layout":{
		...
		"rows":[
			{
				"rowId":"r1",
				"type":"pong-easytable",
				...
				"moduleConfig":{
					...
				}
			}
		],
	    "footer": {
	      ...
	      "modules" : [ 
      		{ "id": "myFeedbackView", "type": "pong-feedback" }
      	  ]
	    }
	}
}
```