## Description
This simple module can upload files to the server and optionally update a list of other views. 

## Usage 
Example:

    {
     "layout": {
        ...
        "rows": [
          {
            "rowId": "MyUpload", 
            "title": "Upload Files"
            "type" : "pong-upload",
            "resourceURL": "https://mh-svr.de/content/",
            "moduleConfig": {
              "update" : [ "fileTable" ],
              "input": [
                { "id":"name", "label":"Name" },
                { "id":"id", "label":"ID" }
              ], 
              "accept": ".txt,.log,image/*"
            }
          }
          ...
        ],
      ...
     }
  }

The configs for `input`, `accept`, `update` and `setData` are optional. The values `update` and `setData` are arrays of strings (resource ids).

Inputs can also be `"hidden":true`, to be specified either by `"value"` or by `setData` from e.g. another form.

