(function (win) {

    win.DocsifyCopyCodePlugin = {
        init: function () {
            return function (hook, vm) {
                hook.doneEach(function () {
                    var codeBlocks = document.querySelectorAll("pre[v-pre]");

                    for (var i = 0; i < codeBlocks.length; i++) {
                        var element = codeBlocks[i];
                        var button = document.createElement("button");
                        button.appendChild(document.createTextNode("Copy"));
                        button.classList.add("docsify-copy-code-button");

                        if (vm.config.themeColor) {
                            button.style.background = vm.config.themeColor;
                        }
                        button.ele = element;
                        button.addEventListener("click", function (event) {
                            var ele = this.ele;
                            var self = this;
                            var range = document.createRange();
                            var codeBlock = ele.querySelector("code");
                            range.selectNode(codeBlock);
                            window.getSelection().addRange(range);

                            try {
                                // Now that we've selected the anchor text, execute the copy command
                                var successful = document.execCommand("copy");
                                if (successful) {
                                    self.classList.add("success");
                                    setTimeout(function () {
                                        self.classList.remove("success");
                                    }, 1000);
                                }
                            } catch (err) {
                                self.classList.add("error");
                                setTimeout(function () {
                                    self.classList.remove("error");
                                }, 1000);
                            }

                            var selection = window.getSelection();
                            if (typeof selection.removeRange === "function") {
                                selection.removeRange(range);
                            } else if (typeof selection.removeAllRanges === "function") {
                                selection.removeAllRanges();
                            }
                        });

                        element.appendChild(button);
                    }
                });
            };
        }
    };
    $docsify.plugins = [].concat(window.DocsifyCopyCodePlugin.init(), $docsify.plugins);
})(window);