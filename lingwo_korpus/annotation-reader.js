
(function () {
    var bubble;
    Drupal.behaviors.lingwo_korpus = function (context) {
        
        if (!bubble) {
            bubble = $('<div></div>')
                .attr('id', 'lingwo-korpus-entry-view')
                .appendTo($('body'))
                .hide();
        };

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
                bubble.show()
                    // X-centered and 40px down
                    // TODO: we really should limit it to existing inside the viewable
                    // area.  We don't want it going outside and forcing scrollbars to appear.
                    .css({
                        left: (offset.left + (target.width() / 2) - 150) + 'px',
                        top: (offset.top + target.height() + 40) + 'px' });

                pos = target.attr('data-pos');
                bubble.html(target.attr('href'));

                // mark as selected
                selected = target;
                target.addClass('selected');
            }
            else {
                bubble.hide();
            }

            return false;
        });
    };
})();

