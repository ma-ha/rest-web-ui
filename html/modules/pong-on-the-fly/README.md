# On-The-Fly configruation of view
This plug-in adds an action button to configure the views JSON definition.

## Usage
Example page with a table and re-configuration button (top left):

```JSON
	{
		"layout":{
			"title":"Portal: List Test",
			"includeHeader":"main",
			"rows":[
				{
					"rowId":"r1",
					"height":"400px",
					"type":"pong-table",
					"resourceURL":"svc/tbl-data",
					"title":"My Demo Table",
					"decor":"decor",
					"actions":[
						{
							"type":"pong-on-the-fly",
							"param":{ "assistUrl":"svc/tbl-data/assist" }
						}
				
					]
				}
			],
			"includeFooter":"main"
		}
	}
```	
How-to:
* _"moduleConfig"_ must be loaded, not in-line
* add an action of _"type":"pong-on-the-fly"_
* _"param"_ is not required
	
## Requirements
A dynamic re-configuration needs a REST web service to load (GET) 
and store (POST) the JSON definiton.

In our the example the type is "pong-table" and ressourceURL is "svc/tbl-data" 
-- and important: no moduleConfig is provided. 
By this, the plug-in will GET the config from "svc/tbl-data/pong-table". 
A default config must be provided. 

If you open the re-configuration dialog, change the JSON definition 
and save the congig back, a POST request will be perfomed
to "svc/tbl-data/pong-table". After that a reload of the page is triggered, 
to ensure that the new config is loaded.

## Options
In the example an URL for an assistance text is provided. 
With this, you can provide copy-paste templates e.g. for further available 
table columns. 