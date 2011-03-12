
define(
    ['lingwo/util/declare','jquery'],
    function (declare, $) {
        function getCharIndex(node) {
            var id, match;
            if (node.id && (match = /c-(\d+)/.exec(node.id))) {
                id = parseInt(match[1]);
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
                    .bind('mousedown', function (evt) { if (self.activated) { self._onMouseDown(evt); }})
                    .bind('mouseup', function (evt) { if (self.activated) { self._onMouseUp(evt); }})
                    .bind('mouseover', function (evt) { if (self.activated) { self._onMouseOver(evt); }});

                $('body').bind('mousedown', function (evt) {
                    if (self.activated && !$(evt.target).hasClass('c')) self.clearSelection();
                });

                this.activated = true;
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
                                charNode.className = 'c';
                                charNode.id = 'c-'+charIndex;
                                $(charNode).text(text.substr(i, 1));

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

            getText: function () {
                var clone = $(this.node).clone();
                // a poor man's unwrap()
                $('.c', clone).each(function (i, node) {
                    var parentNode = node.parentNode,
                        childNode = node.firstChild;
                    if (childNode) {
                        node.removeChild(childNode);
                        parentNode.insertBefore(childNode, node);
                    }
                    parentNode.removeChild(node);
                });
                // get rid of all the classes
                $('word', clone).removeAttr('class');
                return clone.html();
            },

            activate: function (val) {
                if (!val) {
                    this.clearSelection();
                }
                this.activated = val;
            },

            clearSelection: function () {
                // drop currently selected items
                $('.c.selected', this.node).removeClass('selected');

                this.clickedNode = null;
                this.selStart = null;
                this.selEnd = null;
            },

            onSelectionStart: function () {},
            onSelectionStop: function () {},

            _onMouseDown: function (evt) {
                var target = $(evt.target);

                this.clearSelection();

                if (target.hasClass('c')) {
                    target.addClass('selected');
                    this.clickedNode = evt.target;
                    this.selStart = this.selEnd = getCharIndex(evt.target);

                    this.onSelectionStart(evt.target);
                };

                return false;
            },

            _onMouseUp: function (evt) {
                this.clickedNode = null;
                this.clicked = false;

                // call our callback
                var selStart = document.getElementById('c-'+this.selStart),
                    selEnd = document.getElementById('c-'+this.selEnd);
                this.onSelectionStop(selStart, selEnd);
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

