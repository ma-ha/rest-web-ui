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
	        "type": "pong-easytable",
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
		"easyCols": [
        	"Name=Name.0",
        	"Product_img",
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
            "moduleConfig":{
			    "dataURL": "webdata",			    
               	"easyCols": [
                	"*ID|10%",
                	"Name",
                	...
                	"Product~Page_link"
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
* if you need to specify another ID, you can use  "*name*=*id*"
* all fields will have an automatic width -- you can append a "|*XX*%" to specify any or only single columne widths

By default all columns are text columns. 

If you need to specify a different column type, you can do this by appending the type to the name with a "_" in between.
The "_*column-type* will be stripped of to the name. If you don't want this stripping, please use "~" instead. 

If your column name contains the words "Rating", "Picture", Image", "Link", 
this indicates also the column type.

### Easy Column Types 
Available options:
* text 
* checkbox
* img (or picture or image)
* link 
* rating
* linkFor_<colNo> (caution: colNo start at 0 and "linkFor" counts also, if you want to refer a follow up column)

The img type and link type will expect a URL as content.

## Advanced Features
You can also append "_editable" to text columns.

For images in the table you can specify a large image for zooming in, by <largeImageId>_zooms_<imageId>, e.g.

	"moduleConfig":{
		"easyCols":[
			...
			"Picture",
			"ZoomImg_zooms_Picture",
			...
		],
		"maxRows":"3"
	}

If you need actions, or filters, you find the documetation of these features in the [table module](../pong-table/).


## Cheats

* `"*ID"` Field name is ID and it is the index of the row. Index is required if fields are editable, since the POST request must refer a record.
* `"Flag|5%"` defines the columns width as 5%  
* `Product=Name"` The column label is "Product", the field in JSON is "Name" 
* `"Product~Name"` The column label is "Product Name", the field in JSON is "ProductName"  
* `"Name=Name.0"` shows the "ABC" in `{ ... "Name":["ABC","XYZ",...] ...}`
* `"Name=Product.Name"` shows the "XYZ" in `{... "Product:{ ... "Name":"XYZ", ... }, ...}`
* `"Name_editable"`indicates, that the the user can click the values in the Name column, edit them an they are POSTed back to REST service.
* `"Created_date"` renders a YYYY-MM-DD formated date (or any format provided by i18n) from a Long: Unix-type date (sec since 1970). 
* `"Created_datems"` renders a "YYYY-MM-DD" formated date from a Java/JS-style date (ms since 1970). 
* `"Created_datems_editable"` adds a date picker dialog to motify the value.  
* `"ProductPage_linkForCol_1"` (does not create a column) it reates a link for column 1 with the URL of the field "ProductPage"
* `"Status_checkbox"` value of the "Status" field will be rendered as a checkbock (values: "true" or "false")
* `"Image"`, `"ProductImage"` or `"ProductPictureXY"` will create a IMG (HTML image) column, since the name contains "Image" or "Picture" (check is not case sensitive).
* `"ProductImgXL_zooms_Picture"` (does not create a column) suppose the "Picture" column is defined to show a thumbnail picture, then the image URL in the field "ProductImgXL" is used to provice a zoom image, displayed, at mouse over the "Picture"    
* `"Product~Page_link"`created a column with a link to the URL in "ProductPage" field
* `"Rating"` or `"Customer~Rating"` or `"Experience_rating"` creates a column to dispaly the values 0, 1, 2 or 3 as "3star" ratingType (field are: `"Rating"`, `"CustomerRating"` and `"Experience"`)
* `"Rating_5star"` renders a "5star" ratingType "rating" column
* `"Rating_prio"` renders a "prio" ratingType "rating" column
