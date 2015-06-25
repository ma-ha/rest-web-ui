# ReST-Web-UI
Framework to create descriptive web applications for REST/JSON type web services. All you need is a modern web browser -- and a web service somewhere.

The heart of the framework file is *html/js/portal-ng.js*, but you really need to touch it.

Modular plug-ins do all the job in the *views* (="portlets") for forms, i18n, dialogs, lists, tables, content, navigation etc.
The usage of the included set of essential modules is explained in my <a href="http://mh-svr.de/mw/index.php/PoNG_Modules" target="_blank">WIKI</p>.
The most complex and flexible is the *form* module.  

## Quick Start
1. Clone this project:
    git clone https://github.com/ma-ha/rest-web-ui.git
2. Open the *html/index.html* in your web browser. <br>This generates an UI without a dynamic backend.
2. Open the *html/svc/layout/main/structure* in an editor and start there to modify it to your needs.

## Quick Start: Do More Complex Things
I run a Portal-as-a-Service site, where you can register for free and
create intuitively more complex Web UIs more easily: <a href="http://mh-svr.de/portal" target="_blank">http://mh-svr.de/portal</a>

## You Want To Know Everything -- In Detail
Please have a look at my <a href="http://mh-svr.de/mw/index.php/PoNG" target="_blank">WIKI</p>

# Add Or Extend The Plug-Ins
The framework is modular. Some elementary modules are already in the modules sub folder.
You'll find a module template there, to start a new module.

You'll find a how-to in my <a href="http://mh-svr.de/mw/index.php/PoNG_Module_Programming" target="_blank">WIKI</p>