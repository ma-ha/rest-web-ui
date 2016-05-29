# ReST Web GUI
### No programming: 

Framework to create descriptive web applications for REST/JSON type web services. 

Basic functionality of a Web Portal is provided out of the box:
* arrange data and content views on GUI
* lot of interactive view types available: 
	* form, table, lists, map/route, content, I/O, modal dialogs/forms
	* user feedback
* configuration and help functions per view
* header and footer offering lots of functionality
* i18n: switch languages without changing anything -- just provide a translation map (or web service for that)
* user sessions (transfer data between views and pages) and a build in pub-sub event broker
* OAauth2 security for web services

### Everything runs in browser:

All you need is a modern web browser -- and a web service somewhere. 

No web application server (JEE, Tomcat, NodeJS, PHP, ...) is required to run the GUI!

But to make life easier there are packaged REST backends available: 
* <a href="https://www.npmjs.com/package/easy-web-app" target="_blank">NodeJS package</a>: `npm install easy-web-app`
* <a href="https://pypi.python.org/pypi/easy-web-app" target="_blank">Python package</a>: `pip install easy-web-app`

## Click and try examples
Here are some demos of view type and demo of real world web seb service integration:
* Content integration via MediaWIKI API:
<a href="http://mh-svr.de/portal/show.php?layout=MoGiuwzxzh" target="_blank">Example using Wikipedia Web Service API to load some content</a>.
* Form and table demo: 
<a href="http://mh-svr.de/portal/show.php?layout=57aqwA687d" target="_blank">EBay search via EBay API</a>.
* <a href="http://mh-svr.de/portal/show.php?layout=eoDjrkRnv" target="_blank">Map with Mapquest location search (geo-coding API)</a>.
* <a href="http://mh-svr.de/portal/show.php?layout=nRBs3E9sQp" target="_blank">Docker API Example</a> shows installed containers (requires local Docker installation)
* <a href="http://mh-svr.de/copy/" target="_blank">Paste-n-Copy Web App</a> implements an easy web application -- I use it all the time for my bookmarks -- PasteBin for single lines ([Source on GitHub](https://github.com/ma-ha/copypaste)).
* <a href="http://mh-svr.de/portal/" target="_blank">Portal-as-a-Service</a> runs all examples above with a PHP/MySQL web service backend.
* <a href="http://mh-svr.de/pong_dev/index.html?layout=demos/io2" target="_blank">"Arduino" demo</a> or <a href="http://mh-svr.de/pong_dev/index.html?layout=demos/vacuumlab" target="_blank">"vacuum lab" simulation</a> with LEDs, switches, buttons, displays, graphs ...

These examples are [documented more detailed in the WIKI](https://github.com/ma-ha/rest-web-ui/wiki/Examples).

### More Tests
Most recent GIT checkout can be tested [here](http://mh-svr.de/pong_dev).

For more realistic demos some of the examples use simple REST services implemented in PHP.

## How does it work
1. Portal pages are defined via a plain JSON file / by a REST/JSON web service. 
2. An empty HTML file just defines the JSON page you want to view and calls the framework to start.
3. The framework injects and initialize all the required page logic: HTML, JS and CSS into the empty page to set up all the views, header and footer. All that within milliseconds!
4. The views load additional configuration and data via web service as required

The User can now interact with the page, work with the data, modify it in AJAX mode (no page reload), load further data or navigate to other pages. 

### Plug-In Architecture
The **framework** (= [portal-ng.js](html/js/)) implements the page life-cycle and contains only some core functions.
 
All the views, the session functionality, security, i18n is implemented as **plug-ins** (= [subfolders in the "modules" directory](html/modules/)). 
An open plug-in interface and predefined hooks make it easy to add or modify functionality -- if you're really unhappy and a JS programmer
(see: *Add or extend Plug-Ins*).

### Why?
It started with some googling and evaluations, how to set up a light weight web application (without coding JS). 
Of course i found a lot rapid application frameworks on the on hand -- but they need an application server. That's not light weight. 
On the other hand there are frameworks like AngularJS, but they don't do the last step: Creating a web GUI without writing JS code.

I decided to think of a prototype, of how I would solve the challenge. 
After some lines of JS code, it was doing first things more quickly than expected. 
Pushed by this I couldn't stop ;-) Now I use it for a lot of tasks myself and if you like you can also do.
It is in a state, where you can do a lot of tasks out of the box.

The heart of the framework file is `html/js/portal-ng.js`, but you rarely need to touch it -- most things are done in plug ins now.

The plug-ins do all the job in the *views* (="portlets") for forms, i18n, dialogs, lists, tables, content, navigation etc.
The usage of the included set of essential modules is explained in my [WIKI](https://github.com/ma-ha/rest-web-ui/wiki).
The most complex and flexible is the *form* module.  

## 30sec Quick Start
1. Clone this project:<br>
    `git clone https://github.com/ma-ha/rest-web-ui.git`
2. Open the `html/index.html` in your web browser. <br>You'll be ready to use a Web GUI (without a dynamic backend).
2. Open the [html/svc/layout/main/structure](https://github.com/ma-ha/rest-web-ui/blob/master/html/svc/layout/main/structure) in an editor and start there to modify the web GUI to your needs.

## 2nd Option Quick Start
I run a *Portal-as-a-Service* web site, where you can sign in for free and
create complex Web UIs intuitively: <a href="http://mh-svr.de/portal" target="_blank">http://mh-svr.de/portal</a>.

You can host your portals and views this *Portal-as-a-Service* web site. 

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
* Safari (also iPad)
* ...

IE may have some problems, but who cares ;-)

(Volunteer testers are welcome, i've only some very limited devices for tests.)

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
