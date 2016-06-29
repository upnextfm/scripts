/**
 * Name: Scriptster
 * Version: 1.2
 * Import: https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.3/ace.js
 *
 * Turns the script editor into a full IDE and adds a "Scripting" button
 * to the site navigation bar.
 */
(function() {
    var DEFAULT_SETTINGS = {
        theme       : "ace/theme/monokai",
        font_size   : "14px",
        tab_size    : "4",
        soft_tabs   : "1",
        show_gutter : "1"
    };
    
    var editors       = {};
    var elements      = {settings:{}};
    var navbar        = $("#navbar-primary");
    var options_box   = $("#useroptions");
    var scripting_box = $("#us-scripting");
    var scripting_tab = $("#us-scripting-tab").find("a");
    var settings      = $store.local.get("scriptster_settings", {});
    $each(DEFAULT_SETTINGS, function(value, key) {
        if (settings[key] == undefined) {
            settings[key] = value;
        }
    });
    
    /**
     * Adds the "Scripting" button to the site navbar.
     */
    var initNavTab = function() {
        elements.nav = $('<li/>')
            .appendTo(navbar);
        elements.nav.attr("id", "nav-tab-scriptster");
        
        var anchor = $('<a/>')
            .appendTo(elements.nav);
        anchor.attr("id", "nav-tab-scripting-anchor");
        anchor.attr("href", "#");
        anchor.html('<span class="glyphicon glyphicon-flash"></span> Scripting');
        anchor.on("click", function(e) {
            options_box.modal("show");
            scripting_tab.tab("show");
            e.preventDefault();
        });
    };
    
    /**
     * Creates the settings modal and appends it to the page.
     */
    var initSettingsModel = function() {
        elements.modal = $(
            '<div id="scriptster-settings-modal" class="modal fade" style="z-index: 3000;" role="dialog">' +
                '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                        '<div class="modal-header">' +
                            '<h4 class="modal-title">Editor Settings</h4>' +
                        '</div>' +
                        '<div class="modal-body"></div>' +
                        '<div class="modal-footer">' +
                            '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );
        
        var modal_body = elements.modal.find(".modal-body");
        
        var setting_theme = $(
            '<div class="form-group">' +
                '<label for="scriptster-theme-select">Theme</label>' +
                '<select class="form-control" id="scriptster-theme-select" size="1">' +
                    '<optgroup label="Bright"><option value="ace/theme/chrome">Chrome</option><option value="ace/theme/clouds">Clouds</option><option value="ace/theme/crimson_editor">Crimson Editor</option><option value="ace/theme/dawn">Dawn</option><option value="ace/theme/dreamweaver">Dreamweaver</option><option value="ace/theme/eclipse">Eclipse</option><option value="ace/theme/github">GitHub</option><option value="ace/theme/iplastic">IPlastic</option><option value="ace/theme/solarized_light">Solarized Light</option><option value="ace/theme/textmate">TextMate</option><option value="ace/theme/tomorrow">Tomorrow</option><option value="ace/theme/xcode">XCode</option><option value="ace/theme/kuroir">Kuroir</option><option value="ace/theme/katzenmilch">KatzenMilch</option><option value="ace/theme/sqlserver">SQL Server</option></optgroup>' +
                    '<optgroup label="Dark"><option value="ace/theme/ambiance">Ambiance</option><option value="ace/theme/chaos">Chaos</option><option value="ace/theme/clouds_midnight">Clouds Midnight</option><option value="ace/theme/cobalt">Cobalt</option><option value="ace/theme/idle_fingers">idle Fingers</option><option value="ace/theme/kr_theme">krTheme</option><option value="ace/theme/merbivore">Merbivore</option><option value="ace/theme/merbivore_soft">Merbivore Soft</option><option value="ace/theme/mono_industrial">Mono Industrial</option><option value="ace/theme/monokai">Monokai</option><option value="ace/theme/pastel_on_dark">Pastel on dark</option><option value="ace/theme/solarized_dark">Solarized Dark</option><option value="ace/theme/terminal">Terminal</option><option value="ace/theme/tomorrow_night">Tomorrow Night</option><option value="ace/theme/tomorrow_night_blue">Tomorrow Night Blue</option><option value="ace/theme/tomorrow_night_bright">Tomorrow Night Bright</option><option value="ace/theme/tomorrow_night_eighties">Tomorrow Night 80s</option><option value="ace/theme/twilight">Twilight</option><option value="ace/theme/vibrant_ink">Vibrant Ink</option></optgroup>' +
                '</select>' +
            '</div>'
        ).appendTo(modal_body);
        elements.settings.theme = setting_theme.find("select:first");
        elements.settings.theme.val(settings.theme);
        
        var setting_font_size = $(
            '<div class="form-group">' +
                '<label for="scriptster-font-size-select">Font Size</label>' +
                '<select class="form-control" id="scriptster-font-size-select">' +
                    '<option value="8px">8px</option>' +
                    '<option value="10px">10px</option>' +
                    '<option value="12px">12px</option>' +
                    '<option value="13px">13px</option>' +
                    '<option value="14px">14px</option>' +
                    '<option value="15px">15px</option>' +
                    '<option value="16px">16px</option>' +
                    '<option value="17px">17px</option>' +
                    '<option value="18px">18px</option>' +
                '</select>' +
            '</div>'
        ).appendTo(modal_body);
        elements.settings.font_size = setting_font_size.find("select:first");
        elements.settings.font_size.val(settings.font_size);
        
        var setting_show_gutter = $(
            '<div class="form-group">' +
                '<label for="scriptster-gutter-select">Gutter</label>' +
                '<select class="form-control" id="scriptster-gutter-select">' +
                    '<option value="0">Off</option>' +
                    '<option value="1">On</option>' +
                '</select>' +
            '</div>'
        ).appendTo(modal_body);
        elements.settings.show_gutter = setting_show_gutter.find("select:first");
        elements.settings.show_gutter.val(settings.show_gutter);
        
        var setting_soft_tabs = $(
            '<div class="form-group">' +
                '<label for="scriptster-soft-tabs-select">Soft Tabs</label>' +
                '<select class="form-control" id="scriptster-soft-tabs-select">' +
                    '<option value="0">Off</option>' +
                    '<option value="1">On</option>' +
                '</select>' +
            '</div>'
        ).appendTo(modal_body);
        elements.settings.soft_tabs = setting_soft_tabs.find("select:first");
        elements.settings.soft_tabs.val(settings.soft_tabs);
        
        var setting_tab_size = $(
            '<div class="form-group">' +
                '<label for="scriptster-tab-size-input">Tab Size</label>' +
                '<input type="text" class="form-control" id="scriptster-tab-size-input" style="width: 50px">' +
            '</div>'
        ).appendTo(modal_body);
        elements.settings.tab_size = setting_tab_size.find("input:first");
        elements.settings.tab_size.val(settings.tab_size);
        
        $("#main").append(elements.modal);
    };
    
    /**
     * Replaces the default textareas with Ace editors.
     */
    var initEditors = function() {
        $(".user-scripting-textarea").each(function() {
            var target = $(this),
                name   = target.data("name");
        
            var pre = $('<pre/>')
                .addClass("user-scripting-pre")
                .data("name", name)
                .css("font-size", settings.font_size)
                .text(target.val());
            target.replaceWith(pre);
            
            editors[name] = ace.edit(pre[0]);
            editors[name].setTheme(settings.theme);
            editors[name].getSession().setMode("ace/mode/javascript");
            editors[name].getSession().setTabSize(settings.tab_size);
            editors[name].getSession().on("change", function() {
                $api._scripts_changed = true;
            });
            $api._scripts[name] = new UserScript(name, function() {
                return editors[name].getValue();
            });
        });
        
        scripting_box.on("expanded.scripting", function() {
            $each(editors, function (editor) {
                editor.resize();
            });
        });
        scripting_box.on("shrunk.scripting", function() {
            $each(editors, function(editor) {
                editor.resize();
            });
        });
    };
    
    /**
     * Adds the controls (find and replace, save, settings) to the scripting pane.
     */
    var initControls = function() {
        elements.controls = $('<div id="scriptster-controls"/>');
        
        var footer = $("#user-scripting-modal-footer");
        footer.empty().css("padding", "20px 0").prepend(elements.controls);
        
        elements.btn_settings = $('<button class="btn btn-default" type="button">Settings</button>')
            .appendTo(elements.controls);
        elements.btn_save  = $('<button class="btn btn-default" type="button">Save</button>')
            .appendTo(elements.controls);
        elements.form_find = $('<form id="scriptster-options-form" class="form-inline pull-left" style="text-align: left;"/>')
            .appendTo(elements.controls);
        
        $('<div class="form-group pull-left"/>')
            .appendTo(elements.form_find)
            .append(
            $('<input type="text" class="form-control input-scriptster-find" placeholder="Find...">'),
            $('<input type="text" class="form-control input-scriptster-replace" style="margin-left: 6px;" placeholder="Replace...">'),
            $('<button class="btn btn-default btn-scriptster-find" style="margin-left: 6px;">Find</button>'),
            $('<button class="btn btn-default btn-scriptster-replace">Find &amp; Replace</button>')
        );
    };
    
    /**
     * Registers event handlers.
     */
    var initEvents = function() {
        elements.btn_settings.on("click", function() {
            elements.modal.modal("show");
        });
        elements.btn_save.on("click", function() {
            $api._saveUserScripts(true);
        });
        
        elements.form_find.on("submit", function(e) {
            var target = $(this),
                btn    = target.find("button:focus");
            
            if (btn.is(".btn-scriptster-find")) {
                findInActiveEditor(target.find(".input-scriptster-find:first").val());
            } else if (btn.is(".btn-scriptster-replace")) {
                findInActiveEditor(
                    target.find(".input-scriptster-find:first").val(),
                    target.find(".input-scriptster-replace:first").val()
                );
            }
            
            e.preventDefault();
        });
        
        elements.settings.theme.on("change", function() {
            settings.theme = $(this).val();
            saveSettings();
        });
        elements.settings.font_size.on("change", function() {
            settings.font_size = $(this).val();
            saveSettings();
        });
        elements.settings.show_gutter.on("change", function() {
            settings.show_gutter = $(this).val();
            saveSettings();
        });
        elements.settings.soft_tabs.on("change", function() {
            settings.soft_tabs = $(this).val();
            saveSettings();
        });
        elements.settings.tab_size.on("change", function() {
            settings.tab_size = $(this).val();
            saveSettings();
        });
    };
    
    /**
     * Saves the current settings and updates the editors.
     */
    var saveSettings = function() {
        $store.local.set("scriptster_settings", settings);
        $each(editors, function(editor) {
            editor.setTheme(settings.theme);
            editor.renderer.setShowGutter(settings.show_gutter == "1");
            editor.getSession().setUseSoftTabs(settings.soft_tabs == "1");
            editor.getSession().setTabSize(settings.tab_size);
        });
        $(".user-scripting-pre").each(function() {
            $(this).css("font-size", settings.font_size);
        });
    };
    
    /**
     * Performs a find (or find & replace) on the active editor
     * 
     * @param needle      {String} The string to find
     * @param replacement {String} The replacement value
     */
    var findInActiveEditor = function(needle, replacement) {
        var pre  = $(".user-scripting-pre:visible");
        var name = pre.data("name");
        if (editors[name] != undefined) {
            editors[name].find(needle);
            if (replacement !== undefined) {
                editors[name].replace(replacement);
            }
        }
    };
    
    // Use the reloading event to remove the elements and events
    // we added to the page.
    $chat.on("reloading", function() {
        $each(elements, function(element, name) {
            if (name != "settings") {
                element.off();
            }
        });
        $each(elements.settings, function(element) {
            element.off();
        });
        elements.controls.remove();
        elements.nav.remove();
        elements.modal.remove();
    });
    
    // Start!
    $chat.on("loaded", function() {
        initNavTab();
        initSettingsModel();
        initEditors();
        initControls();
        initEvents();
    });
})();