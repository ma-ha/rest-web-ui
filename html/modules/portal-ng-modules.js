/*
The MIT License (MIT)

Copyright (c) 2014 Markus Harms, ma@mh-svr.de

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. 
 */

// Example: For js/pong-modules/testmodule.js add the line:
// moduleMap.push( "testmodule" );
// available hooks: 
//   addActionBtn (id,modalName,resourceURL)
//   creModal (id,modalName,resourceURL)
//   loadResourcesHtml (divId,resourceURL)

moduleMap[ "pong-session" ] = {
	"name": "pong-session",
	"hooks": [
	    { hook: "addHeaderHtml", method:"addSessionHeaderHtml" }
	 ]
};

moduleMap[ "pong-security" ] = {
	"name": "pong-security",
	"requires": [ "pong-session" ],
	"hooks": [
		{ hook: "init", method:"initSecurityHeaderHtml" },
	    { hook: "addHeaderHtml", method:"addSecurityHeaderHtml" }
	 ]
};

moduleMap[ "pong-oauth" ] = {
	"name": "pong-oauth",
	"hooks": [
		{ hook: "init", method:"initOAuthHeaderHtml" },
	    { hook: "addHeaderHtml", method:"addOAuthHeaderHtml" }
	 ]
};

moduleMap[ "i18n" ] = {
	"name": "i18n",
	"hooks": [
	    { hook: "addHeaderHtml", method:"addI18NHeaderHtml" }
	]
};

moduleMap[ "pong-navbar" ] = {
		"name":  "pong-navbar",
	    "hooks": [
	        { hook: "addHeaderHtml", method:"addNavBarHeaderHtml" } 
	    ]
	};

moduleMap[ "pong-pulldown" ] = {
		"name":  "pong-pulldown",
	    "hooks": [
	        { hook: "addHeaderHtml", method:"addPullDownHeaderHtml" } 
	    ]
	};

moduleMap[ "modal-form" ] = {
	"name": "modal-form",
    "hooks": [
        { hook: "addActionBtn", method:"modalFormAddActionBtn" },
        { hook: "creModal", method:"modalFormCreModalFromMeta" }
    ]
};

moduleMap[ "pong-table" ] = {
	"name": "pong-table",
    "hooks": [
        { hook: "addActionBtn", method:"pongTableAddActionBtn" },
        { hook: "loadResourcesHtml", method:"pongTableDivHTML" },
        { hook: "update", method:"pongTableUpdateData" },
        { hook: "setData", method:"pongTableSetData" }
    ],
    "include":[ "jquery.elevatezoom.js" ]
};

moduleMap[ "pong-easytable" ] = {
	"name": "pong-easytable",
	"requires": [ "pong-table" ],
    "hooks": [
        { hook: "addActionBtn", method:"pongTableAddActionBtn" },
        { hook: "loadResourcesHtml", method:"pongEzTableDivHTML" },
        { hook: "update", method:"pongEzTableUpdateData" },
        { hook: "setData", method:"pongEzTableSetData" }
    ]
};

moduleMap[ "pong-list" ] = {
	"name":  "pong-list",
	"requires": [ "pong-table" ],
    "hooks": [
         { hook: "loadResourcesHtml", method:"pongListDivHTML" },
         { hook: "update", method:"ponglisteUpdateData" }
     ]
};

moduleMap[ "pong-form" ] = {
	"name": "pong-form",
    "hooks": [
        { hook: "loadResourcesHtml", method:"pongFormDivHTML" },
        { hook: "update", method:"pongFormUpdateData" },
        { hook: "setData", method:"pongFormSetData" }
    ]
};

moduleMap[ "pong-easyform" ] = {
	"name": "pong-eaysyform",
	"requires": [ "pong-form" ],
    "hooks": [
        { hook: "loadResourcesHtml", method:"pongEasyFormDivHTML" },
        { hook: "update", method:"pongEasyFormUpdateData" },
        { hook: "setData", method:"pongEasyFormSetData" }
    ]
	};

