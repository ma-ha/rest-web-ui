# Release Notes
## Version1.3.x
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
  * Form: [reCAPTCHA](modules/pong-form/) as field 
  * Form field option "required"=true
  * Form with old "2-column" layout removed from docu

## Version 0.9.x
* Code clean up
* [Login dialog](modules/pong-security/) with "enter" submit
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
* [IO](modules/pong-io): graph with grid
* [IO](modules/pong-io): graph with time x-Axis
* 0.9.8: [IO](modules/pong-io): graph y-Axis scaling option (mouse drag)
* 0.9.9: [IO](modules/pong-io): graph scaling: touch screen support
* 0.9.13: [Table](modules/pong-table): enhanced date formatting 
* 0.9.15: [IO](modules/pong-io) pollOptions
* 0.9.17/18: IO graph x-scaling
* 0.9.19: date picker in [table](modules/pong-table) filter and filter default value
* 0.9.20: select in [table](modules/pong-table) filter, jump to 1st page if required, calculate optimal fitting height
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
* [Search header module](modules/pong-search) 
* [RSS Module](modules/pong-rss)
* [Lists](modules/pong-list) with hierarchically embedded DIVs
* List/table with 
	* icons and labels
	* pie charts
	* graphs
* List w/o maxRows generate scrollbar
* [Icon Navigation View](modules/pong-icons/)

## Version 0.7.x 
* [Navigation tabs](modules/pong-navbar) with pull down sub menus
* [I/O switches action](modules/pong-io) rendered directly
* ["On-the-fly" configuration](modules/pong-on-the-fly) for views
* [Log Event Queue](modules/pong-log) (catches also logs from early page life cycle)  
* Base framework now with "pub-sub event broker"
* [Feedback view](modules/feedback) with feedback for GUI user now from forms, tables, maps, ...
* [Mobile/Tablet detection](js/ext) load &lt;layout&gt;, &lt;layout&gt;-m or &lt;layout&gt;-t files
and
* [Node.JS support](https://www.npmjs.com/package/easy-web-app)
* [Python pypi package](https://pypi.python.org/pypi?:action=display&name=easy-web-app)
* [Tree view](modules/pong-tree)
* Support logo text and img combination
* [Histogram view](modules/pong-histogram)
* [Table: setData action](modules/pong-table)
* Security: Change password
* Table: second click reverse sort order
* Security: Pull down menu with user page links
* Security: Change password with strength check
* Security: Force change password dialog after login

## Version 0.7
* Header: [Pull down menu](modules/pong-pulldown/) (new)
* [List view](modules/pong-list/) rewritten: reuse table functions
* [Table](modules/pong-table/)/[list](modules/pong-list/) view: 
	* with select fields and actions
	* with clickable Image 
	* support more field types
	* paginator with page info
	* poling reload 
* [Form view](modules/pong-form/) support more field types
* [Help View](modules/pong-help/): Option to show JSON config
* [Source Code View]](modules/pong-sourcecode/)
* Programming Plug-Ins: [Include machanism for 3rd party JS libraries](https://github.com/ma-ha/rest-web-ui/wiki/Module-Programming) 

## Version 0.6
Modules Improvement:
* [Easy Form Mdule](modules/pong-easyform/) (new) 
* [Easy Table Module](modules/pong-easytable/) (new)
* TODO: improved table paginator

## Version 0.6
Modules Improvement:
* [I/O Module](modules/pong-io/) 

## Version 0.5 
General Improvements
* [Client side session handling](https://github.com/ma-ha/rest-web-ui/wiki/Module-Programming#Client_Side_Session)
Modules Improvement:
* [OAuth Module](modules/pong-oauth/)
* [Map: Display Map View](modules/pong-map/) 
* [Table: column sorting](modules/pong-table/)
* [Form: AJAX error handling](modules/pong-form/) 
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
* [MediaWiki View](modules/pong-mediawiki/)
* Security Header 
* [Master-Detail-Tables View](modules/master-details-view/)
* [I18N Internationalization](modules/i18n/)

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
