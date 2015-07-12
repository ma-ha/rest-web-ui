The security module requests an Oauth token from a backend and holds it in the browser, attaches it to WS requests and hands it over to other navigation pages.

## Usage:

	{
		"layout": {
			...
		    "header": {
		      ...
		      "modules" : [ 
		         { "id": "Sec", "type": "pong-security", 
		           "param": { 
			             "loginURL":"svc/sec/login.php", 
			             "registgerURL":"index.php?layout=register", 
			             "logoutURL":"svc/sec/logout.php", 
			             "rolesURL":"svc/sec/usersroles.php" 
		           } 
		        },
		        ...
		      ] 
		    },
  			...
		}
	}

A user/password is requested on loading and a Oauth token is requested, if not done already on another page. 

## OAuth params:

	"param" : {
    	"oauthScope":"myscope",
    	"oauthToken":"<nowiki>https://server/oauth</nowiki>",
    	"exitPage":"<nowiki>http://myserver/exitpage/</nowiki>"
    }
