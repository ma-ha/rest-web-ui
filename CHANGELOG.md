# Release Notes

## 2.12.8
- Form: support dot in id to POST hierarchical objects

## 2.12.7
- Form: modalstatus

## 2.12.6
- Form: regExp support

## 2.12.5
- support setData for date

## 2.12.3
- fix table button with empty text

## 2.12.2
- fix table poll with "-" in name

## 2.12.1
- Icon with "descr"

## 2.12.0
- [Upload](html/modules/pong-upload)
  - file type accept to filter files in folder
  - input default value

## 2.11.2
- fix bux with "-" in field names:
  - table filter 
  - QR scan

## 2.11.0/1
- [Form](html/modules/pong-form) add QR scanner for text input

## 2.10.0
- [Table](html/modules/pong-table) editable accepts boolean

## 2.9.6
- [Form](html/modules/pong-form) fix "setData" for checkbox

## 2.9.5
- [Table](html/modules/pong-table) links passes "id" as parm name additionally

## 2.9.4
* [pong-security2 module](html/modules/pong-security2): remove tokens from URL after login

## 2.9.3
* IMPORTANT: Fixed [pong-security2 module](html/modules/pong-security2) mSec_isAuthenticated( ... token ... ) -> token param is now `{ accessToken: STRING, idToken: STRING }`  (in prior versions, it was only access token string)

## 2.9.2
* you can inject your own private view-types or modules, see [local modules support](html/modules)

## 2.9.1
* Table with "auto" height

## 2.9.0
* tabs can be pre-selected by URL parameter: rowId/ColId=tabId

## 2.8.3
* form field type "color"

## 2.8.2
* page width fix

## 2.8.0:
* table: editable field shows alert, if response code is not 200

## 2.8.0:
* pong-form: action with "modalQuestion", see [form docu](html/modules/pong-form)

## 2.7.x
* New [pong-security2 module](html/modules/pong-security2) provides OpenId Connect 
  login flow and Auth0 implementation exampe.
* 2.7.6: fix for forms with auto-height (no height set)
* 2.7.7: pong-form: select supports `"multiple":true`

## 2.6.x
* [Upload file mondule](html/modules/pong-upload)  
* 2.6.5: fix for id param in case of mobile redirect
* 2.6.6: `pong-icons` and `pong-iconrows` pass GET-parameters to the resource load request

### 2.6.4 
* fix .page-with and .root-row 

## 2.4.x
* [Markdown Wiki module](html/modules/pong-markdown)  

## Version 2.3.0
* Pass "id" parameter to "structure" request

## Version 2.2.1
* [Icon row module](html/modules/pong-iconrow)

## Version 2.1.2
* Fix param handover in `pong-table` update

## Version 2.0.x
* Table: Filter supports checkbox, see [table docu](html/modules/pong-table)

