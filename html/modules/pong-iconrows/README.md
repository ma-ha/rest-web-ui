## Configuration Parameters 

  ...
  "type":"pong-iconrows",
  "title":"Navigate",
  "moduleConfig":{
    "iconRow":[
       [
          { "page":"services", "label":"Services", "img":"iServices.png" },
          { "page":"dashboard", "label":"Dashboard", "img":"iDashboard.png", "info":"New!!" }
       ]
    ]
  }

Due to the more fixed layout than `pong-icons`, a colapsable sub-icon row can be diesplayed. See example below.

## Load via "resourceURL"

This is recommended, since you can refresh the icons view:

 {
    "iconRow":[
      [
        { "id":"Form", "layout":"tests/formSel", "label":"Form", "img":"modules/pong-form/icon.svg",
          "subIcons":[
              { "id":"histogramX", "layout":"tests/histogram2", "label":"Histogram", "img":"modules/pong-histogram/icon.svg" },
              ...
          ]
        },
        { "id":"histogram", "layout":"tests/histogram2", "label":"Histogram", "img":"modules/pong-histogram/icon.svg",
          "subIcons":[
              { "id":"histogramY1", "layout":"tests/histogram2", "label":"Histogram", "img":"modules/pong-histogram/icon.svg" },
              ...
          ] 
        },
        ...
      ],
      [
        { "id":"Map", "layout":"demos/crm-map", "label":"Map", "img":"modules/pong-map/icon.svg" },
        ...
      ]
    ],
    "update":"30"
  }
  
The parameter "update" means seconds for reloading the configuration.