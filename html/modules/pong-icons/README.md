## Configuration Parameters 

	...
	"type":"pong-icons",
	"title":"Navigate",
	"moduleConfig":{
		"icons":[
			{ "page":"services", "label":"Services", "img":"iServices.png" },
			{ "page":"dashboard", "label":"Dashboard", "img":"iDashboard.png", "info":"New!!" }
		]
	}

## Load via "resourceURL"

This is recommended, since you can refresh the icons view:

	{
		"icons":[
			{ "page":"services", "label":"Services", "img":"iServices.png" },
			{ "page":"dashboard", "label":"Dashboard", "img":"iDashboard.png", "info":"New!!" }
		],
		"update":"30"
	}
	
The parameter "update" means seconds for reloading the configuration.