The module adds _Login_/_Logout_/_Register_ links to the header. 
Clicking _Login_ starts a modal form to request user and password.

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

The param <code>registgerURL<code> is optional to show the _Register_ link.