/*******************************************************************************
 * @license
 * Copyright (c) 2013,2014 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials are made 
 * available under the terms of the Eclipse Public License v1.0 
 * (http://www.eclipse.org/legal/epl-v10.html), and the Eclipse Distribution 
 * License v1.0 (http://www.eclipse.org/org/documents/edl-v10.html). 
 * 
 * Contributors:
 *    Ken Walker
 *******************************************************************************/

/*global define orion window document */
window.onload = function() {
    var scriptString = '<link rel="stylesheet" type="text/css" href="https://eclipse.org/orion/editor/releases/4.0/built-editor.css"/>\n<script src="https://eclipse.org/orion/editor/releases/4.0/built-editor.min.js">\n</script>\n<script>\n\trequire(["orion/editor/edit"], function(edit) {\n\t\tedit({className: "editor"});\n\t});\n</script>';
    var preCode = '<pre class="editor" data-editor-lang="js" data-editor-readonly="';
    var postCode = '</pre>';
    var readOnly = true;

    // create the plugin
    var headers = {
        name: 'Code Snippet Editor Plugin',
        version: '0.2',
        description: 'Creates an embedded text widget from code selection in the Editor'
    };

    // Create the provider basedon the headers
    var provider = new orion.PluginProvider(headers);

    // Create the service implementation for getting selected text
    var serviceImpl = {
        // ManagedService function for when the settings change
        updated: function(properties) {
            if (properties) {
                readOnly = JSON.parse(properties.readonly);
            }
        },
        run: function(selectedText, text, selection) {
            var codeSnippet;
            var selectionEmpty = selection.start === selection.end;
            if (selectionEmpty) {
                codeSnippet = text;
            } else {
                codeSnippet = selectedText;
            }
            var div = document.createElement('div');
            div.textContent = codeSnippet;
            var theCode = div.innerHTML;
            //TODO - With more options this is not really a reasonable way to do this
            var result = scriptString + '\n' + preCode + (readOnly ? 'true">' : 'false">') + '\n' + theCode + '\n' + postCode + '\n';
            return result;
        }
    };

    // Define the properties for this service, the button will appear with the name and hover help
    // Make sure the PID matches that in the settings otherwise the updated: function won't be called
    var serviceProperties = {
        name: 'Snippet',
        tooltip: 'Create a JavaScript Orion Editor Snippet for a Web Page',
        key: ['S', true, true], // Ctrl+Shift+S
        pid: 'snippet.editor'
    };

    // Register the Snippet service
    provider.registerServiceProvider(['orion.edit.command', 'orion.cm.managedservice'], serviceImpl, serviceProperties);

    // Create the properties for the Snippet plugin settings
    var serviceSettings = {
        settings: [{
            pid: 'snippet.editor',
            name: 'Snippet Settings',
            category: 'Snippet',
            tags: ['code'],
            properties: [{
                id: 'readonly',
                name: 'Read Only',
                type: 'boolean',
                defaultValue: true,
                options: [{
                    label: 'Create Snippet read only',
                    value: true
                }, {
                    label: 'Create Snippet editable',
                    value: false
                }]
            }]
        }]
    };

    // Register the service settings with the core service
    provider.registerService('orion.core.setting', {}, serviceSettings);

    provider.connect();
};