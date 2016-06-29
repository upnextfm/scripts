{% macro top() %}
    <a href="#top" class="top">
        <span class="glyphicon glyphicon-chevron-up"></span>
        Back to Top
    </a>
{% endmacro %}
{% set active_sidebar_item = "docs" %}
{% extends "layout.html.tpl" %}
{% block content %}
    <div id="docs-container">
        <section class="card">
            {% include "docs_api.html.tpl" %}
            {{ top() }}
        </section>
        <section class="card">
            {% include "docs_properties.html.tpl" %}
            {{ top() }}
        </section>
        <section class="card">
            {% include "docs_events.html.tpl" %}
            {{ top() }}
        </section>
        <section class="card">
            {% include "docs_methods.html.tpl" %}
            {{ top() }}
        </section>
        <section class="card">
            {% include "docs_examples.html.tpl" %}
            {{ top() }}
        </section>
    </div>
{% endblock %}