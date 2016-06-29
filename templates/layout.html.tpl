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
    <body id="top">
        <a href="https://github.com/upnextfm/scripts/fork">
            <img style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png">
        </a>
        <div class="row">
            {% include "sidebar.html.tpl" %}
            <div class="col-sm-6">
                {% block content %}{% endblock %}
            </div>
        </div>
        <footer>
            <p>Copyright &copy; 2016 upnext.fm</p>
            <p>
                <a href="https://upnext.fm">upnext.fm</a> &middot;
                <a href="https://github.com/upnextfm/scripts">GitHub</a> &middot;
                <a href="meta.json">meta.json</a> &middot;
                <a href="https://upnext.fm/contact">Contact</a>
            </p>
            <p><img src="images/logo-footer.png" /></p>
        </footer>
        
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
        <script src="assets/prism.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.5.10/clipboard.min.js"></script>
        <script>
            new Clipboard('.btn', {
                target: function(trigger) {
                    return $(trigger).parents(".input-group").find("input")[0];
                }
            });
        </script>
    </body>
</html>