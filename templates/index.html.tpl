{% include "head.html.tpl" %}
    <div id="content">
        <div class="content-box" style="margin-top: 20px; margin-bottom: 40px;">
            <h2>How to Install</h2>
            <ol id="how-to-install">
                <li>
                    1. Find the script you want to install and click
                    <img src="images/copy_button.png" style="vertical-align: middle;margin: 0 6px;" />
                </li>
                <li>
                    2. From <a href="https://upnext.fm">upnext.fm</a> click on
                    <img src="images/site_options.png" style="vertical-align: middle;margin: 0 6px;" />
                    and then click <img src="images/site_scripting.png" style="vertical-align: middle;margin: 0 6px;" />.
                </li>
                <li>
                    3. Finally click <img src="images/site_install_script.png" style="vertical-align: middle;margin: 0 6px;" />
                    and paste in the script URL that you copied in step 1, and press ENTER.
                </li>
            </ol>
        </div>
        <div class="content-box" style="margin-top: 20px;">
            <h2>Scripts</h2>
        </div>
        <ul id="scripts-list">
            {% for filename, script in meta %}
                <li id="script-{{ filename|safeName }}" class="script-item card">
                    <div class="script-header">
                        <h2>
                            <a href="{{ script.source }}">{{ script.name }}</a>
                            <a href="#script-{{ filename|safeName }}" class="glyphicon glyphicon-link pull-right" title="Permalink"></a>
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

                    <a href="#head" class="top">
                        <span class="glyphicon glyphicon-chevron-up"></span>
                        Back to Top
                    </a>
                </li>
            {% endfor %}
        </ul>
    </div>
{% include "foot.html.twig" %}