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

The configs for `input`, `accept` and `update` are optional.