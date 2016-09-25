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

## Login

The modal login form will post the user and password to the `loginURL`. 
If the authentication is OK the service can respond "Login OK" or 
using `Content-type: application/json`:

    { "loginResult":"Login OK" }
    
If the user must change the password immediately, you must respond: 

    { "loginResult":"Login OK", "changePassword":"true" }

## Handle Password Changes
Optional _param_ `changePasswordURL` will show a change password link for
authenticated users. This opens a modal dialog to change the password and sends
data to the defined web service.

## User Pages available after login
Along with essential functions like _Logout_ or _Change Password_ you can 
define pages for the user to be available only for authenticated users. 
These pages linked along with _Logout_ and _Change Password_ with the user 
name in the GUI. 

Example

    "modules" : [ 
	     { "id": "Sec", "type": "pong-security", 
	       "param": { 
               ...
               "userPages": {
	            	"User Profile":"uaser/profile",
	            	"Preferences":"user/setting",
	            }	
	       } 
      },