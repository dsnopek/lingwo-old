
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
                    var parts = target.attr('data-entry').split('#'),
                        hash  = parts[0],
                        sense = parts[1];

                    Reader.setBubbleLoading();

                    // lookup the entry on the server
                    $.getJSON(Drupal.settings.activePath+'/lingwo_korpus/lookup_entry', {'hash': hash},
                        function (res) {
                            Reader.setBubbleContent(res.content);
                            $('.node', Reader.contentNode).removeClass('clear-block');

                            if (sense) {
                                $('.lingwo-sense-id-'+sense, Reader.contentNode).addClass('selected');
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

                //$('.node .content')
                $('.anno, .anno-anchor')
                    .bind('mouseenter', function (evt) {
                        var target = $(evt.target), anno;
                        target.addClass('hover');

                        if (target.hasClass('anno-anchor')) {
                            if(anno = target.attr('data-anno')) {
                                $('#'+anno).addClass('hover');
                            }
                        }
                    })
                    .bind('mouseleave', function (evt) {
                        var target = $(evt.target), anno;
                        target.removeClass('hover');

                        if (target.hasClass('anno-anchor')) {
                            if(anno = target.attr('data-anno')) {
                                $('#'+anno).removeClass('hover');
                            }
                        }
                    });
            }
        );
    };
})();

