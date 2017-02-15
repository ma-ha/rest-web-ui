# Release Notes
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
* PHP Backend Base for [Portal as a service](http://mh-svr.de/portal/)
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
