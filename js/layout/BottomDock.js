
define(
    ['jquery', 'lingwo_dictionary/util/declare', 'lingwo_dictionary/util/proxy'],
    function ($, declare, proxy) {
        // TODO: this gives false positives on Android 1.5 browser
        function isPositionFixedSupported(){
            var isSupported = null;
            if (document.createElement) {
                var el = document.createElement('div');
                if (el && el.style) {
                    el.style.position = 'fixed';
                    el.style.top = '10px';
                    var root = document.body;
                    if (root && 
                        root.appendChild && 
                        root.removeChild)
                    {
                        root.appendChild(el);
                        isSupported = (el.offsetTop === 10);
                        root.removeChild(el);
                    }
                }
            }
            return isSupported;
        }

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
                    position: 'absolute',
                    overflow: 'hidden'
                }).appendTo($('body'));

                // layout on this events (store the proxy function so we can remove these
                // events if we want)
                this._layoutProxy = proxy(this.layout, this);
                $(window).bind('resize', this._layoutProxy);
                $(window).bind('scroll', this._layoutProxy);
            },

            shutdown: function () {
                $(window).unbind('resize', this._layoutProxy);
                $(window).unbind('scroll', this._layoutProxy);

                $(this.node).remove();
                $(this.spacer).remove();
            },

            onlayout: function (top, left, width, height) { },

            layout: function () {
                var width = Math.min($(window).width(), $(document).width()),
                    windowHeight = $(window).height(),
                    documentHeight = $(document).height(),
                    top = $(window).scrollTop() + $(window).height() - this.size,
                    left = $(window).scrollLeft();

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

