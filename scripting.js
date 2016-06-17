/**
 * Script: Scripting Utils
 * Version: 1.1
 * Import: https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.3/ace.js
 * 
 * Turns each script editor into a full IDE, and adds a "Scripting" button
 * to the site navigation bar.
 */
(function() {
    var editors     = {};
    var theme       = $api.getStorage("scripting_utils_theme", "ace/theme/monokai");
    var font_size   = $api.getStorage("scripting_utils_font_size", "14");
    var tab_size    = $api.getStorage("scripting_utils_tab_size", "4");
    var soft_tabs   = $api.getStorage("scripting_utils_soft_tabs", "1");
    var show_gutter = $api.getStorage("scripting_utils_show_gutter", "1");
    
    var createSettingsModal = function() {
        return $(
            '<div id="script-utils-settings-modal" class="modal fade" style="z-index: 3000;" role="dialog">' +
                '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                        '<div class="modal-header">' +
                            '<h4 class="modal-title">Editor Settings</h4>' +
                        '</div>' +
                        '<div class="modal-body">' +
                            createThemeOptions() +
                            createFontOptions() +
                            createGutterOptions() +
                            createTabOptions() +
                        '</div>' +
                        '<div class="modal-footer">' +
                            '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );
    };
    
    var createOptionsForm = function() {
        return $('<form id="scripting-utils-options-form" class="form-inline" style="float: left; width: 50%; text-align: left;"/>');
    };
    
    var createThemeOptions = function() {
        return '<div class="form-group">' +
                '<label for="scripting-utils-theme-select">Theme</label>' +
                '<select class="form-control" id="scripting-utils-theme-select" size="1">' +
                    '<optgroup label="Bright"><option value="ace/theme/chrome">Chrome</option><option value="ace/theme/clouds">Clouds</option><option value="ace/theme/crimson_editor">Crimson Editor</option><option value="ace/theme/dawn">Dawn</option><option value="ace/theme/dreamweaver">Dreamweaver</option><option value="ace/theme/eclipse">Eclipse</option><option value="ace/theme/github">GitHub</option><option value="ace/theme/iplastic">IPlastic</option><option value="ace/theme/solarized_light">Solarized Light</option><option value="ace/theme/textmate">TextMate</option><option value="ace/theme/tomorrow">Tomorrow</option><option value="ace/theme/xcode">XCode</option><option value="ace/theme/kuroir">Kuroir</option><option value="ace/theme/katzenmilch">KatzenMilch</option><option value="ace/theme/sqlserver">SQL Server</option></optgroup>' +
                    '<optgroup label="Dark"><option value="ace/theme/ambiance">Ambiance</option><option value="ace/theme/chaos">Chaos</option><option value="ace/theme/clouds_midnight">Clouds Midnight</option><option value="ace/theme/cobalt">Cobalt</option><option value="ace/theme/idle_fingers">idle Fingers</option><option value="ace/theme/kr_theme">krTheme</option><option value="ace/theme/merbivore">Merbivore</option><option value="ace/theme/merbivore_soft">Merbivore Soft</option><option value="ace/theme/mono_industrial">Mono Industrial</option><option value="ace/theme/monokai">Monokai</option><option value="ace/theme/pastel_on_dark">Pastel on dark</option><option value="ace/theme/solarized_dark">Solarized Dark</option><option value="ace/theme/terminal">Terminal</option><option value="ace/theme/tomorrow_night">Tomorrow Night</option><option value="ace/theme/tomorrow_night_blue">Tomorrow Night Blue</option><option value="ace/theme/tomorrow_night_bright">Tomorrow Night Bright</option><option value="ace/theme/tomorrow_night_eighties">Tomorrow Night 80s</option><option value="ace/theme/twilight">Twilight</option><option value="ace/theme/vibrant_ink">Vibrant Ink</option></optgroup>' +
                '</select>' +
            '</div>';
    };
    
    var createFontOptions = function() {
        return '<div class="form-group">' +
                '<label for="script-utils-font-size-select">Font Size</label>' +
                '<select class="form-control" id="script-utils-font-size-select">' +
                    '<option value="8">8px</option>' +
                    '<option value="10">10px</option>' +
                    '<option value="12">12px</option>' +
                    '<option value="13">13px</option>' +
                    '<option value="14">14px</option>' +
                    '<option value="15">15px</option>' +
                    '<option value="16">16px</option>' +
                    '<option value="17">17px</option>' +
                    '<option value="18">18px</option>' +
                '</select>' +
            '</div>';
    };
    
    var createTabOptions = function() {
        return '<div class="form-group">' +
                '<label for="script-utils-tab-size-input">Tab Size</label>' +
                '<input type="text" class="form-control" id="script-utils-tab-size-input" style="width: 50px">' +
                '</div>' +
                '<div class="form-group">' +
                '<label for="script-utils-soft-tabs-select">Soft Tabs</label>' +
                '<select class="form-control" id="script-utils-soft-tabs-select">' +
                    '<option value="0">Off</option>' +
                    '<option value="1">On</option>' +
                '</select>' +
            '</div>'
    };
    
    var createGutterOptions = function() {
        return '<div class="form-group">' +
                '<label for="script-utils-gutter-select">Gutter</label>' +
                '<select class="form-control" id="script-utils-gutter-select">' +
                    '<option value="0">Off</option>' +
                    '<option value="1">On</option>' +
                '</select>' +
            '</div>';
    };
    
    var createFindOptions = function() {
        return $(
            '<div class="form-group">' +
                '<input type="text" class="form-control" id="script-utils-find-input" placeholder="Find...">' +
                '<input type="text" class="form-control" id="script-utils-replace-input" style="margin-left: 6px;" placeholder="Replace...">' +
                '<button class="btn btn-default" id="script-utils-find-button" style="margin-left: 6px;">Find</button>' +
                '<button class="btn btn-default" id="script-utils-replace-button">Find &amp; Replace</button>' +
            '</div>'
        );
    };
    
    var createSeparator = function() {
        return $(
            '<div style="display:inline-block;height: 10px;margin: 0 9px;border-right: 1px solid #ffffff;"/>'
        );
    };
    
    var findInActiveEditor = function(needle) {
        $(".user-scripting-pre").each(function(i, pre) {
            var name = $(pre).data("name");
            if (editors[name] != undefined) {
                editors[name].find(needle);
            }
        });
    };
    
    var replaceInActiveEditor = function(needle, replacement) {
        $(".user-scripting-pre").each(function(i, pre) {
            var name = $(pre).data("name");
            if (editors[name] != undefined) {
                editors[name].find(needle);
                editors[name].replace(replacement);
            }
        });
    };
    
    $("#nav-tab-scripting").remove();
    var tab  = $('<li/>');
    $("#navbar-primary").append(tab);
    tab.attr("id", "nav-tab-scripting");
    
    var anchor = $('<a/>');
    tab.append(anchor);
    
    anchor.attr("id", "nav-tab-scripting-anchor");
    anchor.attr("href", "#");
    anchor.text("Scripting");
    anchor.on("click", function(e) {
        $("#useroptions").modal("show");
        $("#us-scripting-tab a").tab("show");
        e.preventDefault();
    });
    
    var scripting_box = $("#us-scripting");
    scripting_box.on("expanded.scripting", function() {
        $api.each(editors, function(editor) {
            editor.resize();
        });
    
        $("#scripting-utils-options-form").remove();
        var form = createOptionsForm();
        $("#user-scripting-modal-footer").prepend(form);
        
        var settings_button = $('<button class="btn btn-default" id="script-utils-settings-button">Settings</button>');
        settings_button.on("click", function(e) {
            $("#script-utils-settings-modal").modal("show");
            e.preventDefault();
        });
        
        form.append(createFindOptions());
        form.append(createSeparator());
        form.append(settings_button);
        
        var theme_select = $("#scripting-utils-theme-select");
        theme_select.val(theme);
        theme_select.on("change.scripting_utils", function() {
            var t = $(this).val();
            $api.each(editors, function(editor) {
                editor.setTheme(t);
            });
            $api.setStorage("scripting_utils_theme", t);
            theme = t;
        });
        
        var gutter_select = $("#script-utils-gutter-select");
        gutter_select.val(show_gutter);
        gutter_select.on("change.scripting_utils", function() {
            var t = $(this).val();
            $api.each(editors, function(editor) {
                editor.renderer.setShowGutter(t == "1");
            });
            $api.setStorage("scripting_utils_show_gutter", t);
            show_gutter = t;
        });
        
        var font_size_select = $("#script-utils-font-size-select");
        font_size_select.val(font_size);
        font_size_select.on("change.scripting_utils", function() {
            var t = $(this).val();
            $(".user-scripting-pre").each(function() {
                console.log($(this));
                $(this).css("font-size", t + "px");
            });
            $api.setStorage("scripting_utils_font_size", t);
            font_size = t;
        });
        
        var tab_size_input = $("#script-utils-tab-size-input");
        tab_size_input.val(tab_size);
        tab_size_input.on("change.scripting_utils", function() {
            var t = $(this).val();
            $api.each(editors, function(editor) {
                editor.getSession().setTabSize(t);
            });
            $api.setStorage("scripting_utils_tab_size", t);
            tab_size = t;
        });
        
        var soft_tabs_select = $("#script-utils-soft-tabs-select");
        soft_tabs_select.val(soft_tabs);
        soft_tabs_select.on("change.scripting_utils", function() {
            var t = $(this).val();
            $api.each(editors, function(editor) {
                editor.getSession().setUseSoftTabs(t == "1");
            });
            $api.setStorage("scripting_utils_soft_tabs", t);
            soft_tabs = t;
        });
        
        var find_input = $("#script-utils-find-input");
        find_input.on("keyup.scripting_utils", function(e) {
            if (e.keyCode == 13) {
                findInActiveEditor(find_input.val());
            }
        });
        
        var find_button = $("#script-utils-find-button");
        find_button.on("click.scripting_utils", function(e) {
            findInActiveEditor(find_input.val());
            e.preventDefault();
        });
    
        var replace_input  = $("#script-utils-replace-input");
        var replace_button = $("#script-utils-replace-button");
        replace_button.on("click.scripting_utils", function(e) {
            replaceInActiveEditor(find_input.val(), replace_input.val());
            e.preventDefault();
        });
    });
    
    $("#script-utils-settings-modal").remove();
    $("#mainpage").append(createSettingsModal());
    
    scripting_box.on("shrunk.scripting", function() {
        $api.each(editors, function(editor) {
            editor.resize();
        });
    });
    
    $api.on("reloading", function() {
        $(".user-scripting-pre").each(function() {
            var target = $(this),
                name   = target.data("name");
            
            var textarea = $('<textarea/>');
            textarea.addClass('form-control user-scripting-textarea');
            textarea.attr("rows", 20);
            textarea.data("name", name);
            textarea.val(editors[name].getValue());
            
            editors[name] = null;
            target.replaceWith(textarea);
        });
        
        editors = {};
    });
    
    $api.on("loaded", function() {
        $(".user-scripting-textarea").each(function() {
            var target = $(this),
                value  = target.val(),
                name   = target.data("name");

            var pre = $('<pre/>');
            pre.addClass("user-scripting-pre");
            pre.data("name", name);
            pre.css("font-size", font_size + "px");
            pre.text(value);
            
            editors[name] = ace.edit(pre[0]);
            editors[name].setTheme(theme);
            editors[name].getSession().setMode("ace/mode/javascript");
            editors[name].getSession().setTabSize(tab_size);
            editors[name].getSession().on("change", function() {
                $api._scripts_changed = true;
            });
    
            $api._scripts[name] = new UserScript(name, function() {
                return editors[name].getValue();
            });
        
            target.replaceWith(pre);
        });
    });
})();