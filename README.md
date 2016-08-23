# Hypno.js - A library for RESTful APIs

Hypno allows you to generate wrapper-like syntax from a RESTful API by specifying a few parameters. For example, take the JSON Placeholder REST API below:

```javascript
var hypno = require("hypno");

var placeholder = new hypno.API({
  "domain": "http://jsonplaceholder.typicode.com/",
    "endpoints": {
    "posts": "/posts/%id%",
    "images": "/images/%id%",
    "albums": "/albums/%id%",
    "todos": "/todos/%id%",
    "users": "/users/%id%"
  },
  "headers": {
    "User-Agent": "RequestBot v0 (Chromium; NodeJS like JavaScript)"
  }
});

/** Empty parameter values go as empty strings **/
placeholder.get("images")
  .then(function(images) {
    console.log(images.length)
  })
/** Specifying parameter values is as easy as an object literal **/
placeholder.get("images", {
  "parameters": {
    "id": 1,
    // Unused parameters are passed as strings
    "code": 1234
  },

}).then(function(image) {
  console.log(image.url)
})
```


### Planned features:
 - OAuth Support
 - HTTPS Support
 - POST, PUT, etc Support
