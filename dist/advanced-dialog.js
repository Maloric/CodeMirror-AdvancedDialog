"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
// Advanced dialog plugin written by Jamie Morris
// Open advanced dialogs on top of an editor. Relies on dialog.css.

(function (mod) {
    if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object" && (typeof module === "undefined" ? "undefined" : _typeof(module)) == "object") // CommonJS
        mod(require("codemirror"));else if (typeof define == "function" && define.amd) // AMD
        define(["codemirror"], mod);else // Plain browser env
        mod(CodeMirror);
})(function (CodeMirror) {
    var createPanel = function createPanel(cm, template, bottom) {
        var el = document.createElement("div");
        el.className = 'CodeMirror-advanced-dialog';

        if (typeof template == "string") {
            el.innerHTML = template;
        } else {
            // Assuming it's a detached DOM element.
            el.appendChild(template);
        }
        var panel = cm.addPanel(el, {
            position: bottom ? "bottom" : "top"
        });
        return panel;
    };

    var closePanel = function closePanel(cm) {
        var state = cm.state.advancedDialog;
        if (!state || !state.current) {
            return;
        }

        state.current.panel.clear();

        if (state.current.onClose) state.current.onClose(state.current.panel.node);
        delete state.current;
        cm.focus();
    };

    CodeMirror.defineExtension("openAdvancedDialog", function (template, options) {
        var _this = this;

        if (!this.addPanel) {
            throw "CodeMirror-AdvancedDialog requires the panel addon to be included in the page.  This can usually be found in the addons folder of the default CodeMirror installation, and must be included BEFORE the AdvancedDialog addon.";
        }
        if (!options) options = {};
        if (!this.state.advancedDialog) this.state.advancedDialog = {};

        if (this.state.advancedDialog.current) {
            closePanel(this);
        }

        var panel = createPanel(this, template, options.bottom);
        this.state.advancedDialog.current = {
            panel: panel,
            onClose: options.onClose
        };

        var inputs = panel.node.getElementsByTagName("input");
        var buttons = panel.node.getElementsByTagName("button");
        if (inputs && inputs.length > 0 && options.inputBehaviours) {
            var _loop = function _loop(i) {
                var behaviour = options.inputBehaviours[i];
                var input = inputs[i];
                if (behaviour.value) {
                    input.value = behaviour.value;
                }

                if (!!behaviour.focus) {
                    input.focus();
                }

                if (!!behaviour.selectValueOnOpen) {
                    input.select();
                }

                if (behaviour.onInput) {
                    CodeMirror.on(input, "input", function (e) {
                        behaviour.onInput(inputs, e);
                    });
                }

                if (behaviour.onKeyUp) {
                    CodeMirror.on(input, "keyup", function (e) {
                        behaviour.onKeyUp(inputs, e);
                    });
                }

                CodeMirror.on(input, "keydown", function (e) {
                    if (behaviour.onKeyDown && behaviour.onKeyDown(inputs, e)) {
                        return;
                    }

                    if (e.keyCode === 27 || !!behaviour.closeOnEnter && e.keyCode === 13) {
                        input.blur();
                        CodeMirror.e_stop(e);
                        closePanel(_this);
                    } else if (e.keyCode === 13 && behaviour.callback) {
                        behaviour.callback(inputs, e);
                    }
                });

                if (behaviour.closeOnBlur !== false) CodeMirror.on(input, "blur", function () {
                    closePanel(_this);
                });
            };

            for (var i = 0; i < options.inputBehaviours.length; i++) {
                _loop(i);
            }
        }

        if (buttons && buttons.length > 0 && options.buttonBehaviours) {
            var _loop2 = function _loop2(i) {
                var behaviour = options.buttonBehaviours[i];
                if (!!behaviour.callback) {
                    CodeMirror.on(buttons[i], "click", function (e) {
                        behaviour.callback(inputs, e);
                    });
                } else {
                    CodeMirror.on(buttons[i], "click", function () {
                        closePanel(_this);
                    });
                }
            };

            for (var i = 0; i < options.buttonBehaviours.length; i++) {
                _loop2(i);
            }
        }
        return function () {
            closePanel(_this);
        };
    });
});

//# sourceMappingURL=advanced-dialog.js.map