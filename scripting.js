/**
 * Script: Scripting Utils
 * Version: 1.0
 * Import: https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.3/ace.js
 * 
 * Turns each script editor into a full IDE, and adds a "Scripting" button
 * to the site navigation bar.
 */
(function() {
    var editors = {};
    
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
    });
    scripting_box.on("shrunk.scripting", function() {
        $api.each(editors, function(editor) {
            editor.resize();
        });
    });
    
    $api.on("save_scripts", function(e, data) {
        data.scripts = [];
        $api.each(editors, function(editor, name) {
            data.scripts.push({
                name: name,
                script: editor.getValue()
            });
        });
    });
    
    $(".user-scripting-textarea").each(function() {
        var target = $(this),
            value  = target.val(),
            name   = target.data("name");
        
        var pre = $('<pre/>');
        pre.addClass("user-scripting-pre");
        pre.data("name", name);
        pre.text(value);
        
        editors[name] = ace.edit(pre[0]);
        editors[name].setTheme("ace/theme/monokai");
        editors[name].getSession().setMode("ace/mode/javascript");
        
        target.replaceWith(pre);
    });
})();