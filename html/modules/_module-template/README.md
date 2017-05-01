To start your own module you can use a copy this template directory. 

Please find a guide and reference for coding new module plug-ins using this template 
in the [WIKI](https://github.com/ma-ha/rest-web-ui/wiki/Module-Programming).

Hint: Check always the browser compatibility in the 
[JS Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference)
for all JS tricks you put into your code.

# Patterns

## Doing AJAX Requests

Always pass the page parameters to the backend:

```javascript
$.getJSON( 
  def.resourceURL, 
  paramsObj,
  function( data ) {
    ... 	
  }
)
```
