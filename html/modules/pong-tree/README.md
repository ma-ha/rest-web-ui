# Description
This module creates a tree with links. 

# Usage in "structure"
Simply define `"type":"pong-tree"`

# Example
   {
     "layout": {
        ...
        "rows": [
        {
          "rowId": "xy",
          "resourceURL": "ProductsTypes",
          "description": "Show product tree"
          '''"type": "pong-tree"''',
          "moduleConfig": {
            "dataURL":"svc/product/types/",
            "titleField":"info",
            "treeArray":"types",
            "idField":"productId",
            "labelField":"productName",
            "maxDeepth":"3",
            "update":[ "1", "2", ...]       
          }
        },
        ...
      ],
      ...
   }

Tree will load, e.g  

  GET svc/product/types/
  {
    "info":"Stock: 200+ Types",
    "types":[
      {
        "productId":"1",
        "productName":"Shoes",
        "types":[
          {
            "productId":"11",
            "productName":"MyLabel"
          },
          {
            "productId":"12",
            "productName":"Lara Paris"
          },
          {
            "productId":"13",
            "productName":"Mike"
          }
        ]
      },
      {
        "productId":"2",
        "productName":"Accessoires"
      }
    ]
  }

In `moduleConfig` you can use `pollDataSec` optional, e.g.:

  
  
If `idField` is available a link is redered. Clicking this link will do a GET &lt;dataURL&gt;&lt;ID&gt; and an update of all resource IDs in `update` list.