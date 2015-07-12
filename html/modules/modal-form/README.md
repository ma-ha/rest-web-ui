## Descrtiption
This module enables you to use forms in modal dialogs. 

Typically you can add a configuration dialog to your resource view. You only have to define the fields of the configuration form, that's it. 

##= Usage in "structure" 
Simply add a action to the <code>actions</code> array with <code>"type": "modal-form"</code>

Example structure file extract:

	{
	   "layout": {
	      ...
	      "rows": [
	      {
	        "rowId": "bla",
	        "resourceURL": "XYZ",
	        ...
	        "actions" : [ '''{ "actionName": "Config", "type": "modal-form" }''', ... ]
	      },
	      ...
	    ],
	    ...
	}

## Definition of the form
This modal-form module will the  generate a form. The field definition is loaded from the URL <code>../svc/XYZ/modal/Config/meta</code>

Example definiton from <code><nowiki>../svc/<resourceUrl/modal/<actionName>/meta</nowiki></code> 

	{
	    "propertiesList" : [
	        { "name" : "a", "type" : "text", "label": "Bla" },
	        { "name" : "b", "type" : "int", "label": "Blub" }  
	    ], 
	    "width": "800", 
	    "height": "600"
	}

Available types:
* text
* password
* int
* textarea

## Interaction with the resource 
The values are loaded with a GET call to <code><nowiki>../svc/<resourceUrl/modal/<actionName>?<name></nowiki></code>. Name is the value of name in the properties list.

The form will submit its values using POST to <code><nowiki>../svc/<resourceUrl/modal/<actionName></nowiki></code>.
