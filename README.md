# ReST-Web-UI
Framework to create descriptive web applications for REST/JSON type web services. All you need is a modern web browser -- and a web service somewhere.

The heart of the framework file is `html/js/portal-ng.js`, but you rarely need to touch it.

Modular plug-ins do all the job in the *views* (="portlets") for forms, i18n, dialogs, lists, tables, content, navigation etc.
The usage of the included set of essential modules is explained in my [WIKI](wiki).
The most complex and flexible is the *form* module.  

## Try some examples
* Form and result table demo: [EBay Search GUI](http://mh-svr.de/portal/show.php?layout=57aqwA687d)<br>Remark: The EBay API is *special*, not RESTful and everything is in arrays.
* Content integration via MediaWIKI API: [Example using Wikipedia](http://mh-svr.de/portal/show.php?layout=MoGiuwzxzh)
* [Portal-as-a-Service](http://mh-svr.de/portal/) runs all examples above with a PHP/MySQL web service backend.

### What's it?
It startet with some googling and evaluations, how to do light weight web GUIs. 
I decided to write a prototype, of how I would solve the challenge. 
After some lines of JS code it was doing first things. 
Pushed by this I couldn't stop ;-) Now I use it for a lot of tasks myself and if you like you can also do.
It is in a state, where you can do a lot of tasks out of the box.


## 30sec Quick Start
1. Clone this project:<br>
    `git clone https://github.com/ma-ha/rest-web-ui.git`
2. Open the `html/index.html` in your web browser. <br>You'll be ready to use a Web GUI (without a dynamic backend).
2. Open the [html/svc/layout/main/structure](blob/master/html/svc/layout/main/structure) in an editor and start there to modify the web GUI to your needs.

## Quick Start: Do More Complex Things Easier
I run a *Portal-as-a-Service* web site, where you can sign in for free and
create intuitively more complex Web UIs more easily: <a href="http://mh-svr.de/portal" target="_blank">http://mh-svr.de/portal</a>.

You can host your portals and views this *Portal-as-a-Service* web site. 

## You Want To Know Everything -- In Detail
Please have a look at my [WIKI](wiki).

## Available View Types
You'll find forms, tables, content, i18n plug in docu in the 
[module plug-ins folder](html/modules/). 

## Add Or Extend The Plug-Ins
The framework is modular. Some elementary modules are already in the modules sub folder.
You'll find a module template there, to start a new module.

You'll find a how-to in my [WIKI](wiki/Module-Programming).