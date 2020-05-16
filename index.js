/**
 * express-reroutes v1.0.0
 * by FarhanMS123
 * License MIT
 */

// Modules Required
var path = require("path");
var fs = require("fs");
var pathMatch = require('path-match');
var match = pathMatch({});
var mustache = require("mustache");

/**
 * key could be :
 * - normal path : "/dir1/dir2/dir3/file.html"
 * - {@link https://github.com/pillarjs/path-to-regexp#parameters path pattern} : "/dir1/dir2/:dir_name/*.*"
 * - regular expression : "^dir1/dir2/dir3/.*.html(\\?.*)?$"
 * 
 * value : 
 * - redirect to an url (relative) : "../dir4/file2.html"
 * - redirect to an url (absolute) : "/dir1/dir2/dir4/file2.html"
 * - redirect to a host url : "https://example.com/dir1/dir2/iam.php"
 * - {@link https://github.com/janl/mustache.js mustache} by and only with path pattern : "/main_render.html#{{ dir_name }},{{ 0 }}.{{ 1 }}"
 * - {@link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes http code} : 500
 * - http code with description : "500 internal server error"
 * - render a file relative (works with {@link https://www.npmjs.com/package/express-truepath express-truepath}) : "FILE ./web/file.ejs"
 * - render a file absolute (works with express-truepath) : "FILE /usr/bin/web/file.ejs"
 * - {@link https://expressjs.com/en/guide/writing-middleware.html middleware} : function(req, res, next){next();}
 * @param {Object.<string, string|number|function>} routes 
 */
function middleware(routes={}){
    return function(req,res,next){
        var do_next = true;
        for(route in routes){
            var params = match(route)(req.originalUrl);
            if((route.substr(0,1) == "^" && route.substr(-1,1) == "$" && Boolean(new RegExp(route, "g").exec(req.originalUrl))) || (params !== false)){
                if(typeof routes[key] == "string"){ //redirect to link or use the file
                    var routes_key = mustache.render(routes[key], params);
                    if(/^FILE /.exec(routes_key)){ //use or render by another file, if exist 200
                        var filepath = path.resolve(routes_key.slice(5));
                        if(fs.existsSync(filepath)) res.status(200);
                        req._filepath = req.filepath;
                        req._dirpath = req.dirpath;
                        req.filepath = filepath;
                        req.dirpath = path.dirname(filepath);
                    }else if(parseInt(routes_key.slice(0,3))){ // set http code and messages
                        if(res.status){
                            res.status(parseInt(routes_key.slice(0,3)));
                        }else{
                            res.statusCode = parseInt(routes_key.slice(0,3));
                        }
                        if(x.length >= 5) res.statusMessage = routes_key.slice(4);
                    }else{ // redirect to somewhere
                        if(res.redirect){
                            res.redirect(routes_key);
                        }else{
                            res.writeHead(300, "multiple choices", {
                                "Location": routes_key
                            });
                        }
                    }
                }else if(typeof routes[key] == "number"){ //set http status code
                    if(res.status){
                        res.status(parseInt(routes_key.slice(0,3)));
                    }else{
                        res.statusCode = parseInt(routes_key.slice(0,3));
                    }
                }else if(typeof routes[key] == "function"){ //do something with function
                    do_next = false;
                    req.routes = params;
                    routes[key](req,res,function(...args){req.routes = undefined; next.apply(global, args);});
                }
                break;
            }
        }
        if(do_next) next();
    }
}

module.exports = middleware;