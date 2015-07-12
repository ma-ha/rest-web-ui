## Description
This [module](../) enables you to add a modal help dialogs to any resource. 

## Usage
Simply add a action to the <code>actions</code> array with <code>"type": "modal-form"</code>

	 {
	   "layout": {
	      ...
	      "rows": [
	      {
	        "rowId": "bla",
	        "resourceURL": "XYZ",
	        ...
	        "actions" : [ '''{ "actionName": "My Simple Help", "type": "pong-help" }''', ... ]
	      },
	      ...
	    ],
	    ...
	 }

## Help resource
The referenced <tt>help</tt> file may be a simple HTML fragment. For example:

	 <p>This is a help example.</p>
	 <p>You can add help easily to any resource.</p>

The content of the help dialog DIV will be filled GET request to <code><nowiki>/svc/<resourceUrl/help</nowiki></code>.

## CSS 
All you need to know, that the the content of the help in embedded in a DIV of class <code>pong-help</code>
