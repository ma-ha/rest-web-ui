## "Easy Form" Description
This [module](../) creates an input form with action buttons to post data to backend services. 

This module has the same functionality as "[Form View](../pong-form/)" -- but using naming conventions rather then meta fields it is easier to use.

It is the most complex plug-in and combination with the [table module](../pong-table/) you have a powerful GUI for RESTful web service out there.

## Usage in "structure" 
Simply <code>"type": "pong-easyform"</code> to the <code>rows</code> or <code>cols</code> resource. Example [[PoNG Structure Specification|structure file]] extract:

	{
	   "layout": {
	      ...
	      "rows": [
	      {
	        "rowId": "bla",
	        "resourceURL": "customer",
	        "type": "pong-easyform",
	        ...
	      },
	      ...
	    ],
	    ...
	}

## Form Definition 
The resource will load the form definition from the URL <code>../svc/<resourceUrl>/pong-easyform</code>

### Field specification Conventions
In the original form plug in, you specify everything in a proper JSON hierarchy. 
To make this easier, we now offer to use a naming convention. 
We use "|" (pipe symbol) to put all information in one string in the following ways:
* "c*X*|*fieldname*" 
 * for text fields
 * or if *fieldname* (to lowercase) is a type, like password, separator or email
* "c*X*|*fieldname*|*fieldtype_specs*"
 * to specify a field type explicitly
* "*fieldname*"
 * for hidden fields 

c*X* defines the column for the field.

Example

	{
	    "id": "Customers"
	    "easyFormFields": [ 
	    	"id",
	    	"c1|Name",
	    	"c1|Remark|4rows",
	    	"c2|Email",
	    	"c2|Pass~word",
	    	"c2|separator",
	    	"c2|Phone",
	    	"c2|Fax",	 
	    	"c3|Mailings~~|label",   	
	    	"c3|SendAds~~~|checkbox_infomails_ads",
	    	"c3|Newsletter|checkbox_infomails_newsletter"
	    ],
	    "actions" : [ 
	    	...
	    ]
	}

Isn't it easy?

Remark:
* the *fieldname* must be unique, it will be the ID of the field
* the *fieldname* can't contain spaces or "|". If you need a space in a label use "~" as placeholder. The generated "id" will be stripped by all "~" characters.
* in real use cases you should add a "description", to make the HTML more barrier free.
* as a limitation, you "only" can structure the fields in columns
* currently no header fields are supported
* currently no substitution is supported

## Back to "normal" form JSON spec
If you need all the features of the "normal" form plug-in, you can configure to show an alert box with the generated JSON code. 

	{
	    "id": "Customers"
		"debugAlert":"true"
	    "easyFormFields": [
	    	...
	    ]
	    ...
	} 

Simply copy paste the  "fieldGroups" section and change "tpye" back to "pong-form". 

## Form Actions 
ref.: "[Form View](../pong-form/)" 