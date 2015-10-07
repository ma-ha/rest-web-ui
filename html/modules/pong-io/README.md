## IO Plug In Module Config
The IO plug-in can create a control panel.
On the underlying (optional) image you can arrage different
input and output controllers. Basic 'moduleConfig' is like this:

	"moduleConfig":{
		"imgURL":"svc/io/img.png",
		"dataURL":"svc/io/",
		"poll":"1000",
		"io":[
			...
		]
	}

To get the values a GET call is done to 'dataURL'. 
The response should be an "array" of the values:

	GET svc/io
	{
	    "switchMain": {
	        "value": "Power ON"
	    },
	    "led1": {
	        "value": "1"
	    },
	    "led2": {
	        "value": "-1"
	    }
	    ...
	}
	
Changes are POSTed to the 'dataURL' and the response wil be set as update.

### LEDs
The LED needs only a unique ID and coordinates where to place it.

	"moduleConfig":{ ...
		"io":[ ...
			{
				"id":"ledIdXY",
				"type":"LED",
				"pos":{ "x":"123", "y":"345" }
			}, ...			

LEDs values are:
* -1: red
* 0: black
* 1: green
* 2: yellow

### Switches
Switches can have 2 or 3 values, defined in a array.

	"moduleConfig":{ ...
		"io":[ ...
			{
				"id":"ledIdXY",
				"type":"Switch",
				"values":[ "ON", "OFF" ],
				"pos":{ "x":"123", "y":"345" }
			}, ...			

A switch by mouse click will do a POST with the id and value to to 'dataURL'.

### Display
Displays can display any text or value (like LCD):

	"moduleConfig":{ ...
		"io":[ ...
			{
				"id":"display1",
				"type":"Display",
				"width":"10",
				"pos":{ "x":"123", "y":"345" }
			}, ...			

### Poti
A poti is a horizontal slider:

	"moduleConfig":{ ...
		"io":[ ...
			{
				"id":"fader2",
				"type":"Poti",
				"width":"80", 
				"min":"0", 
				"max":"100",
				"pos":{ "x":"123", "y":"345" }
			}, ...			

A change of the poti by mouse click will do a POST request with the new vaue to the backend.


### TODOs
- Gauges
- Analog
- Graphs
