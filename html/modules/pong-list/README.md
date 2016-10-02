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
							{ "id":"Name", "label":"Name", "cellType":"text" }
							{ "id":"Status", "label":"Status", "cellType":"checkbox" },
							{ "id":"Rating", "label":"Rating", "cellType":"rating", "ratingType":"3star" },
						  ] 
						}, 
						{ "id":"Picture", "label":"Picture", "cellType":"img" },
						{ "id":"ZoomImg", "cellType":"largeimg", "forImg":"Picture" },
						{ "id":"Description", "label":"Description", "cellType":"text","editable":"true" },
						{ "id":"ProductPage", "label":"Product Page", "cellType":"linkLink" }
					],
					"maxRows":"4"
				},
	      },
	      ...
	    ],
	    ...
	}


