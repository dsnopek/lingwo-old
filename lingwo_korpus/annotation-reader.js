
(function () {
    var popup = true;

    // IE6 doesn't play well with our docked version..
    if (/MSIE 6/i.test(navigator.userAgent)) {
        popup = true;
    }

    function loadEntry(target, contentArea, setContentFunc) {
        var sense_id = target.attr('data-sense');

        // lookup the entry on the server
        $.getJSON('/lingwo_korpus/lookup_entry', {'url': target.attr('href')},
            function (res) {
                setContentFunc(res.content);
                $('.node', contentArea).removeClass('clear-block');

                if (sense_id) {
                  $('.lingwo-sense-id-'+sense_id, contentArea).addClass('selected');
                }
            }
        );
    }

    Drupal.behaviors.lingwo_korpus = function (context) {
        require(['lingwo_dictionary/annotation/Reader'],
            function (Reader, TextSelector) {
                Reader.setup(context, loadEntry, popup);
                $('body', context).click(function (evt) {
                    return Reader.onClick(evt);
                });
            }
        );
    };
})();

