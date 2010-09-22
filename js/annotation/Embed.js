
require.def('lingwo_dictionary/annotation/Embed',
    ['jquery','lingwo_dictionary/annotation/Reader'],
    function ($, Reader) {
        //var bibliobird_url = 'http://www.bibliobird.com';
        var bibliobird_url = 'http://localhost:35637';

        function loadEntry(target, contentArea, setContentFunc) {
            var sense_id = target.attr('data-sense');

            setContentFunc('Loading ...');

            // lookup the entry on the server
            $.ajax({
                url: bibliobird_url+'/lingwo_korpus/lookup_entry',
                dataType: 'jsonp',
                data: { url: target.attr('href') },
                success: function (res) {
                    setContentFunc(res.content);
                    $('.node', contentArea)
                        .removeClass('clear-block')
                        .removeAttr('id');

                    // TODO: for now, we want to drop the node links
                    $('ul.links.inline', contentArea).remove();

                    if (sense_id) {
                        $('.lingwo-sense-id-'+sense_id, contentArea).addClass('selected');
                    }

                    // TODO: how to handle this?
                    // hack to integrate the flag module
                    /*
                    if (Drupal.flagLink) {
                        Drupal.flagLink(contentArea);
                    }
                    */
                }
            });
        }

        $('.bibliobird-content').each(function (i, x) {
            var from_lang = $(x).attr('data-from-lang'),
                to_lang   = $(x).attr('data-to-lang'),
                url       = $(x).attr('data-url') || window.location.href,
                teaser    = $(x).attr('data-teaser') == 'true';
            
            // we need to JSONP get the annotated text of the node
            $.ajax({
                url: bibliobird_url+'/lingwo_korpus/lookup_content',
                dataType: 'jsonp',
                data: { url: url, to_lang: to_lang },
                success: function (res) {
                    // assign the content
                    x.innerHTML = res.content;
                    
                    Reader.setup(x, loadEntry, true);
                    $('body').click(function (evt) {
                        return Reader.onClick(evt);
                    });
                }
            });
        });
    }
);

