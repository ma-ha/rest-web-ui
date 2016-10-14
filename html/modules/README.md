Module plug-ins do all the HTML rendering in the browser. 

The modules use RESTful web service as information sources.  

Modules are loaded by the framework if defined in the 
[structure definiton of a portal page](https://github.com/ma-ha/rest-web-ui/wiki/Structure-Specification) 
and methods are triggered in the lifecycle of the portal page.

## Modules/Views 
* [Easy Form View](pong-easyform/) 
* [Easy Table View](pong-easytable/) 
* [Form View](pong-form/)
* [Help Dialog](pong-help/)
* [Histogram View](pong-histogram/)
* [Icon Navigation View](pong-icons/)
* [I/O View](pong-io/)
* [List View](pong-list/)
* [Master Details View](pong-master-details/)
* [Map View](pong-map/)
* [MediaWiki View](pong-mediawiki/)
* [Modal Form Dialog](modal-form/)
* [Table View](pong-table/)
* [RSS View](pong-rss/)
* [Source Code View](pong-sourcecode/)

A special one is no real module: 
If you don't specify a <code>type</code>, a HTML page will be loaded from the resource with <code>GET <resourceURL>/html</code>. This can also be used for HTML output from other modules, e.g. the "Form View" module uses this pattern to display the action results.

## Header Modules  
* [Base Page Security](pong-security/)
* [i18n = International language support](i18n/)
* [Navigation Bar](pong-navbar/)
* [OAuth](pong-oauth/)
* [Oull Down Menu](pong-pulldown/)
* [Session](pong-session)

## Footer Modules  
* [Feedback for user view](pong-feedback/)

## Including podules 
Modules are loaded, only if required -- if they are referenced in the layout. 
This dynamic include strategy avoids performance issues on client side due to unnecessarily loading and initializing code.

## Module programming 
You can create your own module using the PoNG hooks. Please refer to the [module programming guide and reference](https://github.com/ma-ha/rest-web-ui/wiki/Module-Programming)

## Special modules:
* [Layout Editor](pong-layout-editor/)
* [Log View](pong-log/)