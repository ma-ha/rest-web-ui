# ReST Web GUI
Framework to create descriptive web applications for REST/JSON type web services. 

All you need is a modern web browser -- and a web service somewhere.

## How does it work
1. Portal pages are defined via a JSON file. 
2. An empty HTML file loads the JS framework and the page definition JSON file
3. The framework replaces the empty page by the fully rendered portal page with all logic injected.

## Click and try some examples
* Content integration via MediaWIKI API:
<a href="http://mh-svr.de/portal/show.php?layout=MoGiuwzxzh" target="_blank">Example using Wikipedia</a>.
* Form and table demo: 
<a href="http://mh-svr.de/portal/show.php?layout=57aqwA687d" target="_blank">EBay search</a>.
* <a href="http://mh-svr.de/portal/show.php?layout=nRBs3E9sQp" target="_blank">Docker API Example</a> shows installed containers (requires local Docker installation)
* <a href="http://mh-svr.de/portal/" target="_blank">Portal-as-a-Service</a> runs all examples above with a PHP/MySQL web service backend.

### What's it?
It started with some googling and evaluations, how to do light weight web GUIs. 
I decided to write a prototype, of how I would solve the challenge. 
After some lines of JS code it was doing first things. 
Pushed by this I couldn't stop ;-) Now I use it for a lot of tasks myself and if you like you can also do.
It is in a state, where you can do a lot of tasks out of the box.

The heart of the framework file is `html/js/portal-ng.js`, but you rarely need to touch it.

Modular plug-ins do all the job in the *views* (="portlets") for forms, i18n, dialogs, lists, tables, content, navigation etc.
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

## You want to know everything -- in detail
Please have a look at my [WIKI](https://github.com/ma-ha/rest-web-ui/wiki).

## Available view types
You'll find forms, tables, content, i18n plug in docu in the 
[module plug-ins folder](html/modules/). 

## Add or extend Plug-Ins
The framework is modular. Some elementary modules are already in the modules sub folder.
You'll find a module template there, to start a new module.

You'll find a how-to in my [WIKI](https://github.com/ma-ha/rest-web-ui/wiki/Module-Programming).