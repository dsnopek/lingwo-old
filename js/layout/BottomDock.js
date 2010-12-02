
define(
    ['jquery','lingwo_dictionary/util/declare', 'lingwo_dictionary/util/proxy'],
    function ($, declare) {
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

                // TODO: we have to create the spacer and put both the 'node' and 
                // spacer into the document tree.

                this._layoutProxy = proxy(this, this.layout);
                $(window).bind('resize', this._layoutProxy);
                $(window).bind('scroll', this._layoutProxy);

                // TODO: do we call layout right away?
            },

            shutdown: function () {
                $(window).unbind('resize', this._layoutProxy);
                $(window).unbind('scroll', this._layoutProxy);
            },

            layout: function () {
                // TODO: port this code to current structure!
                
                var width = Math.min($(window).width(), $(document).width()),
                    windowHeight = $(window).height(),
                    documentHeight = $(document).height(),
                    top = $(window).scrollTop() + $(window).height() - height,
                    left = $(window).scrollLeft();

                if (top + height > documentHeight) {
                    top = documentHeight - height;
                }

                //console.log('documentHeight: '+documentHeight);
                //console.log('top: '+top);

                $(spacer).css('height', height);
                $(dock).css({
                    width: width,
                    height: height,
                    top: top,
                    left: left
                });
                $('#bibliobird-dock-main').css('width', width - 293);
                size = height;
            }
        });
    }
});

