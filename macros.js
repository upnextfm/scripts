/**
 * Script: Macros
 * Version: 1.2
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
        $api.each(groups, function(index, name) {
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
        
        $api.each(group.groups, function(index, name) {
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
        var tab  = $options.makeTab("Macros", "us-macros-tab", "book");
        var pane = $options.makePane("us-macros-pane", tab);
        $options.tabs().append(tab);
        $options.panes().append(pane);
        
        var title = $('<h4>Macros</h4>');
        pane.form.append(title);
        
        // Form
        pane.form.on("submit", function(e) {
            e.preventDefault();
        });
        pane.form.append(
            $options.makeInput("us-macros-input-trigger", "Trigger")
        );
        pane.form.append(
            $options.makeInput("us-macros-input-replacement", "Replacement")
        );
        pane.form.append($options.makeButtonGroup([
            {
                id: "us-macros-button-add",
                label: "Add"
            }
        ]));
        
        // Table
        var table = $('<table class="table table-striped table-condensed"/>');
        pane.form.append(table);
        
        var thead = $('<thead><tr><th>Delete</th><th>Trigger</th><th>Replacement</th></tr></thead>');
        table.append(thead);
        
        var tbody = $('<tbody id="us-macros-tbody"/>');
        table.append(tbody);
        $api.each(macros, function(replacement, trigger) {
            appendRow(replacement, trigger, tbody);
        });
        
        // Export & Import
        var export_button = $('<button id="us-macros-export-btn" class="btn btn-default">Export Macros</button>');
        var import_button = $('<button id="us-macros-import-btn" class="btn btn-default">Import Macros</button>');
        var textarea      = $('<textarea id="us-macros-export-textarea" class="form-control" rows="5"></textarea>');
        pane.form.append(export_button);
        pane.form.append(import_button);
        pane.form.append(textarea);
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
            $("#us-macros-tbody").append(row);
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
        var trigger         = $("#us-macros-input-trigger");
        var trigger_val     = trigger.val().trim();
        var replacement     = $("#us-macros-input-replacement");
        var replacement_val = replacement.val().trim();
        
        if (!trigger_val || !replacement_val) {
            return alert("Both values are required.");
        }
        if (!trigger_regex.test(trigger_val)) {
            return alert('Invalid trigger. Must start and end with @ and may not contain special characters.');
        }
        if (typeof macros[trigger_val] !== "undefined") {
            return alert("Trigger is already being used.");
        }
        
        macros[trigger_val] = replacement_val;
        $store.local.set("chat-macros", macros);
        appendRow(replacement_val, trigger_val);
        trigger.val("");
        replacement.val("");
    };
    
    /**
     * Exports the macros as a JSON string
     */
    var exportMacros = function() {
        $("#us-macros-export-textarea").text(JSON.stringify(macros, null, 2));
    };
    
    /**
     * Imports a JSON string as macros
     */
    var importMacros = function() {
        var text = $("#us-macros-export-textarea").val().trim();
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
        
        var tbody = $("#us-macros-tbody");
        tbody.empty();
        $api.each(imported, function(replacement, trigger) {
            appendRow(replacement, trigger);
            macros[trigger] = replacement;
        });
    };
    
    // Converts each of the user's macros into regex groups.
    $api.each(macros, function(replacement, trigger) {
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
        $("#us-macros-button-add").on("click", addMacro);
        $("#us-macros-export-btn").on("click", exportMacros);
        $("#us-macros-import-btn").on("click", importMacros);
    });
    
    // Called when the user sends a message. Process any macros found in
    // the message.
    $api.on("send", function(e, data) {
        $api.each(handlers, function(handler) {
            data.msg = parseMessage(handler.group, handler.value, data.msg);
        });
    });
})();