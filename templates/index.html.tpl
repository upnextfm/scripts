{% set active_sidebar_item = "scripts" %}
{% extends "layout.html.tpl" %}
{% block content %}
    <ul id="scripts-list">
        {% for filename, script in meta %}
            <li id="script-{{ filename|safeName }}" class="script-item card">
                <div class="script-header">
                    <h1>
                        <a href="{{ script.source }}">{{ script.name }}</a>
                        <a href="#script-{{ filename|safeName }}" class="glyphicon glyphicon-link pull-right" title="Permalink"></a>
                    </h1>
                    <ul class="scripts-meta-list">
                        <li><strong>Version:</strong> {{ script.version }}</li>
                        <li><strong>Author:</strong> {{ script.author }}</li>
                        <li><strong>Checksum:</strong> {{ script.checksum }}</li>
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
    
                <a href="#top" class="top">
                    <span class="glyphicon glyphicon-chevron-up"></span>
                    Back to Top
                </a>
            </li>
        {% endfor %}
    </ul>
{% endblock %}