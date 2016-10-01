## Usage

	{
		"rowId":"RSS",
		"height":"600px",
		"type":"pong-rss",
		"resourceURL":"svc/rss",
		"title":"RSS Feed",
		"moduleConfig":{
			"pollDataSec":"300",	
			"rssURLs":[ 
				{ "id":"Heise", "url":"svc/mock/rss?rss=https://www.heise.de/newsticker/heise-atom.xml" },
				{ "id":"Focus", "url":"svc/mock/rss?rss=http://rss.focus.de/digital/" },
				{ "id":"Bild", "url":"svc/mock/rss?rss=http://www.bild.de/rssfeeds/vw-digital/vw-digital-16728788,sort=1,view=rss2.bild.xml" }
			]
		},
        ...
	}
	
`svc/mock/`: is a simple proxy for RSS to avoid CORS problems 