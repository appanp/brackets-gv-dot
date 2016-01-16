/*jslint regexp: true, vars: true*/
/*global define, $, brackets, console */

/* {graphviz-dot} SGraphviz dot Syntax Highlighting & Previewing
        v0.1.0 Written by Appan Ponnappan (SemOpSys)      */


define(function (require, exports, module) {
	'use strict';

	// For integration with Brackets' LanguageManager
	var LanguageManager = brackets.getModule("language/LanguageManager");
	var CodeMirror = brackets.getModule("thirdparty/CodeMirror2/lib/codemirror");

	CodeMirror.defineMode("Dot", function () {

		// Load Modules
		var ExtensionUtils = brackets.getModule("utils/ExtensionUtils");
		ExtensionUtils.loadStyleSheet(module, "styles/styles.css");

		return {
			token: function (stream, state) {
				// Check for State Changes
				// Program Start
				if (stream.match(/(strict\s+)?(graph|digraph)/)) {
					stream.skipToEnd();
					state.in_attr = false;
					return 'program_start';
				}

				// Keywords
				if (stream.match(/node|edge|subgraph/)) {
					stream.skipToEnd();
					return 'keyword';
				}
				if (stream.match('=')) {
					stream.skipToEnd();
					state.in_attr = true;
					return 'delimiter';
				}
				if (stream.match(/\{\[\}\];,/)) {
					stream.skipToEnd();
					return 'delimiter';
				}
				if (stream.match(/(<\-|\-\-|\->)/)) {
					stream.skipToEnd();
					return 'edge_arrow';
				}
				//Node Attribute keyword
				if (stream.match(/(bottomlabel|color|comment|distortion|fillcolor|fixedsize|fontcolor|fontname|fontsize|group|height|label|layer|orientation|peripheries|regular|shape|shapefile|sides|skew|style|toplabel|URL|width|z)/)) {
					state.in_attr = true;
					stream.skipToEnd();
					return 'attr_node';
				}
				//Edge attribute keyword
				if (stream.match(/(arrowhead|arrowsize|arrowtail|color|comment|constraint|decorate|dir|fontcolor|fontname|fontsize|headlabel|headport|headURL|label|labelangle|labeldistance|labelfloat|labelcolor|labelfontname|labelfontsize|layer|lhead|ltail|minlen|samehead|sametail|splines|style|taillabel|tailport|tailURL|weight)/)) {
					state.in_attr = true;
					stream.skipToEnd();
					return 'attr_edge';
				}
				//Graph attribute keyword
				if (stream.match(/(bgcolor|center|clusterrank|color|comment|compound|concentrate|fillcolor|fontname|fontpath|fontsize|label|labeljust|labelloc|layers|margin|mclimit|nodesep|nslimit|nslimit1|ordering|orientation|page|pagedir|quantum|rank|rankdir|ranksep|ratio|remincross|rotate|samplepoints|searchsize|size|style|URL)/)) {
					//state.in_attr = true;
					stream.skipToEnd();
					return 'attr_graph';
				}
				// Identifier
				if (!state.in_attr && stream.match(/([a-zA-Z\200-\377\\]+)/)) {
					stream.skipToEnd();
					return 'identifier';
				}
				//Attribute value
				if (state.in_attr && stream.match(/[^,\]]+/)) {
					state.in_attr = false;
					stream.skipToEnd();
					return 'attr_value';
				}
				// Strip Space
				if (stream.eatSpace()) {
					return null;
				}

				// Eat the rest!
				stream.eat(/./);
				return null;
			},
			startState: function () {
				return {
					inComment: false
				};
			}
		};
	});


	CodeMirror.defineMIME("text/vnd.graphviz", "Dot");

	// Register with Brackets
	LanguageManager.defineLanguage("Dot", {
		name: "Dot",
		mode: "Dot",
		fileExtensions: ["dot", "gv"],
		blockComment: ["/*", "*/"],
		lineComment: ["//"]
	});
	console.log("graphviz-dot syntax highlighting extension loaded");

});
