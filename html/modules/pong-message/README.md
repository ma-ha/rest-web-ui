## Description
May show a modal message after opening the page.

## Usage
Define in pager header:

    {
      "layout": {
        "title": "My Title",
        "header": {
          "modules" : [ 
            { "id": "PgMesg", "type": "pong-message", "param": { "resourceURL": "svc/pageXY/msg"} }
          ] 
        },
        "rows": [ ... ],
        "footer": { ... }
      }
    }

The `resourceURL` should return `null` if no message should appear.

If a message is required the service should return the format

    {
      "title":"Test",
      "html":"Hello World"
    }

Optional properties are:
* `buttonTxt`: label for the "close" dialog button
* `width`: number  
* `height`: number 