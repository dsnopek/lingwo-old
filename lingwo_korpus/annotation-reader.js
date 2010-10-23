
(function () {
    //var layout = 'docked';
    var layout = 'popup';

    // IE6 doesn't play well with our docked version..
    if (/MSIE 6/i.test(navigator.userAgent)) {
        layout = 'popup';
    }

    Drupal.behaviors.lingwo_korpus = function (context) {
        require(['lingwo_dictionary/annotation/Reader2'],
            function (Reader) {
                Reader.onLoad = function (target) {
                    var sense_id = target.attr('data-sense');

                    Reader.setBubbleLoading();

                    // lookup the entry on the server
                    $.getJSON('/lingwo_korpus/lookup_entry', {'url': target.attr('href')},
                        function (res) {
                            Reader.setBubbleContent(res.content);
                            $('.node', Reader.contentNode).removeClass('clear-block');

                            if (sense_id) {
                                $('.lingwo-sense-id-'+sense_id, Reader.contentNode).addClass('selected');
                            }

                            // hack to integrate the flag module
                            if (Drupal.flagLink) {
                                Drupal.flagLink(Reader.contentNode);
                            }
                        }
                    );
                };

                Reader.setup({ layout: layout });
                $('body', context).click(function (evt) {
                    return Reader.handleClick(evt.target);
                });
            }
        );
    };
})();

