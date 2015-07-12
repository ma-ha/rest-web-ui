This module adds OAuth security to [Form View module](../pong-form/). 
On page load a modal login dialog requests the userid and password to get the security token.

Please have a look at the other included [standard modules](../). 

## Usage in "structure" 

    {
    	"layout": {
    		...
    		"header": {
    			...
    			"modules" : [ 
    				{ 
    					"id": "Sec", 
    					"type": "pong-oauth",
    					"param": {
    						"oauth_scope": "TEST",
    						"page_oauth_tokenurl": "https://text.xyz/oauth2/token",
    						"page_oauth_exit_page": "XYZ"
    					} 
    				}
    				...
    			]
    		}
    		...
    }

In pong-forms simply add "oauth-scope" as parameter to the action, that's it.
