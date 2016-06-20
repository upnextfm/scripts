<!DOCTYPE html>
<html lang="en">
    <head>
        <title>upnext.fm user scripts</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="Official upnext.fm user scripting repository and documentation.">
        <link href="favicon.ico" rel="shortcut icon" type="image/x-icon">
        <link href="favicon.ico" rel="icon" type="image/x-icon">
        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
        <link href="assets/site.css" rel="stylesheet">
        <link href="assets/prism.css" rel="stylesheet">
    </head>
    <body>
    <div id="main">
        <header>
            <img src="images/logo.png" />
            <h1>Official upnext.fm user script repository and documentation.</h1>
        </header>

        <!-- Nav tabs -->
        <ul class="nav nav-tabs" role="tablist">
            <li role="presentation" class="active">
                <a href="#scripts" aria-controls="home" role="tab" data-toggle="tab">Scripts</a>
            </li>
            <li role="presentation">
                <a href="#docs" aria-controls="profile" role="tab" data-toggle="tab">Documentation</a>
            </li>
        </ul>
        
        <div class="tab-content">
            <div role="tabpanel" class="tab-pane fade in active" id="scripts">
                {% include "scripts.html.tpl" %}
            </div>

            <div role="tabpanel" class="tab-pane fade" id="docs">
                {% include "docs.html.tpl" %}
            </div>
            <div style="clear: left;"></div>
        </div>
    </div>
    <footer>
        <p>Copyright © 2016 upnext.fm</p>
        <p>
            <a href="https://upnext.fm">upnext.fm</a> &middot;
            <a href="https://github.com/upnextfm/scripts">GitHub</a> &middot;
            <a href="meta.json">meta.json</a> &middot;
            <a href="https://upnext.fm/contact">Contact</a>
        </p>
        <p>
            <img src="images/logo-footer.png" />
        </p>
    </footer>
    
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
    <script src="assets/prism.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.5.10/clipboard.min.js"></script>
    <script>
        var url = document.location.toString();
        if (url.match('#')) {
            var part = url.split('#')[1];
            if (part.indexOf("topic-") !== -1 || part.indexOf("docs") !== -1) {
                $('.nav-tabs a[href="#docs"]').tab('show');
            } else {
                $('.nav-tabs a[href="#scripts"]').tab('show');
            }
        }
        $('.nav-tabs a').on('shown.bs.tab', function () {
            window.location.hash = "";
        });
        
        new Clipboard('.btn', {
            target: function(trigger) {
                return $(trigger).parents(".input-group").find("input")[0];
            }
        });
        //$(function() {
        //    $('.nav-tabs a[href="#docs"]').tab('show');
        //});
    </script>
    </body>
</html>