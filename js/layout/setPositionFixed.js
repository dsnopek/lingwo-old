define(
    ['jquery',
     'lingwo/util/declare',
     'lingwo_old/util/proxy',
     'lingwo_old/layout/isPositionFixedSupported'
    ],
    function ($, declare, proxy, isPositionFixedSupported) {
        // TODO: do this the right way somehow...
        /*
        var positionFixed = isPositionFixedSupported();

        if (positionFixed) {
            return function(node) {
                var el = $(node),
                    parent = el.parent();
                parent.css({'position': 'relative', 'padding-top': el.height()});
                el.css({position: 'fixed'});
            }
        }
        */

        return function (node) {
            var el = $(node),
                parent = el.parent(),
                top_offset = parent.offset().top;
            parent.css({position: 'relative'});
            $(window).scroll(function () {
                var scroll_top = $(window).scrollTop();
                if (scroll_top > top_offset) {
                    el.css({position: 'absolute', 'top': scroll_top - top_offset});
                }
                else {
                    el.css({position: '', 'top': ''});
                }
            });
        };
    }
);
 
