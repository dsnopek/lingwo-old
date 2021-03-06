
(function () {
    //var layout = 'docked';
    var layout = 'popup';

    Drupal.behaviors.lingwo_korpus = function (context) {
        require(['lingwo_old/annotation/Reader2'],
            function (Reader) {
                Reader.onLoad = function (target) {
                    var parts = (target.attr('data-entry') || '').split('#'),
                        hash  = parts[0],
                        sense = parts[1];

                    Reader.setBubbleLoading();

                    // lookup the entry on the server
                    $.getJSON(Drupal.settings.baseUrl+'/lingwo_korpus/lookup_entry',
                        { 'hash': hash, 'lang': Drupal.settings.language},
                        function (res) {
                            Reader.setBubbleContent(res.content);
                            $('.node', Reader.contentNode).removeClass('clear-block');

                            if (sense) {
                                $('.lingwo-sense-id-'+sense, Reader.contentNode).addClass('selected');
                            }

                            // run behaviors on the new data
                            if (Drupal.attachBehaviors) {
                                Drupal.attachBehaviors(Reader.contentNode);
                            }
                        }
                    );
                };

                Reader.setup({ layout: layout });
                $('body', context).click(function (evt) {
                    // hack to prevent the popup from being closed when an audio tag is clicked
                    if (evt.target.tagName.toLowerCase() !== 'audio') {
                        return Reader.handleClick(evt.target);
                    }
                });
            }
        );
    };
})();

