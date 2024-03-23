# ReST Web GUI
### No programming: 

Framework to create descriptive web applications for REST/JSON type web services. 

Basic functionality of a Web Portal is provided out of the box:
* Layouting: arrange data and content views on GUI
* View Types: The framework comes with lot of interactive view types 
	* form, table, lists, map/route, content, feeds, I/O, modal dialogs/forms, trees, upload files
	* icon navigation, user feedback
  * content: mediawiki, markdown (with wiki-syle links), plain html
* Context functions per view: Optional configuration and help 
* Richt header and footer 
* i18n: switch languages easily -- just provide a translation map (or web service for that)
* User sessions (transfer data between views and pages) and a build in pub-sub event broker
* OAauth2 security for web services
* OpenId Connect support (e.g. Auth0)

![features screen shot](https://mh-svr.de/Pong-Features.png) 

Check out the simple but effective [layout improvements of v2](html/js/README_structure.md). 

### It Scales: The Browser Does The Crunching

All you need is a modern web browser -- and a web service somewhere.

No web application server (JEE, Tomcat, NodeJS, PHP, ...) is required to run the GUI! 
So you can serve complex web apps even from a Raspberry Pi -- really fast.

But to make life easier there are packaged REST backends available: 
* <a href="https://www.npmjs.com/package/easy-web-app" target="_blank">NodeJS package</a>: `npm install easy-web-app`
* <a href="https://pypi.python.org/pypi/easy-web-app" target="_blank">Python package</a>: `pip install easy-web-app`

## Test It Live 
**[ONLINE DEMOS](https://mh-svr.de/pong_dev)**

## Real World App Example
Check out what it's capable to do in my [Low Code Data App](https://github.com/ma-ha/lowcode-data-app/).

This includes OpenId connect authentication flow, an "Entity Diagram" extension, dynamic form and table generation, lot CSS hacks and more.

## How does it work
1. Portal pages are defined via a plain JSON file / by a REST/JSON web service. 
2. An empty `index.html` contains only JS calls this framework initialized with a dedicated JSON page description.
3. The framework injects and initialize all the required page layout and logic: HTML, JS and CSS into the empty page to set up all the views, header and footer. 
4. Every individual view can load configuration and/or data via REST/JSON web services as required

All that runs within milliseconds!

The User can now interact with the page, work with the data, modify it in AJAX mode (no page reload), load further data or navigate to other pages. 

### Plug-In Architecture
The **framework** (= [portal-ng.js](html/js/)) implements the page life-cycle and contains only some core functions.
 
All the view types, the session functionality, security, i18n is implemented as **plug-ins** (= [subfolders in the "modules" directory](html/modules/)). 
An open plug-in interface and predefined hooks make it easy to add or modify functionality -- if you're really unhappy and a JS programmer
(see: *Add or extend Plug-Ins*).

### Why?
It started with some googling and evaluations, how to set up a light weight web application (without coding JS). 
A lot of existing rapid application frameworks needed an application server. That's not light weight. 
Other frameworks (e.g. Angular) help a lot, but don't offer that: Creating a web GUI by configuration -- without writing any code.

I decided to do a prototype, how can I solve the challenge. 
After some lines of JS code, it was doing first things -- more quickly than expected. 
Pushed by this I couldn't stop ;-) Now I use this framework for a lot of tasks and if you like you can also do.

The heart of the framework file is `html/js/portal-ng.js`, but you rarely need to touch it -- most things are done in plug ins now.

The plug-ins do all the job in the *views* (="portlets") for forms, i18n, dialogs, lists, tables, content, navigation etc.
The usage of the included set of essential modules is explained in my [WIKI](https://github.com/ma-ha/rest-web-ui/wiki).
The most complex and flexible is the *form* module.  

## 30sec Quick Start
1. Clone this project:<br>
    `git clone https://github.com/ma-ha/rest-web-ui.git`
2. Open the `html/index.html` in your web browser. <br>You'll be ready to use a Web GUI (without a dynamic backend).
2. Open the [html/svc/layout/main/structure](https://github.com/ma-ha/rest-web-ui/blob/master/html/svc/layout/main/structure) in an editor and start there to modify the web GUI to your needs.

## You want to know everything 
You'll find [all the details in the WIKI](https://github.com/ma-ha/rest-web-ui/wiki).

## Available view types
You'll find forms, tables, content, I/O, i18n, etc plug-ins documented in the folder 
[module plug-ins folder](html/modules/). 

## Supported Browser
Should run in all modern browsers on PC, tablet and phones:
* Chrome (also Android)
* Firefox
* Opera
* Safari (incl. iPhone/iPad)
* IE (latest versions)
* ...

Chek out [how to use CSS and how to build responsive designs](https://github.com/ma-ha/rest-web-ui/blob/master/html/css-custom/). 

Older IE may have some problems, but who cares ;-)

## Tested APIs
* [Docker](http://docs.docker.com/reference/api/docker_remote_api_v1.17)
* [eBay](http://developer.ebay.com/Devzone/finding/CallRef/findItemsByKeywords.html)
* [MapQuest](http://www.mapquestapi.com/)
* [MediaWiki / Wikipedia](http://docs.docker.com/reference/api/docker_remote_api_v1.17/#list-containers)
* [Jenkins](https://wiki.jenkins-ci.org/display/JENKINS/Remote+access+API)
* [SugarCRM](http://support.sugarcrm.com/Documentation/Sugar_Developer/Sugar_Developer_Guide_6.7/Application_Framework/Web_Services/REST/)

... and of course you can use your own custom REST/JSON Web Services.

Please let me know, if you need a specific API example or demo.

## Add or extend Plug-Ins
The framework is modular. Some elementary modules are already in the modules sub folder.
You'll find a module template there, to start a new module.

You'll find a how-to in my [WIKI](https://github.com/ma-ha/rest-web-ui/wiki/Module-Programming).

# Credits

- [cldrpluralparser](https://github.com/santhoshtr/CLDRPluralRuleParser)  (MIT license)
- [elevatezoom](https://github.com/elevateweb/elevatezoom) (GPL and MIT licenses)
- [html5-qrcode](https://github.com/mebjas/html5-qrcode) (Apache-2.0 license )
- [jquery](https://github.com/jquery/jquery) (MIT license)
- [jquery-syntax](https://github.com/ioquatix/jquery-syntax) (MIT license)
- [/mobile-detect.js](https://github.com/hgoebl/mobile-detect.js) (MIT license)
- [moment](https://github.com/moment/moment)  (MIT license)
- [showdown](https://github.com/showdownjs/showdown) (MIT license)
