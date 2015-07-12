Module plug-ins do all the HTML rendering in the browser.
The modules use RESTful web service as information sources.  

## Standard Resource Modules coming with PoNG
* [Table View](pong-table/)
* [List View](pong-list/)
* [Master Details View](pong-master-details/)
* [Form View](pong-form/)
* [Modal Form Dialog](modal-form/)
* [Help Dialog](pong-help/)
* [MediaWiki View](pong-mediawiki/)

A special one is no real module: 
If you don't specify a <code>type</code>, a HTML page will be loaded from the resource with <code>GET <resourceURL>/html</code>. This can also be used for HTML output from other modules, e.g. the "Form View" module uses this pattern to display the action results.

## Standard Header Modules coming with PoNG 
* [18N = International language support](i18n/)
* [Navigation Bar](pong-navbar/)
* [Base Page Security](pong-security/)
* [OAuth](pong-oauth/)
* [Session](pong-session)

## Including Modules 
Modules are loaded, only if required -- if they are referenced in the layout. 
This dynamic include strategy avoids performance issues on client side due to unnecessarily loading and initializing code.

## Module Programming 
You can create your own module using the PoNG hooks. Please refer to the [module programming guide and reference](https://github.com/ma-ha/rest-web-ui/wiki/Module-Programming)

## Special modules:
* [Layout Editor](pong-layout-editor/)
* [Log View](pong-log/)