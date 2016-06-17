/**
 * Script: Scripting Utils
 * Version: 1.0
 * 
 * Currently only adds a "Scripting" button in the site navigation bar, which options
 * up the scripting pane in full screen.
 */
(function() {
    $("#nav-tab-scripting").remove();
    
    var tab  = $('<li/>');
    $("#navbar-primary").append(tab);
    tab.attr("id", "nav-tab-scripting");
    
    var anchor = $('<a/>');
    tab.append(anchor);
    
    anchor.attr("id", "nav-tab-scripting-anchor");
    anchor.attr("href", "#");
    anchor.text("Scripting");
    anchor.on("click", function() {
        $("#useroptions").modal("show");
        $("#us-scripting-tab a").tab("show");
        $("#user-scripting-expand-btn").click();
    });
})();