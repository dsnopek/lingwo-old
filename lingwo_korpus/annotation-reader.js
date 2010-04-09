
(function () {
    var bubble, contentArea, dock, footer, popup = true, setGlobalEvents = false,
        footerId, footerMargin;

    // IE6 doesn't play well with our docked version..
    if (/MSIE 6/i.test(navigator.userAgent)) {
        popup = true;
    }

    function clobber(obj, old_fn_name, new_fn) {
        old_fn = obj[old_fn_name];
        obj[old_fn_name] = function () {
            old_fn.apply(this, arguments);
            new_fn();
        };
    }

    Drupal.behaviors.lingwo_korpus = function (context) {
        if (!bubble) {
            bubble = $('<div></div>')
                .attr('id', 'lingwo-korpus-entry-view-wrapper')
                .addClass(popup ? 'popup' : 'docked')
                .appendTo($('body'))
                .hide();
        }
        if (!contentArea) {
            contentArea = $('<div></div>')
                .attr('id', 'lingwo-korpus-entry-view')
                .appendTo(bubble);
        }
        if (!dock) {
            dock = $('#lingwo-korpus-dock', context);
            footerId = dock.attr('data-footer-id');
            footerMargin = dock.attr('data-footer-margin');
        }
        if (!footer) {
            footer = $('#'+footerId, context);
        }

        function positionBubble() {
            if (popup) return;

            bubble.show();

            var offset = dock.offset(),
                footerTop = footer.offset().top,
                paddingX = bubble.outerWidth() - bubble.innerWidth(),
                paddingY = bubble.outerHeight() - bubble.innerHeight(),
                top = Math.max(offset.top - $(window).scrollTop() + 1, 0),
                height = Math.min(
                    footerTop - $(window).scrollTop() - top - footerMargin + 1, 
                    $(window).height() - top) - paddingY;

            bubble.css({
                'left': offset.left - $(window).scrollLeft(),
                'top': top,
                'height': height
            });
        }

        if (!popup) {
            // TODO: this should use the theme system somehow!!
            contentArea.html('<em>Click a word in the text to look it up in the dictionary.</em>');
            setTimeout(positionBubble, 0);
        }

        // these should be set once and only once
        if (!setGlobalEvents) {
            $(window).scroll(positionBubble);
            $(window).resize(positionBubble);
            // Special support for the 'admin' module.
            if (Drupal.adminToolbar) {
                clobber(Drupal.adminToolbar, 'setState', function () {
                    if (!popup) {
                        bubble.hide();
                        setTimeout(positionBubble, 500);
                    }
                });
            }
            setGlobalEvents = true;
        }

        // handle clicks on the annotations
        var selected = null;
        $('body', context).click(function (evt) {
            var target = $(evt.target), offset, sense_id;

            if (selected) {
                selected.removeClass('selected');
                selected = null;
            }

            if (target.hasClass('anno')) {
                offset = target.offset();
                if (popup) {
                    // X-centered and 40px down
                    var left = offset.left + (target.width() / 2) - 150,
                        top  = offset.top + target.height() + 40,
                        maxWidth = $(document).width();

                    // clip to our width
                    if (left + 300 > maxWidth) {
                        left = maxWidth - 300;
                    }
                    if (left < 0) { left = 0; };

                    bubble.show().css({ left: left, top: top, height: '' });
                }

                sense_id = target.attr('data-sense');
                contentArea.html('Loading ...');

                // mark as selected
                selected = target;
                target.addClass('selected');

                // lookup the entry on the server
                $.getJSON('/lingwo_korpus/lookup_entry', {'url': target.attr('href')},
                    function (res) {
                        contentArea.html(res.content);
                        $('div.node', contentArea).removeClass('clear-block');

                        if (sense_id) {
                          $('.lingwo-sense-id-'+sense_id, contentArea).addClass('selected');
                        }

                        // For browsers that don't correctly support max-height
                        if (bubble.height() > 200) {
                            bubble.css({ height: 200 });
                        }
                    }
                );

                return false;
            }
            else if (popup) {
                bubble.hide();
            }

            return true;
        });
    };
})();

