/*******************************************************************************
 * @license
 * Copyright (c) 2013 IBM Corporation and others.
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
	var scriptString = '<link rel="stylesheet" type="text/css" href="http://eclipse.org/orion/editor/releases/2.0/built-editor.css"/>\n<script src="http://eclipse.org/orion/editor/releases/2.0/built-editor.min.js">\n</script>\n<script>\n\trequire(["orion/editor/edit"], function(edit) {\n\t\tedit({className: "editor"});\n\t});\n</script>';
	var preCode = '<pre class="editor" data-editor-lang="js" data-editor-readonly="true">';
	var postCode = '</pre>';
	
	// create the plugin
	var headers = {
		name: "Code Snippet Editor Plugin",
		version: "0.1",
		description: "Creates an embedded text widget from code selection in the Editor"
	};
	
    var provider = new orion.PluginProvider(headers);
    var serviceImpl = {
        run: function(selectedText, text, selection) {
            var codeSnippet;
            var selectionEmpty = selection.start === selection.end;
            if (selectionEmpty) {
                codeSnippet = text;
            } else {
                codeSnippet = selectedText;
            }
            var div = document.createElement("div");
            div.textContent = codeSnippet;
            var theCode = div.innerHTML;
            var result = scriptString + '\n' + preCode + '\n' + theCode + '\n' + postCode + '\n';
            return result;
        }
    };

    var serviceProperties = {
        name: 'Snippet',
        tooltip: 'Create a JavaScript Orion Editor Snippet for a Web Page',
        key: ['S', true, true] // Ctrl+Shift+S
    };
    provider.registerServiceProvider('orion.edit.command', serviceImpl, serviceProperties);
    provider.connect();
};