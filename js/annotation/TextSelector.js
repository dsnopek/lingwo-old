
require.def('lingwo_dictionary/annotation/TextSelector',
    ['lingwo_dictionary/util/declare'],
    function (declare) {
        function getCharIndex(node) {
            var classes = node.className.split(' '), id, i, match;
            for (i = 0; i < classes.length; i++) {
                if (match = /c-(\d+)/.exec(classes[i])) {
                    id = parseInt(match[1]);
                    break;
                }
            }
            return id;
        };

        return declare({
            _constructor: function (node) {
                var self = this;

                this.node = node;
                this._setupChars();

                // some hacks to disable selection
                if (typeof node.onselectstart !== 'undefined') {
                    node.onselectstart = function () {return false};
                }
                else if (typeof node.style.MozUserSelect != 'undefined') {
                    node.style.MozUserSelect = 'none';
                }

                $(node)
                    .bind('mousedown', function (evt) { self._onMouseDown(evt); })
                    .bind('mouseup', function (evt) { self._onMouseUp(evt); })
                    .bind('mouseover', function (evt) { self._onMouseOver(evt); });

                $('body').bind('mousedown', function (evt) {
                    if (!$(evt.target).hasClass('c')) self.clearSelection();
                });

                this.clickedNode = null;
                this.selStart = null;
                this.selEnd = null;
            },

            _setupChars: function () {
                var charIndex = 0;
                function splitChars(node) {
                    var childNode = node.firstChild, i, charNode, text, processed;
                    while(childNode) {
                        processed = false;

                        if (childNode.nodeType == 3) {
                            // if its a TEXT_NODE
                            text = childNode.data;
                            for(i = 0; i < text.length; i++) {
                                charNode = document.createElement('span');
                                charNode.className = 'c c-'+charIndex;
                                charNode.innerHTML = text.substr(i, 1);

                                charIndex++;
                                node.insertBefore(charNode, childNode);
                            }

                            processed = childNode
                        }
                        else if (childNode.nodeType == 1) {
                           // if its an ELEMENT_NODE
                           splitChars(childNode);
                        }

                        // go to the next child, possibly removing the processed node
                        childNode = childNode.nextSibling;
                        if (processed) node.removeChild(processed);
                    }
                }

                // put every character into its own span
                splitChars(this.node);
            },

            clearSelection: function () {
                // drop currently selected items
                $('.c.selected', this.node).removeClass('selected');

                this.clickedNode = null;
                this.selStart = null;
                this.selEnd = null;
            },

            _onMouseDown: function (evt) {
                var target = $(evt.target);

                this.clearSelection();

                if (target.hasClass('c')) {
                    target.addClass('selected');
                    this.clickedNode = evt.target;
                    this.selStart = getCharIndex(evt.target);
                    this.selEnd = getCharIndex(evt.target);
                };

                return false;
            },

            _onMouseUp: function (evt) {
                this.clickedNode = null;
                this.clicked = false;
            },

            _onMouseOver: function (evt) {
                if (!this.clickedNode) return;

                var target = $(evt.target), indexes, lowerBound, upperBound;
                if (target.hasClass('c') && evt.target !== this.clickedNode) {
                    indexes = [getCharIndex(this.clickedNode), getCharIndex(evt.target)];
                    lowerBound = Math.min(indexes[0], indexes[1]);
                    upperBound = Math.max(indexes[0], indexes[1]);

                    // drop currently selected items
                    $('.c.selected', this.node).removeClass('selected');

                    // select the current items
                    $('.c', this.node).each(function (i, node) {
                        var charIndex = getCharIndex(node);
                        if (charIndex >= lowerBound && charIndex <= upperBound) {
                            $(node).addClass('selected');
                        }
                    });

                    this.selStart = lowerBound;
                    this.selEnd = upperBound;

                    return false;
                }
            },
        });
     }
);

