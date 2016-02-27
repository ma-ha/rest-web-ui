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
	
By defining a <code>setRouteData</code> array the module will pass route result data to other views (resId):

	{
  		"mapKey":"...",
  		"setRouteData":[ {"resId":"65"} ]
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
	
Here "search" is not very precise, but you can also call it this way:	

	...
 	"params": [
	    {
	        "name":"street",
	        "value":"${primary_address_street}"
	    },
	    {
	        "name":"city",
	        "value":"${primary_address_city}"
	    },
	    {
	        "name":"country",
	        "value":"${primary_address_country}"
	    },
	    {
	        "name":"label",
	        "value":"${name}, ${account_name}"
	    }
	], ...
		
Update can be
* "search":"<location search string>"
* "routeTo":"<location>" (needs one search in a prior call or in the update)
* "routes":[<locations>] (array of locations or searches)
* "roundTrip" is like routes, but from the last location a route to the first will also be calculated.
* "clearRoute":"true"
