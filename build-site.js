'use strict';

var nunjucks = require('nunjucks');
var fs       = require('fs');
var meta     = require('./meta.json');
var env      = new nunjucks.Environment(new nunjucks.FileSystemLoader("./templates"), {
    autoescape: true,
    throwOnUndefined: true
});
env.addFilter('safeName', function(str) {
    return str.toLowerCase()
        .replace(" ", "-")
        .replace(".", "-");
});

var html = env.render("index.html.tpl", {
    meta: meta
});
fs.writeFile("./index.html", html, function(err) {
    if(err) {
        return console.log(err);
    }
    
    var html = env.render("docs.html.tpl", {
        meta: meta
    });
    fs.writeFile("./docs.html", html, function(err) {
    
        var html = env.render("installing.html.tpl", {
            meta: meta
        });
        
        fs.writeFile("./installing.html", html, function(err) {
            console.log("Finished.");
        });
    });
});