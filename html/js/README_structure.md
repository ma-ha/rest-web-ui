# Structure v2

It is the same JSON as the "old" structure, just add a `"version":"2"`:

    {
      "layout": {
        "title": "New Portal v2",
        "version":"2",
        "header": {
          ...
        },
        "rows": [
          ...
        ],
        "footer: [
          ...
        ]
      }
    }

The resulting HTML is slightly different and allows CSS using the whole page with:

    <html>
      <head>...</head>
      <body>
        <div id="headerdiv" class="pagename theme">
          <header class="page-width">
            ...
          </div>
        </div>
        </div>
        <div id="xyzMainRow" class="main-row-div pagename theme">
          <div id="xyzMainRow" class="rowdid root-row pagename theme">
            ...
          </div>
        </div>
        ... other rows ...
        <div id="headerdiv" class="pagename theme">
          <header class="page-width">
            ...
          </div>
        </div>
      </body>
    <html>

Live demo: <a href="https://mh-svr.de/pong_dev/index.html" target="_blank">Layout V2 Sample Page</a>