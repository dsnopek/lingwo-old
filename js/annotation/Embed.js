
require.def('lingwo_dictionary/annotation/Embed',
    ['jquery','lingwo_dictionary/annotation/Reader'],
    function ($, Reader) {
        function loadEntry(target, contentArea, setContentFunc) {
            alert('loadEntry');
        }

        $('.bibliobird-content').each(function (i, x) {
            var from_lang = $(x).attr('data-from-lang'),
                to_lang   = $(x).attr('data-to-lang'),
                url       = $(x).attr('data-url') || window.location.href,
                teaser    = $(x).attr('data-teaser') == 'true';
            
            // TODO: we need to JSONP the annotated text of the node over

            // TODO: we need to create the reader after this has loaded
            Reader.setup(x, loadEntry, true);
            $('body', x).click(function (evt) {
                return Reader.onClick(evt);
            });
        });
    }
);

