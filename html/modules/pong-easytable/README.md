# Description
This module creates a table for any kind of data for you in a resource view. 

In combination with the [form module](../pong-easyform/) you have a powerful GUI for RESTfule web service out there.

This "easy table" plug-in is a wrapper for [table module](../pong-table/). Specification is simplified to make design quicker. 

# Usage in "structure"

Simply <code>"type": "pong-table"</code> to the <code>rows</code> or <code>cols</code> resource. Example [[PoNG Structure Specification|structure file]] extract:

	 {
	   "layout": {
	      ...
	      "rows": [
	      {
	        "rowId": "123",
	        "resourceURL": "Products",
	        **"type": "pong-easytable"**,
	        ...
	      },
	      ...
	    ],
	    ...
	 }

## Definition of the Table 
The resource will load the table definition from the URL <code>../svc/XYZ/pong-easytable</code>

Example JSON definiton from <code><nowiki>../svc/[resourceUrl]/pong-easytable</nowiki></code>
 
	 {
	    "dataURL": "webdata",
	    "filter" : {
	         "dataReqParams": [ {"id":"productSearchString", "label":"Product"}, {"id":"productType", "label":"Type"} ],
	         "dataReqParamsSrc": "Form"
		},
       "easyCols": [
        	"Image",
        	"Name=Name.0",
        	"Status",
        	"*ID|40%"
        ],
	    "maxRows":"10"
	 }

## Embedded Table Definition 
Alternatively you can embed the table specification in the portal page specification:

	 {
	   "layout": {
	      ...
	      "rows": [
	      {
	        "rowId": "123",
	        "resourceURL": "Products",
	        "type": "pong-easytable",
            **"moduleConfig"**:{
			    "dataURL": "webdata",			    
               	"easyCols": [
                	"Product_img",
                	"Name=Name.0",
                	"Status",
                	"*ID|40%"
                ],
			    "maxRows":"10"
            }
	        ...
	      },
	      ...
	    ],
	    ...
	 }

### Easy Table Column Definitions
Rather than specifying a full fledged JSON structure you can  rely here on a naming convention:
* Name is equals the ID of the data
* the row ID column start with a "*"
* if you need to secify another ID, you can use  "*name*=*id*"
* all fields will have an automatic width -- you can append a "|*XX*%" to specify any or only single columne widths

By default all columns are text columns. 
If you need to specify a different column type, you can do this by appending the type to the name with a "_" in between:


### Column Types 
Available options:
* text 
* checkbox
* img
* link 
* linkLink
* button
* tooltip
* rating

The img type and link type will expect a URL as content.

