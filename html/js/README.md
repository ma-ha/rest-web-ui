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


## Array `layout/includeJS`

The array contains URL strings for additional JS. 

The page will load these JS early, i.e. before all modules are initialized.

Example: see [jeheaderincl](../svc/layout/tests/js-incl/structure)
