## Description
Embed additional navigation into page. 

## Usage in "structure" 
Simply add a action to the <code>actions</code> array with <code>"type": "modal-form"</code>

Example [[PoNG Structure Specification|structure file]] extract:

	{
	"layout": {
		...
		"rows": [
			{  "rowId": "SubNav", 
				"height":"50px",
				"resourceURL":"nav-main",
				"type": "pong-nav-embed",
				"decor":"none"
			},
			...
		],
		...
	}

## Configuration 
The <code>resourceURL</code> should be like this example:

	{
	    "navigations" : [
	       { "layout":"main", "label":"Main"  },
	       { "layout":"crm", "label":"CRM", "img":"img/p01w.png"  }
	    }
	}

## CSS

If the layout is the curretn page, class `pongNavEmbedActive` will be set.