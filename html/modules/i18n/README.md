This module is a uses header hook to add internationalization (= i18n) support. 

Important: This module inserts a language switch in the header. 
The I18N itself is not in the module, please refer the [module programming WIKI page](https://github.com/ma-ha/rest-web-ui/wiki/Module-Programming).

## Usage in "structure" 
Simply add a action to the 'actions' array with `"type": "modal-form"`

Example [Structure Specification](https://github.com/ma-ha/rest-web-ui/wiki/Structure-Specification) extract:

    {
		"layout": {
			...
			"header": [
				{
					...
					"modules": [ 
						{ "id": "Lang", 
						  "type": "i18n", 
						  "param": { "langList": ["EN","DE","FR"] } 
					    } 
					] 
				},
				...
			],
			...
	}

There is a small flag icon in the header to switch the language. The icons are country icons, so if you want to assign a flag to a language code, please rename the flag PNG to the `<lower-case-lang-code>.png`

## UTF8

Some attributes in HTML must use UTF8 strings:

DE.json

    {
       "change": "&auml;ndern",
       "UTF8: change": ändern",
       ...
    }
    
The "UTF8: " will be suppressed, in in `lang=EN` it will be "change".