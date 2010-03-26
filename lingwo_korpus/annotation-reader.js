
(function () {
    var bubble, contentArea, dock, footer, popup = false, setGlobalEvents = false,
        footerId, footerMargin;

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
                .appendTo($('body'));
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
                    setTimeout(positionBubble, 500);
                });
            }
            setGlobalEvents = true;
        }

        // handle clicks on the annotations
        var selected = null;
        $('#main-content', context).click(function (evt) {
            var target = $(evt.target), offset;

            if (selected) {
                selected.removeClass('selected');
                selected = null;
            }

            if (target.hasClass('anno')) {
                offset = target.offset();
                if (popup) {
                    bubble.show()
                        // X-centered and 40px down
                        // TODO: we really should limit it to existing inside the viewable
                        // area.  We don't want it going outside and forcing scrollbars to appear.
                        .css({
                            left: (offset.left + (target.width() / 2) - 150) + 'px',
                            top: (offset.top + target.height() + 40) + 'px' });
                }

                pos = target.attr('data-pos');
                contentArea.html('Loading ...');

                // mark as selected
                selected = target;
                target.addClass('selected');

                // lookup the entry on the server
                $.getJSON('/lingwo_korpus/lookup_entry', {'url': target.attr('href')},
                    function (res) {
                        contentArea.html(res.content);
                        $('div.node', contentArea).removeClass('clear-block');
                    }
                );
            }
            else if (popup) {
                bubble.hide();
            }

            return false;
        });
    };
})();

