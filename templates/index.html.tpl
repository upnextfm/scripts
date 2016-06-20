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
    </head>
    <body>
    <div id="main">
        <header>
            <img src="images/logo.png" />
            <h1>Official upnext.fm user scripting repository and documentation.</h1>
        </header>
        <p>
            Click the name of the script from the list below to get the code. From upnext.fm, click on
            <code>Options</code> and then <code>Scripting</code>. Paste
            the code into your scripts box. When adding scripts to your user scripts, you should create a new file for each script.
            Click the <code>New File</code> button, which will create a new file where you paste the script.
        </p>
        <div class="screenshot">
            <img src="images/scripting_box.png" alt="Scripting box screenshot" />
            <small>
                Find the scripting box by clicking Options and then Scripting.
            </small>
        </div>
        
        <ul id="scripts-list">
            {% for filename, script in meta %}
                <li id="script-{{ filename|safeName }}" class="script-item card">
                    <div class="script-header">
                        <h2>
                            <a href="{{ filename }}">{{ script.name }}</a>
                            <a href="#script-{{ filename|safeName }}" class="glyphicon glyphicon-link" title="Permalink"></a>
                        </h2>
                        <ul class="scripts-meta-list">
                            <li><strong>Version:</strong> {{ script.version }}</li>
                            <li><strong>Author:</strong> {{ script.author }}</li>
                        </ul>
                        <div class="input-group">
                            <input value="{{ script.source }}" type="text" class="form-control" readonly />
                            <span class="input-group-btn">
                                <button class="btn btn-default btn-copy" type="button">Copy</button>
                            </span>
                        </div>
                    </div>
                    <p>{{ script.description }}</p>
                    
                    {% if script.screenshots|length > 0 %}
                        {% for screenshot in script.screenshots %}
                            <div class="screenshot">
                                <img src="{{ screenshot.src }}" alt="Screenshot" />
                                <small>{{ screenshot.description }}</small>
                            </div>
                        {% endfor %}
                    {% endif %}
                    
                    <a href="#main" class="top">
                        <span class="glyphicon glyphicon-chevron-up"></span>
                        Back to Top
                    </a>
                </li>
            {% endfor %}
        </ul>
    </div>
    <footer>
        <p>Copyright © 2016 upnext.fm</p>
        <p>
            <a href="https://upnext.fm">upnext.fm</a> &middot;
            <a href="https://github.com/upnextfm/scripts">GitHub</a> &middot;
            <a href="meta.json">meta.json</a> &middot;
            <a href="https://upnext.fm/contact">Contact</a>
        </p>
    </footer>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
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