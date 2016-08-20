## How does it work
The histogram can operate in two modes:
1. special histogram like web service - optimum for huge data sets
2. evaluate field in a result set - works with most web services and small data sets 

Mode 1 is active, if a `dataURL` is set -- mode 2 works via `updateData` hook, 
so the module is passive and gets data passed from other modules.

## Configuration Parameters (mode 1)

	...
	"type":"pong-histogram",
	"title":"Hsitogram Test",
	"moduleConfig":{
		"dataURL":"svc/mock/histogram",
		"dataX":"price",
		"dataY":"count",
		"xAxisMin":"0",
		"xAxisMax":"200",
		"blockCount":"20",
		"yAxisMax":"auto",
		"update":[
			{ "resId":"outTbl", "x1":"minPrice", "x2":"maxPrice" }
		]
	}
	
This will triger mode 1 and do a GET to web service at
`svc/mock/histogram` and expects data like:

	[
	    {
	        "price": "0-10€",
	        "count": "0"
	    },
	    {
	        "price": "20€",
	        "count": "2"
	    },
	    {
	        "price": "30€",
	        "count": "10"
	    },
	    ...
	]
	
In the configuration `moduleConfig.dataX` and `moduleConfig.dataY` 
defines the fields to read out.

The `update` passes the defined parameters if a user clicks on
one bat to the named view.
	
## Configuration Parameters (mode 2)
Please notice, that no `dataURL` is defined:

	...
	"type":"pong-histogram",
	"title":"Hsitogram Test",
	"moduleConfig":{
		"dataX":"price",
		"dataY":"count",
		"xAxisMin":"0",
		"xAxisMax":"200",
		"blockCount":"20",
		"yAxisMax":"auto",
		"update":[
			{ "resId":"outTbl", "x1":"minPrice", "x2":"maxPrice" }
		]
	}
	
This will triger mode 2. I is expected to get a data result set by `setData`
hook, e.g. by a form:

		"rowId":"Form",
		...
		"type":"pong-form",
		"moduleConfig":{
			"fieldGroups":[
				{
					"columns":[
						{
							"formFields":[
								...
							]
						}
					]
				}
			],
			"actions":[
				{
					"id":"Srch",
					"actionName":"Search",
					"method":"GET",
					"actionURL":"svc/mock/product",
					"setData":[
						{
							"resId":"histogram"
						},
						{
							"resId":"outTbl"
						}
					]
				}
			]
		}, 
		...

Data from service `svc/mock/product`should look like:

	[
	    {
	        "id": "101",
	        "item": "Red Shoes",
	        "type": "23",
	        "price": "199.99"
	    },
	    {
	        "id": "102",
	        "item": "Black Shoes",
	        "type": "23",
	        "price": "179,00"
	    },
	    {
	        "id": "103",
	        "item": "Green Shoes",
	        "type": "23",
	        "price": "139,99"
	    },
	    ...
	]
	
The histogram view will could the prices for each block range and render the block height. 

Clicking the block will still update all views specified.

## TODO:
- support `dataDocSubPath`
- support `yAxis` logarithmic etc.
- support also Date for `xAxisType`
- spport zoom 