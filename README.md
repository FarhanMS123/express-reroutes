# express-reroutes

> [!NOTE]  
> Permanently archieved due no interest and real use-case for meta-serving application

Reroutes url to another url (redirecting), set status code, or use another file (rendering)

## Installation

```
npm install express-reroutes
```

## Documentation
```javascript
var reroutes = require("express-reroutes");

var routes = {
    // redirecting
    "/dir1/dir2/dir3/file.html": "./file2.html",
    "/dir1/dir2/dir3/file.html": "../dir4/file2.html",
    "/dir1/dir2/dir3/file.html": "/dir1/dir2/dir4/file2.html",
    "/dir1/dir2/dir3/file.html": "https://example.com/dir4/file.html",

    // path match and mustache template
    "/user/:name/:workplace":"/user/index.ejs?name={{ name }}&workplace={{ workplace }}", 
    "/posts/:year/:month/:day/:title": "https://example.com/posts?year={{year}}&month={{month}}&day={{day}}&title={{title}}",
    // star parameters will store as index, such as : 0, 1, 2, etc...
    "/images/*/:filename.png":"/files/png/{{ 0 }}/{{ filename }}.webm",

    // Rendering
    "/*/propertise/*/config.json": "FILE ./handler/config.ejs",

    // HTTP Status
    "/*/node_modules/": 403,
    "/*/*.ws": "400 bad request",

    // handling
    "/user/:name/:workplace/*": function(req, res, next){
        // you could access parms from req.routes
        var uname = req.routes["name"];
        var workplace = req.routes["workplace"];
        // star parameters will store as index, such as : "0", "1", "2", etc...
        var dir_path = req.routes["0"];

        next()
    }
}

// using as express middleware
app.all("/*", reroutes(routes), (req,res,next) => {
    // this middleware will never be called if reroutes is used to redirect to another page or web
    // req.routes is undefined right now.
    
    ...
    //your script
    ...

    next();
});
```

## LICENSE

This package is using MIT License.