moduleMap[ "pong-master-details" ] = {
	"name": "pong-master-details",
	"requires": [ "pong-table", "pong-list" ],
    "hooks": [
        { hook: "loadResourcesHtml", method:"pongMasterDetailsHTML" }
    ]
};

moduleMap[ "jquery-syntax" ] = {
	"name": "jquery-syntax",
	"hooks": [
		{ hook: "init", method:"initJQuerySyntax" }
	],
    "include":[ "syntax/jquery.syntax.js", "syntax/jquery.syntax.cache.js" ]
};


moduleMap[ "pong-help" ] = {
	"name": "pong-help",
	"requires": [ "jquery-syntax" ],
    "hooks": [
        { hook: "addActionBtn", method:"pongHelpAddActionBtn" },
        { hook: "creModal", method:"pongHelpCreModalFromMeta" }
    ]
};

moduleMap[ "pong-sourcecode" ] = {
	"name": "pong-sourcecode",
	"requires": [ "jquery-syntax" ],
    "hooks": [
        { hook: "loadResourcesHtml", method:"pongSrcCodeDivHTML" },
        { hook: "update", method:"pongSrcCodeUpdateData" },
        { hook: "setData", method:"pongSrcCodeSetData" }
    ]
};


moduleMap[ "pong-mediawiki" ] = {
	"name": "pong-mediawiki",
    "hooks": [
        { hook: "loadResourcesHtml", method:"pongMediaWikiDivHTML" }
    ]
};

moduleMap[ "pong-layout-editor" ] = {
		"name": "pong-layout-editor",
	    "hooks": [
	        { hook:"loadResourcesHtml", method:"pongLayoutEditorDivHTML" },
	        { hook:"update", method:"layoutEditorUpdateData" }
	    ]
	};

moduleMap[ "pong-log" ] = {
		"name": "pong-log",
	    "hooks": [
  	      { hook:"loadResourcesHtml", method:"ponglog_DivHTML" },
          { hook:"addActionBtn", method:"pong_log_AddClearOutputBtn" },
	        { hook:"log", method:"ponglog_out" }
	    ]
	};

moduleMap[ "pong-map" ] = {
		"name": "pong-map",
		"loadCSS": [ "http://cdn.leafletjs.com/leaflet-0.7.5/leaflet.css" ],
		"loadJS": [ "http://cdn.leafletjs.com/leaflet-0.7.5/leaflet.js" ],
	    "hooks": [
  	      { hook:"loadResourcesHtml", method:"pong_map_DivHTML" },
	        { hook:"addActionBtn", method:"pong_map_AddActionBtn" },
	        { hook:"update", method:"pong_map_Update" },
	        { hook:"setData", method:"pong_map_setData" }
	    ]
	};

moduleMap[ "pong-io" ] = {
		"name": "pong-io",
	    "hooks": [
	        { hook: "loadResourcesHtml", method:"pongIoDivHTML" },
	        { hook: "updateData", method:"pongIoUpdateData" }
	    ]
	};


moduleMap[ "pong-on-the-fly" ] = {
    "name": "pong-on-the-fly",
    "hooks": [
        { hook: "addActionBtn", method:"pongOnTheFlyAddActionBtn" },
        { hook: "creModal", method:"pongOnTheFlyCreModalFromMeta" }
    ]
  };

moduleMap[ "pong-feedback" ] = {
    "name": "pong-feedback",
    "hooks": [
        { hook:"addFooterHtml", method:"pongFeedbackHTML" }
    ]
  };

moduleMap[ "pong-tree" ] = {
    "name": "pong-tree",
    "hooks": [
        { hook: "loadResourcesHtml", method:"pongTree_DivHTML" },
        { hook: "updateData", method:"pongTree_UpdateData" }
    ]
};