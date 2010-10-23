
require.def('lingwo_dictionary/annotation/Reader2',
    ['jquery'],
    function ($) {
        var Reader, Layouts,
            configDefaults = {
                layout: 'docked'
            };

        function clobber(obj, old_fn_name, new_fn) {
            old_fn = obj[old_fn_name];
            obj[old_fn_name] = function () {
                old_fn.apply(this, arguments);
                new_fn();
            };
        }

        function clone(obj) {
            var copy = {}, name;
            for (name in obj) {
                copy[name] = obj[name];
            }
            return copy;
        }

        function proxy(func, obj) {
            return function () {
                return func.apply(obj, arguments);
            }
        }

        Layouts = {
            popup: {
                setup: function () {
                    Reader.bubbleNode.addClass('popup');
                },

                shutdown: function () {
                    Reader.bubbleNode.removeClass('popup');
                },

                show: function () {
                    var target = Reader.selectedNode,
                        bubble = Reader.bubbleNode,
                        offset = target.offset(),
                        // X-centered and 40px down
                        left = offset.left + (target.width() / 2) - 150,
                        top  = offset.top + target.height() + 40,
                        maxWidth = $(document).width();

                    // clip to our width
                    if (left + 300 > maxWidth) {
                        left = maxWidth - 300;
                    }
                    if (left < 0) { left = 0; };

                    bubble.show().css({
                        left: left,
                        top: top,
                        height: ''
                    });

                    // hack for browsers that don't correctly support max-height
                    //setTimeout(function () {
                        if (bubble.height() > 200) {
                            bubble.css({ height: 200 });
                        }
                    //}, 0);
                },

                hide: function () {
                    Reader.bubbleNode.hide();
                }
            },

            docked: {
                _dock: null,
                _footer: null,
                _footerId: null,
                _footerMargin: null,

                _positionBubble: function () {
                    // might be hidden just before positioning
                    Reader.bubbleNode.show();

                    var bubble = Reader.bubbleNode,
                        offset = this._dock.offset(),
                        footerTop = this._footer.offset().top,
                        paddingX = bubble.outerWidth() - bubble.innerWidth(),
                        paddingY = bubble.outerHeight() - bubble.innerHeight(),
                        top = Math.max(offset.top - $(window).scrollTop() + 1, 0),
                        height = Math.min(
                            footerTop - $(window).scrollTop() - top - this._footerMargin + 1, 
                            $(window).height() - top) - paddingY;

                    bubble.css({
                        'left': offset.left - $(window).scrollLeft(),
                        'top': top,
                        'height': height
                    });
                },

                _drupalHack: false,

                setup: function () {
                    Reader.bubbleNode.addClass('docked');

                    this._dock = $('#lingwo-korpus-dock');
                    this._footerId = this._dock.attr('data-footer-id');
                    this._footerMargin = this._dock.attr('data-footer-margin');
                    this._footer = $('#'+this._footerId);

                    var positionBubble = proxy(this._positionBubble, this);
                    $(window).bind('scroll.lingwoReaderDocked', positionBubble);
                    $(window).bind('resize.lingwoReaderDocked', positionBubble);

                    // Special hack for working with the 'admin' module.
                    if (!this._drupalHack) {
                        // Only do this once!  After its in place, we don't remove it, but it will
                        // check if this layout is activated before executing.
                        if (typeof window.Drupal != 'undefined' && Drupal.adminToolbar) {
                            clobber(Drupal.adminToolbar, 'setState', function () {
                                if (Reader.layout === Layouts.docked) {
                                    Reader.bubbleNode.hide();
                                    setTimeout(positionBubble, 500);
                                }
                            });
                        }
                        this._drupalHack = true;
                    }

                    // Let the user know that they can click a word and position the bubble for
                    // the first time.
                    Reader.setBubbleContent('<em>Click a work in the text to look it up in the dictionary.</em>');
                    setTimeout(positionBubble, 0);
                },

                shutdown: function () {
                    Reader.bubbleNode.removeClass('docked');
                    this._dock = this._footerId = this._footerMargin = this._footer = null;
                    $(window).unbind('.lingwoReaderDocked');
                },

                show: function () {
                    // A non-op.  It is always shown.
                },

                hide: function () {
                    // A non-op.  It is always shown.
                }
            }
        };

        Reader = {
            defaultLayouts: Layouts,

            onLoad: function () { },
            config: null,

            bubbleNode: null,
            contentNode: null,
            selectedNode: null,
            shown: false,
            isSetup: false,
            layout: null,
            
            setup: function (config) {
                var layout;
                if (typeof config == 'undefined') {
                    config = clone(configDefaults);
                }
                this.config = config;

                if (this.isSetup) {
                    this.layout.shutdown();
                    this.layout = null;
                    this.isSetup = false;
                }

                if (!this.bubbleNode) {
                    this.bubbleNode = $('<div></div>')
                        .attr('id', 'lingwo-korpus-entry-view-wrapper')
                        .appendTo($('body'))
                        .hide();
                }
                if (!this.contentNode) {
                    this.contentNode = $('<div></div>')
                        .attr('id', 'lingwo-korpus-entry-view')
                        .appendTo(this.bubbleNode);
                }

                layout = (typeof this.config.layout == 'string') ? Layouts[this.config.layout] : this.config.layout;
                layout.setup();

                this.layout = layout;
                this.isSetup = false;
            },

            setSelection: function (node) {
                if (this.selectedNode) {
                    this.selectedNode.removeClass('selected');
                    this.selectedNode = null;
                }
                if (node) {
                    node = $(node);
                    node.addClass('selected');
                    this.selectedNode = node;
                }
            },

            clearSelection: function () {
                this.setSelection(null);
            },

            showBubble: function () {
                if (!this.shown) {
                    this.layout.show();
                    this.shown = true;
                }
            },

            hideBubble: function () {
                if (this.shown) {
                    this.layout.hide();
                    this.shown = false;
                }
            },

            setBubbleContent: function (content) {
                this.contentNode.html(content);
            },

            setBubbleLoading: function () {
                // TODO: Make nicer and configurable!
                this.setBubbleContent('Loading...');
            },

            // Returns true if the given node is a word node.  Used by handleClick
            // to decide if it should take action or not.  Override on pages where
            // we aren't using the 'anno' class.
            isWordNode: function (node) {
                return $(node).hasClass('anno');
            },

            handleClick: function (target) {
                if (this.isWordNode(target)) {
                    this.setSelection(target);
                    this.onLoad(this.selectedNode);
                    this.showBubble();
                    return false;
                }

                this.clearSelection();
                this.hideBubble();
            }
        };

        return Reader;
    }
);

