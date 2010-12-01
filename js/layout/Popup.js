
require.def(
    ['jquery','lingwo_dictionary/util/declare'],
    function ($, declare) {
        return declare({
            _constructor: function (args) {
                this.popup = args.node;
                // TODO: something like
                //  o relX = 'center' | 40 | -40
                //  o relY = 'center' | 40 | -40
            },

            shutdown: function () {
            },

            layout: function (target) {
                var target = $(target),
                    popup  = $(this.popup),
                    popupWidth = popup.width(),
                    offset = target.offset(),
                    // TODO: this should be configurable!
                    // X-centered and 40px down
                    left = offset.left + (target.width() / 2) - (popupWidth / 2),
                    top  = offset.top + target.height() + 40,
                    maxWidth = $(document).width();

                // clip to our width
                if (left + popupWidth > maxWidth) {
                    left = maxWidth - popupWidth;
                }
                if (left < 0) { left = 0; };

                popup.show().css({
                    left: left,
                    top: top
                });
            }
        });
    }
);