## Version 2.0.x
* [New Layout Version 2](https://github.com/ma-ha/rest-web-ui/tree/master/html/js/README_structure.md)

## Version 1.6.x
* 1.6.1: List/Table: new field types "cssClass" and "linkText"

## Version 1.5.x
* 1.5.3/4: MediaWiki: added query param option "page"
* 1.5.5: MediaWiki: Click to zoom image

## Version 1.4.x
* 1.4.0: New module: [pong-message](https://github.com/ma-ha/rest-web-ui/tree/master/html/modules/pong-message/) 
* 1.4.2: [Form](html/modules/pong-form): link type 

## Version 1.3.x
* 1.3.0: header.logo

## Version 1.2.x
* Tab Views 
* 1.2.7
  * try to fix footerURL for IE
  
## Version 1.1.x
* v1.1.0
  * header: includeJS array 
  * form: load or include JS
* v1.1.1
  * added $.support.cors = true;
* v1.1.2
  * pass URL params to load plain html view
* v1.1.3
  * fix Stripe payment demo (JS include)
* v1.1.4
  * Form: Added ID to DIVs: divId+field.id+'Div'
* v1.1.5
  * Form: Select/options support `"selected"=true` and `"disabled"=true`
* v1.1.5
  * Form: Cursor waiting
  * Form: Label with id and can update content
  
## Version 1.0.x
* v1.0.0
  * Option to change default layout width and heigth by CSS
  * Fixed responsive design (incl. some demos)
  * Fixed minor bug fixes
* v1.0.1
  * inline styles all moved to `#viewSizes`, so all height and width can changed in `custom.css`
  * Form: Supports readonly and disabled
* v1.0.2
  * Form: [reCAPTCHA](html/modules/pong-form/) as field 
  * Form field option "required"=true
  * Form with old "2-column" layout removed from docu

## Version 0.9.x
* Code clean up
* [Login dialog](html/modules/pong-security/) with "enter" submit
* Fixes:
	* Icons view: i18n (lang pram) fix
	* Tree view i18n fix
* configure console log by 
    * `&info` = all log
    * `&info=XYZ` = only XYZ logs
* Nav-Bar with info and updates
* Icons with Info and refresh
* added "info=<pkg>" in URL to get console logs
* date column (editable)
* [IO](html/modules/pong-io): graph with grid
* [IO](html/modules/pong-io): graph with time x-Axis
* 0.9.8: [IO](html/modules/pong-io): graph y-Axis scaling option (mouse drag)
* 0.9.9: [IO](html/modules/pong-io): graph scaling: touch screen support
* 0.9.13: [Table](html/modules/pong-table): enhanced date formatting 
* 0.9.15: [IO](html/modules/pong-io) pollOptions
* 0.9.17/18: IO graph x-scaling
* 0.9.19: date picker in [table](html/modules/pong-table) filter and filter default value
* 0.9.20: select in [table](html/modules/pong-table) filter, jump to 1st page if required, calculate optimal fitting height
* 0.9.21: CSRF token passsed from layout responst header to AJAX reqest headers
* 0.9.22: Warning if embedded in frame to prevent click hijacking attack
* 0.9.23: Input with [datalist](https://github.com/ma-ha/rest-web-ui/tree/master/html/modules/pong-form#text)
* 0.9.24: Table: [Expand](https://github.com/ma-ha/rest-web-ui/tree/master/html/modules/pong-table#expand-details)
* 0.9.28: Table supports [number](https://github.com/ma-ha/rest-web-ui/tree/master/html/modules/pong-table#number)
* 0.9.29: Table buttons with dynamic labels
* 0.9.30: Form: change from optionsResource loader
* 0.9.32: "theme" and "decor" in [layout](https://github.com/ma-ha/rest-web-ui/tree/master/html/css-custom/)
* 0.9.33: Table: editable cells are now swiched to HTML input on focus
* 0.9.35: Start on Mobile main page + Avoid Cache flag (URL: ?nc=true) 
* 0.9.36: New module [pong-nav-embed](https://github.com/ma-ha/rest-web-ui/tree/master/html/modules/pong-nav-embed)
* 0.9.36: Form: Fix defaultVal in textarea
* 0.9.40: Fix plain HTML overflow and scrollbar (see HTML test) 
* 0.9.42: Table: Fix editable checkbox
* 0.9.43: Form Checkbox: enable/disable feature for other elements
* 0.9.44/45: Table: Fix "linkFor" and suppress empty links 
* 0.9.46: add "layoutId" as CSS class, if defined in layout: i.e. for mobile layouts
* 0.9.47: add meta viewport to index.html

## Version 0.8.x
* added `afterPageLoad(...)` hook
* [Search header module](html/modules/pong-search) 
* [RSS Module](html/modules/pong-rss)
* [Lists](html/modules/pong-list) with hierarchically embedded DIVs
* List/table with 
	* icons and labels
	* pie charts
	* graphs
* List w/o maxRows generate scrollbar
* [Icon Navigation View](html/modules/pong-icons/)

## Version 0.7.x 
* [Navigation tabs](html/modules/pong-navbar) with pull down sub menus
* [I/O switches action](html/modules/pong-io) rendered directly
* ["On-the-fly" configuration](html/modules/pong-on-the-fly) for views
* [Log Event Queue](html/modules/pong-log) (catches also logs from early page life cycle)  
* Base framework now with "pub-sub event broker"
* [Feedback view](html/modules/feedback) with feedback for GUI user now from forms, tables, maps, ...
* [Mobile/Tablet detection](js/ext) load &lt;layout&gt;, &lt;layout&gt;-m or &lt;layout&gt;-t files
and
* [Node.JS support](https://www.npmjs.com/package/easy-web-app)
* [Python pypi package](https://pypi.python.org/pypi?:action=display&name=easy-web-app)
* [Tree view](html/modules/pong-tree)
* Support logo text and img combination
* [Histogram view](html/modules/pong-histogram)
* [Table: setData action](html/modules/pong-table)
* Security: Change password
* Table: second click reverse sort order
* Security: Pull down menu with user page links
* Security: Change password with strength check
* Security: Force change password dialog after login

## Version 0.7
* Header: [Pull down menu](html/modules/pong-pulldown/) (new)
* [List view](html/modules/pong-list/) rewritten: reuse table functions
* [Table](html/modules/pong-table/)/[list](html/modules/pong-list/) view: 
	* with select fields and actions
	* with clickable Image 
	* support more field types
	* paginator with page info
	* poling reload 
* [Form view](html/modules/pong-form/) support more field types
* [Help View](html/modules/pong-help/): Option to show JSON config
* [Source Code View]](html/modules/pong-sourcecode/)
* Programming Plug-Ins: [Include machanism for 3rd party JS libraries](https://github.com/ma-ha/rest-web-ui/wiki/Module-Programming) 

## Version 0.6
Modules Improvement:
* [Easy Form Mdule](html/modules/pong-easyform/) (new) 
* [Easy Table Module](html/modules/pong-easytable/) (new)
* TODO: improved table paginator

## Version 0.6
Modules Improvement:
* [I/O Module](html/modules/pong-io/) 

## Version 0.5 
General Improvements
* [Client side session handling](https://github.com/ma-ha/rest-web-ui/wiki/Module-Programming#Client_Side_Session)
Modules Improvement:
* [OAuth Module](html/modules/pong-oauth/)
* [Map: Display Map View](html/modules/pong-map/) 
* [Table: column sorting](html/modules/pong-table/)
* [Form: AJAX error handling](html/modules/pong-form/) 
* several minor improvements

## Version 0.4 
General Improvements
* [New Module Directory Structure](https://github.com/ma-ha/rest-web-ui/wiki/Module-Programming)

## Version 0.3 
General Improvements
* Config for JS/CSS location
* [Update callback mechanism for modules](https://github.com/ma-ha/rest-web-ui/wiki/Module-Programming)
* [Module configuration can be embedded in structure file as ''moduleConfig''](https://github.com/ma-ha/rest-web-ui/wiki/Structure-Specification)
Modules:
* [Form View](module/pong-form/)
* [Table with editable cells](modulea/pong-table/)
* [List with editable cells](modulea/pong-list/)
Extras:
* Layout Editor
* [Module template for programmers](modulea/_module-template/)
Fixes
* Display title also w/o decor

## Version 0.2 
General:
* PHP Backend Base for [Portal as a service](https://mh-svr.de/portal/)
* Header/Footer Improvements
* Allow links in Copyright
* Basic auth mechnism
Modules:
* [MediaWiki View](html/modules/pong-mediawiki/)
* Security Header 
* [Master-Detail-Tables View](html/modules/master-details-view/)
* [I18N Internationalization](html/modules/i18n/)

## Version 0.1 
Features:
* Rendering basics 
* Modal dialogs
* Basic module and hook concept
* Resource HTML loader
Modules:
* Table View
* List View
* Form View
* Modal Form Dialog
* Help Dialog
* Includes static out of the box demo
