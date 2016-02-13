## "Easy Form" Description
This [module](../) creates an input form with action buttons to post data to backend services. 

This module has the same functionality as "[Form View](../pong-form/)" -- but using naming conventions rather then meta fields it is easier to use.

It is the most complex plug-in and combination with the [table module](./pong-table/) you have a powerful GUI for RESTful web service out there.

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
In the original form plug in, you specify everything in a propper JSON hierarchy. 
To make this easier, we now offer to use a naming convention. 
We use "_" to put all information in one string in the following ways:
* c*X*_*fieldname* 
** for text fields
** or if *fieldname* (to lowercase) is a type, like password, separator or email
* c*X*_*fieldname*_*fieldtype+specs*
** to specify a field type explicitly
* *fielname*
** for hidden fields 

Example

	{
	    "id": "Customers"
	    "easyFormFields": [ 
	    	"id",
	    	"c1_Name",
	    	"c1_Remark_4rows",
	    	"c2_Email",
	    	"c2_Pass~word",
	    	"c2_separator",
	    	"c2_Phone",
	    	"c2_Fax",	 
	    	"c3_Mailings_label",   	
	    	"c3_SendAds_checkbox_infomails_ads",
	    	"c3_Newsletter_checkbox_infomails_newsletter"
	    ],
	    "actions" : [ 
	    	...
	    ]
	}

Isn't it easy?

Remark:
* the *fieldname* must be unique, it will be the ID of the field
* the *fieldname* can't contain spaces or "_". If you need a space in a label use "~" as placeholder
* in real use cases you should add a "description", to make the HTML more barrier free.
* as a limitation, you "only" can structure the fields in columns
* currently no header fields are supported
* currently no substitution is supported

## Form Actions 
ref.: "[Form View](../pong-form/)" 