/**
 * Name: Macros
 * Version: 1.3
 *
 * Gives users the option to create macros, or "shortcuts" for long messages.
 *
 * Once the script is installed go to Options -> Macros to define macros.
 * Macros have two parts: a trigger and a replacement. An example trigger
 * is "@fire@" and the replacement is ":fire: :fire: :fire:". Once a macro
 * has been added using the trigger, you can type the trigger (e.g. "@fire@")
 * and it will be replaced by the replacement value.
 */
(function() {
    var macros = $store.local.get("chat-macros", {
        "@fire@"            : ":fire: :fire: :fire: :fire: :fire:",
        "@west@"            : "West coast is best coast.",
        "@bye@"             : "See ya! :taeyang:",
        "@love {username}@" : "<3 <3 <3 {username} <3 <3 <3"
    });
    
    var handlers       = [];
    var options        = null;
    var trigger_regex  = new RegExp("^@[a-z0-9\\s{}]+@$", "i");
    var variable_regex = new RegExp("{([^\\s]+)}", "g");
    
    /**
     * Converts the given trigger into a regular expression group
     * 
     * @param trigger
     * @returns {{regex: RegExp, groups: {}}}
     */
    var createRegexGroup = function(trigger) {
        var groups  = {};
        var counter = 1;
        var matches = variable_regex.exec(trigger);
        while(matches !== null) {
            groups[matches[1]] = counter;
            matches = variable_regex.exec(trigger);
            counter++;
        }
        
        var regex = trigger;
        $each(groups, function(index, name) {
            regex = regex.replace("{" + name + "}", "([^\\s]+)");
        });
        
        return {
            regex: new RegExp(regex),
            groups: groups
        };
    };
    
    /**
     * Parses the given message using the given regex group
     * 
     * @param group
     * @param replacement
     * @param message
     * @returns {*}
     */
    var parseMessage = function(group, replacement, message) {
        var matches = group.regex.exec(message);
        if (matches === null) {
            return message;
        }
    
        $each(group.groups, function(index, name) {
            replacement = replacement.replace("{" + name + "}", matches[index]);
        });
        
        return message.replace(group.regex, replacement);
    };
    
    /**
     * Deletes the macro with the given trigger
     * 
     * @param trigger
     */
    var deleteMacro = function(trigger) {
        delete macros[trigger];
        $store.local.set("chat-macros", macros);
    };
    
    /**
     * Adds the "Macros" tab/pane to the Options dialog
     */
    var addOptions = function() {
        options = $options.create("Macros", "macros", "book");
        options.title("Macros").on("submit", function() {
            return false;
        });
        
        options.add("text", "macros-input-trigger", {
            label: "Trigger",
            help: "The string that triggers the macro, e.g. @sometext@."
        });
        
        options.add("text", "macros-input-replacement", {
            label: "Replacement",
            help: "The string that replaces the trigger."
        });
        
        options.add("button", "macros-button-add", {
            label: "Add",
            icon: "plus"
        }).on("click", addMacro);
        
        var table = $('<table class="table table-striped table-condensed"/>');
        options.append(table);
        
        var thead = $('<thead><tr><th>Delete</th><th>Trigger</th><th>Replacement</th></tr></thead>');
        table.append(thead);
        
        var tbody = $('<tbody id="macros-tbody"/>');
        table.append(tbody);
        $each(macros, function(replacement, trigger) {
            appendRow(replacement, trigger, tbody);
        });
        
        options.add("button-group", [
            {
                id: "macros-export-btn",
                label: "Export Macros",
                on: {
                    click: exportMacros
                }
            },
            {
                id: "macros-import-btn",
                label: "Import Macros",
                on: {
                    click: importMacros
                }
            }
        ], {full_width: true});
        
        options.add("textarea", "macros-export-textarea", {
            attr: {
                rows: 5
            }
        });
    };
    
    /**
     * Appends a macro to the macros table
     * 
     * @param replacement
     * @param trigger
     * @param [tbody]
     */
    var appendRow = function(replacement, trigger, tbody) {
        var row = $('<tr/>');
        if (tbody) {
            tbody.append(row);
        } else {
            $("#macros-tbody").append(row);
        }
        
        var delete_button = $('<button class="btn btn-xs btn-danger" title="Delete"><span class="glyphicon glyphicon-trash"></span></button>');
        delete_button.on("click", function() {
            deleteMacro(trigger);
            row.fadeOut();
        });
        
        var td = $('<td/>');
        td.append(delete_button);
        row.append(td);
        
        td = $('<td/>');
        td.text(trigger);
        row.append(td);
        
        td = $('<td/>');
        td.text(replacement);
        row.append(td);
    };
    
    /**
     * Called when the "Add" button is clicked in the macros dialog
     */
    var addMacro = function() {
        var trigger     = options.val("macros-input-trigger").trim();
        var replacement = options.val("macros-input-replacement").trim();
        if (!trigger || !replacement) {
            return alert("Both values are required.");
        }
        if (!trigger_regex.test(trigger)) {
            return alert('Invalid trigger. Must start and end with @ and may not contain special characters.');
        }
        if (typeof macros[trigger] !== "undefined") {
            return alert("Trigger is already being used.");
        }
        
        macros[trigger] = replacement;
        $store.local.set("chat-macros", macros);
        appendRow(replacement, trigger);
        options.clear("macros-input-trigger");
        options.clear("macros-input-replacement");
    };
    
    /**
     * Exports the macros as a JSON string
     */
    var exportMacros = function() {
        options.val("macros-export-textarea", JSON.stringify(macros, null, 2));
    };
    
    /**
     * Imports a JSON string as macros
     */
    var importMacros = function() {
        var text = options.val("macros-export-textarea").trim();
        if (!text) {
            return;
        }
        
        try {
            var imported = JSON.parse(text);
        } catch (e) {
            return alert(e);
        }
        
        $store.local.set("chat-macros", imported);
        macros = {};
        
        var tbody = $("#macros-tbody");
        tbody.empty();
        $each(imported, function(replacement, trigger) {
            appendRow(replacement, trigger);
            macros[trigger] = replacement;
        });
        options.clear("macros-export-textarea");
    };
    
    // Converts each of the user's macros into regex groups.
    $each(macros, function(replacement, trigger) {
        if (!trigger_regex.test(trigger)) {
            console.error('Trigger not delimited with @ character or using special characters. Got "' + trigger + '"');
            return;
        }
        handlers.push({
            value: replacement,
            group: createRegexGroup(trigger)
        });
    });
    
    // Called when the chat api is loaded.
    $api.on("loaded", function() {
        addOptions();
    });
    
    // Called when the user sends a message. Process any macros found in
    // the message.
    $api.on("send", function(e, data) {
        $each(handlers, function(handler) {
            data.msg = parseMessage(handler.group, handler.value, data.msg);
        });
    });
})();