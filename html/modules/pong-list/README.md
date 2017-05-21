## Introduction
The module is based on the "[table module](../pong-table/)", so all fields etc are available.

The "table module" renders a HTML TABLE, this "list module" renders a set od HTML DIVs.

## Usage

The advantage is be able to cluster DIVs hierarchically.

    {
	   "layout": {
	      ...
	      "rows": [
	      {
	        "rowId": "mylist",
	        "resourceURL": "Products",
	        '''"type": "pong-list"''',
	        "moduleConfig":{
					"rowId": "ID",
					"divs" : [
						{ "id":"Name", "cellType":"div",
						  "divs":[
							{ "id":"Name", "cellType":"text" }
							{ "id":"Status", "cellType":"checkbox" },
							{ "id":"StatusLb", "label":"Status", "cellType":"label" },
							{ "id":"Rating",  "cellType":"rating", "ratingType":"3star" },
						  ] 
						}, 
						{ "id":"Picture", "cellType":"img" },
						{ "id":"ZoomImg", "cellType":"largeimg", "forImg":"Picture" },
						{ "id":"Description", "cellType":"text","editable":"true" },
						{ "id":"ProductPage", "cellType":"linkLink" }
					],
					"maxRows":"4"
				},
	      },
	      ...
	    ],
	    ...
	}

Please notice, that `"label"` is now a `cellType` and labels inside the divs are ignored.
