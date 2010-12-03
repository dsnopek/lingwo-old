
define(
    ['jquery',
     'lingwo_dictionary/util/declare',
     'lingwo_dictionary/util/proxy',
     'lingwo_dictionary/layout/isPositionFixedSupported'
    ],
    function ($, declare, proxy, isPositionFixedSupported) {
        var positionFixed = isPositionFixedSupported();

        return declare({
            _constructor: function (args) {
                this.node = args.node;
                this.size = args.size;

                // create the spacer node
                this.spacerNode = $('<div></div>')
                    .appendTo($('body'))
                    .css('height', this.size)
                    .get(0);

                // put the doc
                $(this.node).css({
                    // TODO: we should use fixed if its supported
                    position: positionFixed ? 'fixed' : 'absolute',
                    overflow: 'hidden'
                }).appendTo($('body'));

                // layout on this events (store the proxy function so we can remove these
                // events if we want)
                this._layoutProxy = proxy(this.layout, this);
                $(window).bind('resize', this._layoutProxy);
                if (!positionFixed) {
                    $(window).bind('scroll', this._layoutProxy);
                }
            },

            shutdown: function () {
                $(window).unbind('resize', this._layoutProxy);
                if (!positionFixed) {
                    $(window).unbind('scroll', this._layoutProxy);
                }

                $(this.node).remove();
                $(this.spacer).remove();
            },

            onlayout: function (top, left, width, height) { },

            layout: function () {
                var width = Math.min($(window).width(), $(document).width()),
                    windowHeight = $(window).height(),
                    documentHeight = $(document).height(),
                    top = windowHeight - this.size,
                    left = 0;

                // when not position fixed we have to take the scroll into account
                if (!positionFixed) {
                    top += $(window).scrollTop();
                    left += $(window).scrollLeft();
                }

                // clip to the bottom of the document (avoids infinite scroll problem)
                if (top + this.size > documentHeight) {
                    top = documentHeight - this.size;
                }

                $(this.spacerNode).css('height', this.size);
                $(this.node).css({
                    top: top,
                    left: left,
                    width: width,
                    height: this.size
                });

                this.onlayout(top, left, width, this.size);
            }
        });
    }
);

