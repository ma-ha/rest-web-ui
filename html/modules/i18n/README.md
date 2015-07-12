This module is a uses header hook to add internationalization (= i18n) support to [[PoNG]]. 

Important: This module inserts a language switch in the header. 
The I18N itself is not in the module, please refer the [module programming WIKI page](https://github.com/ma-ha/rest-web-ui/wiki/Module-Programming).

## Usage in "structure" 
Simply add a action to the <code>actions</code> array with <code>"type": "modal-form"</code>

Example [[PoNG Structure Specification|structure file]] extract:
    {
		"layout": {
			...
			"header": [
				{
					...
					"modules" : [ { "id": "Lang", '''"type": "i18n", "param": { "langList": ["EN","DE","FR"] }''' } ] 
				},
				...
			],
			...
	}

There is a small flag icon in the header to switch the language. The icons are country icons, so if you want to assign a flag to a language code, please rename the flag PNG to the <code>lower-case-lang-code.png</code>
