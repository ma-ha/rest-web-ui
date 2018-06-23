# Structure Spec

TODO: migreate WIKI to here

## Basic Layout Specification:

    {
      "layout": {
        "title": "Page Title",
        "header": {
          ... header def ...
        },
        "rows": [
          { "rowId": "...",
           ... row view def ... },
          { ... another row view def ... }
        ]
        "footer": {
          ... header def ...
        }
      }
    }

_Important:_
`rowId` and `columnId` must be unique in a page and sould start with a character (no number)!

## Columns in Rows

A row def can contain columns, instead of views:

    "rows": [
      ...
      { "rowId": "r1", "height": "500px",
        "cols": [
          {
            "columnId": "...", 
            ... view def ...
          },
          {
            ... another column view ...
          }
        ]
      }
      ...
    ]

## Rows in Columns

Also columns can contain rows, instead of views:

    "cols": [
      ...
      { "columnId": "c1", "height": "500px",
        "cols": [
          {
            "columnId": "...", 
            ... view def ...
          },
          {
            ... another column view ...
          }
        ]
      }
      ...
    ]

## Resource Definition

TODO:
- rowId / columnId 
- type
- width / height
- resourceURL vs moduleConfig
- decor
- headerURL / footerURL
- callback
- modal
- actions

## Header

Example of rich header

    "header": {
      "logo": {
        "text": "Logo Test",
        "img": "img/logo.png",
        "url" : "index.html"
      },
      "linkList": [
        { "text":"Help", "url": "https://mh-svr.de/mw/index.php/PoNG"}
      ],
      "frameWarning":"true",
      "modules" : [
        { "id": "LangSel", "type": "i18n", "param": { "langList": [ "EN","DE" ] } },
        { "id": "MainNav", "type": "pong-navbar", "param": { "confURL":"nav" } },
        { "id": "PullDownMenu", "type": "pong-pulldown", 
          "moduleConfig": {
            "title": "Test Cases",
            "menuItems" : [
             { "html":"<b>Regression Tests:</b>" },
             { "pageLink":"tests/action", "label":"Action Test" },
             { "pageLink":"tests/easyPgn", "label":"Easy-Form/-Table (Paginator)" },
          ]   
          } 
        },
        { 
          "id":"Search", 
          "type": "pong-search", 
          "moduleConfig": {
            "page": "tests/histogram",
            "label": "Quick Search:",
            "title": "Quick Search",
            "update": [ 
              { "id":"outTbl", "param":"productName"}, 
              { "id":"r1", "param":"productName" } 
            ]
          }  
        }
      ]
    }

See also: ["Header Modules" section](../modules/README.md)

## Array `layout/includeJS`

The array contains URL strings for additional JS. 

The page will load these JS early, i.e. before all modules are initialized.

Example: see [js-headerincl](../svc/layout/tests/js-incl/structure)
