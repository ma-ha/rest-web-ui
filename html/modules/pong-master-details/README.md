## Description
This module creates a view of a record and details tables for any associated data in a resource view. 

Requires: 
* [Form module](../pong-form/)
* [Table module](../pong-table/)
* [List module](../pong-list/)

## Usage in "structure" 
Simply <code>"type": "pong-master-details"</code> to the <code>rows</code> or <code>cols</code> resource. Example [[PoNG Structure Specification|structure file]] extract:

	{
	   "layout": {
	      ...
	      "rows": [
	      {
	        "rowId": "bla",
	        "resourceURL": "Products",
	        '''"type": "pong-master-details"''',
	        ...
	      },
	      ...
	    ],
	    ...
	}

## Definition of the Master Details View 
The resource will load the table definition from the URL <code>../svc/XYZ/pong-master-details</code>

Example JSON definition from <code><nowiki>../svc/<resourceUrl>/pong-master-details</nowiki></code> 

	{
	    "label": "Customers",
	    "description": "CRM demo data", 
	    "searchFilter": {
	         "searchFields": [ {"id":"name", "label":"Name"}, {"id":"phone", "label":"Phone"} ]
	    },
	    "fields" : [
	       { "id": "customerId", "label": "ID", "cellType": "id" }, 
	       { "id": "name", "label": "Name", "cellType": "text" }, 
	       { "id": "phone", "label": "Phone", "cellType": "text" },  
	       { "id": "addr", "label": "Address", "cellType": "text" }  
	     ],
	     "associations" : [
	       { "resourceURL": "svc/demoOrders", "label":"Customers Orders", "tableDef": "detail-tbl-meta" },
	       { "resourceURL": "svc/blog", "label":"Messages from Customer", "listDef": "pong-list", "filterField":"authorID" }
	     ]
	}

For the associations you must provide a  [Table module](../pong-table/) definition at the specified resourceURL. 
The field <code>tableDef</code> is optional, by default it will use <code>pong-table</code> for the columns definition of the details table view. 
An alternative to <code>tableDef</code> is <code>listDef</code>, which triggers to render a  [list module](../pong-list/) instead of a table.

If the ID field of the details view differs from the master ID name, you have to define it as <code>"filterField":"<details ID column name"</code>
