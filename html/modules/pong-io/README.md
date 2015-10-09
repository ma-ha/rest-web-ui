## IO Plug In Module Config
Use the IO plug-in to create a control panel.
On the underlying (optional) image you can arrange different
input and output controllers. Basic 'moduleConfig' is like this:

	"moduleConfig":{
		"imgURL":"svc/io/img.png",
		"dataURL":"svc/io/",
		"poll":"1000",
		"io":[
			...
		]
	}

[Online Demo](http://mh-svr.de/pong_v0.6.1/index.html?layout=demo_io)

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
	
Changes are POSTed to the 'dataURL' and the response will be set as update.

### LEDs
The LED needs only a unique ID and coordinates where to place it.

	"moduleConfig":{ ...
		"io":[ ...
			{
				"id":"ledIdXY",
				"type":"LED",
				"pos":{ "x":"123", "y":"345" }
			}, ...			

Optional settings:

 				"ledWidth":"4",
 				"ledHeight":"8"

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

Optional settings:

 				"font":"14px Courier",
 				"textFillColor":"#00F",
 				"textStrokeColor":"#FFF",
				"lineCol":"#00A",
				"fillCol":"#DDD"

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

Optional settings:

 				"font":"14px Courier",
 				"textFillColor":"#00F",
 				"textStrokeColor":"#FFF",
				"lineCol":"#00A",
				"fillCol":"#DDD"

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

Optional settings:

				"lineCol":"#00A",
				"fillCol":"#DDD"

A change of the poti by mouse click will do a POST request with the new value to the backend.

### Graph
Example config:

	"moduleConfig":{ ...
		{
			"id":"graphExample",
			"type":"Graph",
			"width":"200", "height":"150",
			"layout":{
				"name":"P[kPa]",
				"yAxis":{
					"axisType":"logarithmic",
					"min":"0.07",
					"max":"120",
					"labels":["0.1","1","10","100"]
				}
			},
			"pos":{ "x":"10", "y":"10" }
		}, ...

If there is no axisType defined it will be linear.

The graph expects data in following structure:

	"graphExample": [
        {
            "name": "chamber",
            "data": [
                [  0   , 80.000152587891 ],
                [  1.5 , 80.000076293945 ],
                ...
            ]
        }
    ]
    
The graph will render all values from xMin to xMax (if yAxis.min < y-value < yAxis.max). 

Hint: Add a form to tell the backend, if you want to get a limited value range.

### TODOs
- Gauges
- Analog
