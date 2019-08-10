## Description
This module renders and can edit Markdown content. 

## Usage in "structure" 
Simply add a action to the <code>type</code> array with <code>"type": "pong-mediawiki"</code>

Example structure file extract:

    {
     "layout": {
        ...
        "rows": [
        {
          "rowId": "MdWiki", 
          "title": "Documentation"
          "type" : "pong-markdown",
          "resourceURL": "https://mh-svr.de/content/",
          "moduleConfig": {
            "page" : "${lang}/${page}",
            "start": "main.md",
            "options": {
              "key": "value"
            }
          ...
          }
        },
        ...
      ],
      ...
    }

You have to provide the fields:
* <code>page</code>: The initial page to be displayed.

IMPORTANT: `resourceURL` should end always with '/"

By this, the module will load e.g. https://mh-svr.de/content/EN/main.md 
and also post to this URL in edit mode.

For `options`, see https://github.com/showdownjs/showdown#valid-options

## "page" Query param

Even if the start page is defined in the `moduleConfig`, 
you can overide that by using the query parameter `page`, 
e.g. https://mh-svr.de/pong_dev/index.html?layout=demos/markdown&page=test.md

## Edit Mode

You can enable the edit button in the config:

    "moduleConfig": {
      ...
      "edit": true
      ...
    }

To jump direclty into the edit mode, you can add the URL param `mdedit=true`


## WIKI Mode

If you have more than one page, you can add "Wiki style" links to let the user navigate from one page to another page.

Link examples:
* `[[page.md]]`
* `[[page.md|Link Text]]`

