## IO Plug In Module Configuration
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

[Online Demo](http://mh-svr.de/pong_v0.6.2/index.html?layout=demo_io)

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


### Lights / LEDs
The Lights or LEDs needs only a unique ID and coordinates where to place it.

	"moduleConfig":{ ...
		"io":[ ...
			{
				"id":"ledIdXY",
				"type":"LED",
				"pos":{ "x":"123", "y":"345" }
			}, ...			

Alternate definition is:

			"type":"Light",

LEDs values are:
* -1: red
* 0: black
* 1: green
* 2: yellow
* and additionally these from "values" array

Optional settings:

 				"ledWidth":"4",
 				"ledHeight":"8",
 				"values": [
 					{ "value":"OK", "color":"#0F0" },
 					{ "value":"FAILED", "color":"#F00" },
 					...
 				],
 				"labels": [
 					{ "label":"XY"  },
 					{ "data":"value", "format":"%d B/s", "posX":"123", "posy":"345" },
 					...
 				]

Setting of posX and posY are optional. The values are absolute values to the view.

### Labels 

	"moduleConfig":{ ...
		"io":[ ...
			{
 				"labels": [
 					{ "label":"XY", "posX":"123", "posY":"345" },
 					{ "data":"result.probe[0].speed", "format":"%d B/s", "posX":"123", "posy":"345" },
 					...
 				]
 			...

### Switches
Switches can have 2 or 3 values, defined in a array.

	"moduleConfig":{ ...
		"io":[ ...
			{
				"id":"switchIdXY",
				"type":"Switch",
				"values":[ "ON", "OFF" ],
				"pos":{ "x":"123", "y":"345" }
			}, ...			

_Notice: It is intuitive and also convention to have "ON" up and "OFF" down. 
This will be done correctly by the order in the example above._

The first element in "values" array is the default switch setting at startup. Alternatively you can define a "defaultValue".

Optional settings (with example values):

 				"font":"14px Courier",
 				"textAlign":"center",
 				"textBaseline":"middle",
 				"textFillColor":"#00F",
 				"textStrokeColor":"#FFF",
				"lineCol":"#00A",
				"fillCol":"#DDD",
				"defaultValue":"OFF"

A switch by mouse click will do a POST with the id and value to to 'dataURL'.

### Button
A button sends only a button press event to the backend. 
The state can be indicated by a LED, if the values array defines a mapping into LED colors.

	"moduleConfig":{ ...
		"io":[ ...
			{
				"id":"buttonIdXY",
				"type":"Button",
				"label":"On/Off",
				"width":"50", "height":"25",
				"pos":{ "x":"70", "y":"17" },
				"values":[ 
					{"buttonState":"ON","led":"1"}, 
					{"buttonState":"OFF","led":"-1"} 
				]
			}, ...			

Optional settings:

 				"font":"14px Arial",
 				"textFillColor":"#00F",
 				"textStrokeColor":"#FFF",
				"lineCol":"#00A",
				"fillCol":"#DDD"
				
A "led" sub-structure may be defined as well. 

A button by mouse click will do a POST with the id to to 'dataURL'.

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
Example configuration:

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

Optional you can define colors and fonts:

	moduleConfig":{ ...
		{
			"id":"graphExample",
			"type":"Graph",
			"font":"8px Arial", 
			"textFillColor":"#00F",
			"lineCol":"#00A",
			"fillCol":"#DDD",
			"layout":{
				"colors":{ "data1":"#5A5", "data2":"#55A"},
				...
			
The graph expects data in following structure:

	"graphExample": [
        {
            "name": "data1",
            "data": [
                [  0   , 80.000152587891 ],
                [  1.5 , 80.000076293945 ],
                ...
            ]
        }
    ]
    
The graph will render all given values from xMin to xMax (if yAxis.min < y-value < yAxis.max). 

Hint: Add a form to tell the backend, if you want to get a limited value range.

### Image
Configuration example:

	moduleConfig":{ ...
		{
			"id":"cam",
			"type":"Img",
			"imgURL":"svc/io/cam.jpg",
			"width":"70", "height":"50",
			"pos":{ "x":"590", "y":"40" }
		}

The parameters "width" and "height" are optional.

## Load data per IO

Optional field "dataURL" defines to do a inner AJAX request. 

Additional "data" field defines a path insinde the JSON to set as "value".


## TODOs
- Gauges
- Images (e.g. web cam)