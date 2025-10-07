## Description
This module is a uses header hook to add a navigation DIV. 
The whole page is reloaded and the layout structure can be switched to a different one. 

This module uses the "layout" control feature of PoNG. So if you utilize the GET parameter "layout" the value  will be used to 
determine the layout definition, so if you load <code><nowiki>http://mysite.xyz/basedir/index.html?layout=XYZ</nowiki></code> the structure JSON is get from <code><nowiki>http://mysite.xyz/basedir/svc/layout/XYZ/structure</nowiki></code>

## Usage in "structure" 
Simply add a action to the <code>actions</code> array with <code>"type": "modal-form"</code>

Example [[PoNG Structure Specification|structure file]] extract:

    {
       "layout": {
          ...
          "header": {
            ...
            "modules" : [ 
              { "id": "MainNav", "type": "pong-navbar", "param": { "confURL":"nav" } }
              ...
            ] 
          },
          ...
    }

## Menu Style

I.e. on mobile devices a menu can't be shown. The menu is accessible via a "burger" icon (the stacked horizontal lines).

To convert your menu into a "burger" add `"burger": ["mobile","tablet","desktop"]` to "param".

Of course you can have burger menu only on mobile phones: `"burger": ["mobile"]`

## Menu Item Configuration
The `GET confURL` should return a JSON like this example:

    {
        "navigations" : [
           { "layout":"main", "label":"Main"  },
           { "layout":"crm", "label":"CRM"  },
           { "id":"xy", "layout":"xy", "label":"Xy" }
           { "id":"xz", "layout":"xz", "label":"abc", "html":"This is <a href="index.html?layout=abc">ABC</a>" }
        ]
    }

You can use <code>page_name</code> alternatively to identify pages for tabs -- if page_mode is set to php.

If the `navigations[x].id` is defined, then it will be used in the `HTML DIV ID`.

If the `navigations[x].html` is set, then it will be used instead of the generated link.

You cn configure submenus to show on mousenter, instad on click, by adding `"navSubMenu` config:

    {
      "navigations" : [...],
      "subMenuConfiguration" : [ "onMouseEnter" ]
    }

Optional `"info":"text"` can be given for each navigation.

## Usage with embedded configuration 
Example:

    {
      "layout": {
         ...
         "header": [
         {
            ...
            "modules" : [ 
                {  
                   "id": "MainNav", 
                   "type": "pong-navbar", 
                   "moduleConfig": {
                         "navigations": [
                                {
                                    "layout": "abc",
                                    "page_name": "tab1",
                                    "label": "Tab 1"
                                },
                                {
                                    "layout": "xyz",
                                    "page_name": "tab2",
                                    "label": "Tab 2"
                                }
                         ]
                    }
                } 
            ] 
         },
         ...
       ],
       ...
    }

Hint: If you don't embed the configuration, the service will be polled every minute to update the "info". 

### Example result 
Generated HTML is:

     <html>
     <head>...</head>
     <body>
        <div id="maindiv" class="page-width">
        <div id="header">
                    ...
          <div id="MainNav" class="pong-navbar">
            <div class="pongNavBarItem pongNavBarItemActive">
                <a href="index.html?layout=main">
                    Main
                </a>
            </div>
            <div class="pongNavBarItem">
                <a href="index.html?layout=crm">
                    CRM
                </a>
            </div>
         </div>
         ...

## Sub-Menu Configuration

Example:

    {
       "navigations" : [
          { "layout":"main", "label":"Main"  },
          { "label":"I/O Demos"
            "menuItems" : [
                   { "layout":"tests/a", "label":"Demo 1" },
                   { "layout":"tests/b", "label":"Demo 2" },
                   { "html":"<b>Regression Tests:</b>" },
                   { "layout":"tests/xx", "label":"Demo 3" }
            ]  
          },
          { "layout":"second", "label":"Other Menu"  },
       ]
    }

