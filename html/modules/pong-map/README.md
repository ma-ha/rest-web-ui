Utilizing "Leaflet" to integrate maps into a view.

## Module Config

The config is easy, you simply have to provide the mapKey, provided by MapQuest:
	{
        "rowId": "MyMapView",
        "resourceURL": "change_me",
        "title": "change me",
        "moduleConfig": {
            "mapKey": "your-customer-key"
        },
        "type": "pong-map"
    }
	
Optional you can define values for "lat", "lan" and "zoom", e.g.

	{
		"mapKey":"your-customer-key",
		"lat": "51.400694",
		"lon":  "7.186241",
		"zoom": "10"
	}

## Map Interaction
You can trigger a map search, by updating and sending a "search".

Example table module:
  moduleConfig": {
	  "dataURL": "tbldata", 
	  "rowId": "id", 
	  "cols" : [ 
		   { "id": "name", "label": "Name", "cellType": "text", "width":"30%" }, 
		   { "id": "primary_address_city", "label": "City", "cellType": "text", "width":"30%" }, 
		   { "id": "primary_address_country", "label": "Country", "cellType": "text", "width":"30%" },
		   { "id": "map", "label": "Map", 
		     "cellType": "button", 
		     "method":"UPDATE",
		     "update":[
		        {
		            "resId":"MyMapView",
		            "params":[ 
		               { "name":"search", "value":"${primary_address_city} ${primary_address_country}" },
		               { "name":"label", "value":"${name}" }
		            ]
		        }
		     ],
		     "width":"5%" 
		   }
	  ],  
	  "maxRows":"10"
	}