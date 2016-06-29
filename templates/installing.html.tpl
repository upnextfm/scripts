{% set active_sidebar_item = "installing" %}
{% extends "layout.html.tpl" %}
{% block content %}
    <ul id="scripts-list">
        <li class="script-item card">
            <h1>Installing Scripts</h1>
            <ol id="how-to-install">
                <li>
                    1. Find the script you want to install and click
                    <img src="images/copy_button.png" style="vertical-align: middle;margin: 0 6px;" />
                </li>
                <li>
                    2. From <a href="https://upnext.fm">upnext.fm</a> click on
                    <img src="images/site_options.png" style="vertical-align: middle;margin: 0 6px;" />
                    and then click <img src="images/site_scripting.png" style="vertical-align: middle;margin: 0 6px;" />
                </li>
                <li>
                    3. Finally click <img src="images/site_install_script.png" style="vertical-align: middle;margin: 0 6px;" />
                    and paste in the script URL that you copied in step 1, and press ENTER.
                </li>
            </ol>
        </li>
    </ul>

{% endblock %}