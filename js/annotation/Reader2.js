
define(
    ['jquery',
     'lingwo_old/layout/Popup',
     'lingwo_old/util/clobber',
     'lingwo_old/util/clone',
     'lingwo_old/util/proxy'
    ],
    function ($, PopupLayout, clobber, clone, proxy) {
        var Reader, Layouts,
            isIE6 = /MSIE 6/i.test(navigator.userAgent),
            configDefaults = {
                layout: 'docked'
            };

        Layouts = {
            popup: {
                setup: function () {
                    Reader.bubbleNode.addClass('popup');
                    this._layout = new PopupLayout({ node: Reader.bubbleNode });
                },

                shutdown: function () {
                    Reader.bubbleNode.removeClass('popup');
                    this._layout.shutdown();
                },

                show: function () {
                    var bubble = Reader.bubbleNode;

                    // do the majority of the layout
                    this._layout.layout(Reader.selectedNode);

                    // hack for browsers that don't correctly support max-height
                    bubble.css('height', '');
                    if (isIE6 || bubble.height() > 200) {
                        bubble.css({ height: 200 });
                    }
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

                // IE6 doesn't play well with our docked version..
                if (this.config.layout == 'docked' && isIE6) {
                    this.config.layout = 'popup';
                }

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

                if (!this.config.skipHoverEvents) {
                    this.setupHoverEvents();
                }

                this.layout = layout;
                this.isSetup = false;
            },

            setupHoverEvents: function () {
                $('.anno, .anno-anchor')
                    // unbind() makes this re-runnable as many times as necessary
                    .unbind('mouseenter mouseleave')
                    .bind('mouseenter', function (evt) {
                        var target = $(evt.target), annoText;
                        target.addClass('hover');
                        if (annoText = Reader._getAnnoText(target)) {
                            annoText.addClass('hover');
                        }
                    })
                    .bind('mouseleave', function (evt) {
                        var target = $(evt.target), annoText;
                        target.removeClass('hover');
                        if (annoText = Reader._getAnnoText(target)) {
                            annoText.removeClass('hover');
                        }
                    });
            },

            _getAnnoText: function (node) {
                var annoText;
                if (node.hasClass('anno-anchor')) {
                    if (annoText = node.attr('data-anno')) {
                        return $('#'+annoText);
                    }
                }
                return null;
            },

            setSelection: function (node) {
                var annoText;
                if (this.selectedNode) {
                    this.selectedNode.removeClass('selected');
                    if (annoText = this._getAnnoText(this.selectedNode)) {
                        annoText.removeClass('selected');
                    }
                    this.selectedNode = null;
                }
                if (node) {
                    node = $(node);
                    node.addClass('selected');
                    this.selectedNode = node;
                    if (annoText = this._getAnnoText(this.selectedNode)) {
                        annoText.addClass('selected');
                    }
                }
            },

            clearSelection: function () {
                this.setSelection(null);
            },

            isInsideBubble: function (node) {
                while (node = node.parentNode) {
                    if (node.id == 'lingwo-korpus-entry-view') {
                        return true;
                    }
                }
                return false;
            },

            showBubble: function () {
                this.layout.show();
                this.shown = true;
            },

            hideBubble: function () {
                this.layout.hide();
                this.shown = false;
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
                return $(node).hasClass('anno') || $(node).hasClass('anno-anchor');
            },

            handleClick: function (target) {
                var isInsideBubble;
                if (this.isWordNode(target)) {
                    if (this.isInsideBubble(target)) {
                        // if the annotation comes from inside the bubble itself, we
                        // don't change the selection or re-layout the bubble, we just
                        // load the value.
                        this.onLoad($(target));
                    }
                    else {
                        this.setSelection(target);
                        this.onLoad(this.selectedNode);
                        this.showBubble();
                    }
                    return false;
                }

                this.clearSelection();
                this.hideBubble();
            }
        };

        return Reader;
    }
);

