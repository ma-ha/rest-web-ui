## Description
This [module](../) creates an input form with button(s) to post data to backend services. 

It is the most complex plug-in and combination with the [table module](./pong-table/) you have a powerful GUI for RESTful web service out there.

If you start your first form, perhaps it is easier to start with the [easy form module](../pong-easyform/)

## Usage in "structure" 
Simply <code>"type": "pong-form"</code> to the <code>rows</code> or <code>cols</code> resource. Example [[PoNG Structure Specification|structure file]] extract:

    {
      "layout": {
        ...
        "rows": [
        {
          "rowId": "bla",
          "resourceURL": "customer",
          "type": "pong-form",
          ...
        },
        ...
      ],
      ...
    }

## Form Definition 
The resource will load the form definition from the URL <code>../svc/<resourceUrl>/pong-form</code>

Groups and columns form layout: 
You can do a more flexible form set up by arranging groups and columns: 

    {
      "label": "Customers",
      "description": "Create or edit a customer data record", 
      "id": "cloudFormId", 
      "fieldGroups":[
         {
           "fieldset":"name",
           "columns":[
              {
                 "fieldset":"name",
                 "formFields":[     
                    { ... field def ... }
                    { ... field def ... }
                 ]
              }
           ] 
        }
      ],
      "actions" : [ 
          ...
      ]
    }

The <code>fieldset</code> is optional and will render a fieldset (border) for this section and the name in the legend.

REMARK: The "two-column" layout is not supported any more.

## Fields 

Typical `formFields` definition is:

    { "id": "<field-id>", "type": "<field-type>, "label": "<label-text>" }

The Field `id` must be unique within the form. 
The HTML id is build as `<form-id>Content<field-id>`

Supported field-types:
* checkbox
* checkboxList
* date
* email
* radio
* reCAPTCHA
* select
* text (=default)

Special types
* label
* separator
* js



For all fields following options are supported:
* hide fields with hidden attribute
  * <code>"hidden":"true", "value":"..."</code> 
  * <code>"hidden":"false"</code> ''(default)'' 
  * hidden fields don't needa a label ;-)
* put field into HTTP request header or only in the request params or both
  * <code>"request":"header"</code>
  * <code>"request":"header+param"</code>
  * <code>"request":"param"</code> ''(default)''
  * <code>"request":"substitute"</code> or  <code>"request":"variable"</code> 
* disable fields (initially*)
  * <code>"disabled":"true", </code> 
  * <code>"disabled":"false"</code>  ''(default)'' 
* readonly fields
  * <code>"readonly":"true", </code> 
  * <code>"readonly":"false"</code>  ''(default)'' 
* required
  * `"required": true `
  * `"required": false `  ''(default)'' 

or in combination.
 
*) can be swichted by checkbox

### Text 
<code>"type:"text"</code> (default)

<code>defaultVal</code>: property for presetting a value is supported.

If <code>"rows":"<i>number</i>"</code> property is set, then a textarea is rendered.

Optional attribute: 
* <code>"basicAuth":"user"</code> used to create a HTTP basic-auth header field, ref. also password field
* <code>"basicAuth":"user+field"</code> used to create a HTTP basic-auth header field, and send it also as POST param, ref. also password field

Support for static `datafield`: Use <code>options</code> array, e.g. 
*  <code>"options": [ { "value":"1" }, { "value":"2" } ]</code>

Dynamic `datafield` options: <code>optionsResource</code>, e.g.  <code>"optionsResource": { "resourceURL":"myObjType", "optionValue":"name" } </code>


### EMail 

<code>"type:"email"</code> 

... same as "text" type

### Password 
<code>"type:"password"</code>

Optional attribute: 
* <code>"basicAuth":"password"</code> used to create a HTTP basic-auth header field, ref. also text field
* <code>"basicAuth":"password+field"</code> used to create a HTTP basic-auth header field and send also as POST field, ref. also text field

### Date
<code>"type:"date"</code>

You can switch the date format for the (e.g. German) language by adding e.g. the following line to *i18n/DE.json*:

  "yy-mm-dd":"dd.mm.yy"


### Select 
<code>"type:"select"</code>

Static options: <code>options</code> array, e.g. 
*  <code>"options": [ { "option":"ABC" }, { "option":"XYZ" } ]</code>
*  <code>"options": [ { "value":"1", "option":"ABC" }, { "value":"2", "option":"XYZ" } ]</code>

Dynamic options: <code>optionsResource</code>, 
e.g.  <code>"optionsResource": { "resourceURL":"myObjType", "optionField":"name", "optionValue":"id" } </code>

''Warning: The dynamic options will perform a blocking call. If there fails something, it will block the browser.''

Dependent selects: Suppose you need to fill the select based on the changed value of another form field. 
You can use the `"loadOnChange"="id-xy"` in `optionsResource`.

### Checkbox 
<code>"type:"checkbox"</code>

You should specify <code>"name":"..."</code> attribute, so the values can be collected for that name. If no name given, the id is a stand alone comitting field.

You're able to preselect a checkbox by defining <code>"defaultVal":"true"</code>.

For checkboxes you can also set <code>"readonly":"true"</code>.
 
Example:

    "formFields":[     
      { "id":"c0", "type":"checkbox", "name":"extras", "value":"ac-adapter", "label":"include AC adapter" , defaultVal":"true" }, 
      { "id":"c1", "type":"checkbox", "name":"extras", "value":"colordisplay", "label":"with color display" }, 
      { "id":"c2", "type":"checkbox"  "name":"extras", "value":"double", "label":"double size" }
   ]

Optional you can enable (`"activate": [<id1>,<id2>...]`) or disable (`"deactivate": [<id1>,...]`) 
fields or buttons in a form by a checkbox:
  
    ...
    "formFields":[     
      { "id":"c0", "type":"checkbox", "activate":["myButton"], ... }, 
         ...
      ]
    ...
    "actions" : [ { "id": "myButton", "enabled":"false", ... } ]

This is e.g. useful to enable a "Create Account" button, by accepting the "Customer Agreement".

### Radio
Example:

    "formFields":[     
      { "id":"r1", "type":"radio", "name":"usergroup", "value":"User", "checked":"true" }, 
      { "id":"r2", "type":"radio", "name":"usergroup", "value":"Admin" }
    ]

### Separator 
<code>"type:"separator"</code> adds a horizontal line instead of a field

### Text in Form 
* <code>"type:"label", "label":"Text XYZ"</code> adds the text in label as a simple text w/o any form related things, good for hints or explanations
* <code>descr</code> field adds a tool tip to the field.

Label conctent can be updated by "setData" or "OnInit".

### Captcha

The form supports [reCAPTCHA](http://www.google.com/recaptcha/intro/):

    "formFields":[
      ...
      { "id":"captcha", "type":"reCAPTCHA", "sitekey":"6ULczgU...7bsXbsX0a" }, 
    ]

The form will include Googles JS, generate the captcha.
The request to your backend will include the `g-recaptcha-response` field.
You must verify this which you can verify this at https://www.google.com/recaptcha/api/siteverify
with the params:
* `secret` (your secret key)
* `response` (the value of `g-recaptcha-response`) 
* `remoteip` IP address of user

### Link

Example:

    "formFields":[
      ...
      { "id":"lnk1", 
        "type":"link", 
        "defaultVal":"http://my.url.com", 
        "label": "Link to my URL",
        "target": "_blank" }, 
    ]

"target" is optional

### JS

Sometimes you need special code to run inside your form, typical example is a payment form. 

By `"type"="js"` no field is rendered, just the JS code is injected into the form. 

You have two options to include the code:
* `"js": " ... add your code here in one line ..."`
* `"jsURL": "/pathTo/myscript.js"`

Combine this with `includeJS` in the header.

Example:

    { 
      "layout": {
      "title": "My Payment",
      "includeJS":[
        "https://paymentprovider.com/checkout.js"
      ],
      "includeHeader": "main",
      "rows": [
        ...
        {
          "rowId": "payment",
          "title": "Payment Test",
          "type": "pong-form",
          "moduleConfig": {
            "fieldGroups": [{ "columns": [{ "formFields":[     
              { "id":"name", "type":"text", "label":"Name"}, 
              { "id":"shipAddr", "type":"text", "label":"Address"},
              { "id":"shipCity", "type":"text", "label":"Postal code and city"},
              { "id":"js", "type":"js", "js":"var handler = Checkout.configure(...)" }
            ] }] }],
            "actions" : [ 
              { "id":"PayNow", "actionName": "Pay Now", "actionURL": "svc/pay" }
            ]
          }
        }
        ...
      ]
      ...
    }
  }

If you use `"js":"alert('Hello World');"` JS is wapped with script tags and jQuery loader like this:

    <html>
    ...
    <form>
    ...
    <input ... >
    ...
    <script> $( function() { alert('Hello World'); } )</script>
    ...
    <button ...>
    </form>
    ...

If you use `"jsURL":"myscript.js"` you should have `myscript.js` like:

    $( function() { 
      alert('Hello World');
    });

## Substitue and Variable
As mentioned, you can set the  <code>"request":"substitute"</code> or <code>"request":"variable"</code> for a field.
With this you construct can pass complex structures as parameter, if you want for example pass this parameter in a POST:

    "filter":[
        {
          "name":[
            { "name1":"Nelson Inc" },
            { "name2":"Nelson LLC" }
          ]
        }
    ]

You can specify a form like this:

    { 
      "id": "cloudFormId", 
      "fieldGroups":[ 
        {  "columns":[  
              { "fieldset":"Col1", 
                "formFields":[   
                    { "id":"filter", "request":"substitute", 
                      "defaultVal":"[ {name:[{name:${name1}},{name:${name2}}]} ]", 
                      "hidden":"true" },
                    { "id":"name1",  "request":"variable", "type":"text", "label":"Filter","defaultVal":"" },
                    { "id":"name2",  "request":"variable", "type":"text", "label":"Filter","defaultVal":"" },
                    ...
                ] 
              } 
          ]  
        } 
      ], 
      "actions" : [  
          ...
      ] 
    }

Interesting option is to replace the URL by an form field. 

    { 
      "id": "cloudFormId", 
      "fieldGroups":[ 
        {  "columns":[  
              {  "formFields":[   
                    { "id":"urlInput", "type":"text", "label":"URL", "defaultVal":"http://localhost:8888/" }
                ] 
              } 
          ]  
        } 
      ], 
      "actions" : [  
          { "id":"loadSrcBtn", 
            "actionName": "Load Source File", 
            "actionURL": "${urlInput}", 
            "setData": [ { "resId":"srcView" } ] 
          }
      ] 
    }

This will initiate CORS request, so your browser will start with an OPTIONS call.
But be aware of possible security issues.

## Form Actions 
### Simple Action 
To render a button and perform an AJAX request, simply define an action with a <code>actionName</code>

<code>"action"</code>-Array:
* <code>id</code> must always be specified
* Action <code>method</code> is optional, default is <code>"method":"POST"</code>

Example: 

    {
      ...
      "actions" : [ 
        { "id":"btn", "actionName":"Save Data" }  
      ]
    }

* Action <code>dataEncoding</code> is optional 
  * default is <code>"dataEncoding":"JSON"</code>
  * also available is <code>"dataEncoding":"GETstyle"</code>, so payload is e.g. <code>a=b&c=d</code>
* Action <code>target</code> has three options:
  * give the resource id of the module, where the output has to go to 
  * or <code>"_parent"</code>, if the whole page should be replaced. The result should be an URL.
  * special value "modal", to display an alert box with the result. 
    If you specify `"taget"="modal"`, you can add `"navto"="<url>"`, to load this page if the user has closed the dialog.
  * <code>target</code> is optional, you can also ignore the response.
* Action buttons can be disabled by default using`"enabled":"false"`. This can be toggled by a checkboxes.

''Warning: If you set <code>"method":"GET"</code>, you may get problems with the length of the URL.''

You can add add further actions to you button:
* update
* setData

A button doing an update only has to specify the "updateButton" array and a "name" for the button, e.g.

    { 
      "fieldGroups":[ 
        { "columns":[  
          { 
            "formFields":[   
                  { "id":"search", "type":"text", "label":"Location", "defaultVal":"Essen, Germany" }
            ]
          } 
        ] } 
      ], 
      "actions":[
        { "id":"Search",
          "name":"Search",
          "updateButton":[ 
                { "resId":"MapView" }
          ]
        }
      ]
    }


#### Update 
Action <code>update</code> parameter in the action is an (optional) array of resource (column/row) ids, where data updates should be triggered. 
Example: 

    {
      ...
      "actions" : [ 
         { "id":"OnInit", ..., 
           "update": [ { "resId":"xyz" } ]  
         }
      ]
    }

As GET call parameter the id is send to the service.

#### setData 
Action <code>setData</code> parameter in the action is an (optional) array of resource (column/row) ids.
The response of the actions will be handed over to the named resource to be processed and shown in the view. 
Example: 

    {
      ...
      "actions" : [ 
         { "id":"setData", ..., 
           "setData": [ { "resId":"xyz", "dataDocSubPath": "searchResult.dataTbl" } ] } 
         }
      ]
    }

A typical use case is a search form and a table to display the response of the GET request. 

Optional the <code>dataDocSubPath</code> can be set to point to the data inside the result.

### Link 
If you want to open a new window or tab in the browser you can add a simple link: Just specify <code>link</code> and <code>linkUrl</code>

Example:
 
    {
      ...
      "actions" : [ 
         { "id":"lnkToEditor", "link":"Open Editor", "linkURL":"editor.php?mode=easy" }  
      ]
    }

Action <code>target</code> is optional and has three values:
* <code>"_blank"</code> (=default) opens a new tab or window. 
* <code>"_parent"</code>
* <code>"_self"</code>

To pass parameters you can define a <code>getParams</code> array, example:
 
    {
      ...
      "actions" : [ 
         { "id": "lnkToEditor", 
           "link": "Open Editor",
           "linkURL": "editor.php?mode=easy", 
           "getParams": [ "name", "id" ] }  
      ]
    }

### OnInit 
Value should be 

1. the call parameter to get initialization data. AJAX GET request to the backend is performed to load data for the form or
2. "GET", to indicate, that GET partameters from the page are passed to the onInit backend request

Example

    {
      "label": "Product Configuration",
      ...
      "actions" : [ 
           ...
           { "id":"OnInit", "onInit":{ "getInitValues":"defaultValues" }, 
              "actionURL":"svc/product/calcQuote/", "target":"quote" } 
      ]
    }

### OnChange 
A special action is the on-change-action <code>"onChange":"*"</code>. The * means, it listen to changes on all fields. You may limit the event-action to dedicated field IDs (comma separated). Multiple action specification with different on-change definitions are allowed.

No button is generated, but a JS to handle changes in the form. The main use case is to ask a backend service e.g. for a price quote and update another resource to display the result.

Example

    {
      "label": "Product Configuration",
      ...
      "actions" : [ 
         ...
         { "id":"doSomething", "onChange":"*", "actionURL":"svc/product/calcQuote/", "target":"quote" } 
      ]
    }

It is also possible to do an upate after the backend call.

Another option is to sepcify an update only. Example:

    {
      "label": "Product Configuration",
      ...
      "actions" : [ 
         ...
         { "id":"doSomething", "onChange":"*", "update":[ { "resId":"shipping" } ] } 
      ]
    }


Improvement TODO: Default delay is 1 sec to wait for an other change before calling the backend, but you can use <code>"onChangeDelay":"3"</code> to set it (to 3 sec in this example).

### AfterUpdate 

To do cascading updated.

Example

    {
      "label": "Product Configuration",
      ...
      "actions" : [ 
         ...
         { "id":"cascadeUpdate", "afterUpdate":"*", "update": [ { "resId":"anotherView" } ] } 
      ]
    }

# CSS
Each field has a DIV with an ID and classes attached for field-group and field-column.