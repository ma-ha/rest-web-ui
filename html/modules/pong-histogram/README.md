## How does it work
The histogram can operate in two modes:
1. special histogram like web service - optimum for huge data sets
2. evaluate field in a result set - works with most web services and small data sets 

Mode 1 is active, if a `dataURL` is set -- mode 2 works via `updateData` hook, 
so the module is passive and gets data passed from other modules.

## Configuration Parameters

	...
	"type":"pong-histogram",
	"title":"Hsitogram Test",
	"moduleConfig":{
		"dataURL":"svc/mock/histogram",
		"dataX":"price",
		"dataY":"count",
		"xAxisType":"integer", // or decimal or date or percentage
		"xAxisMin":"0",
		"xAxisMax":"100",
		"yAxis":"linear",
		"yAxisMin":"0",
		"yAxisMax":"auto",
		"zoomUpdate":["out2"],
		"maxDeepth":"4"
	}