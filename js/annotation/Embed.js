
require.def('lingwo_dictionary/annotation/Embed',
    ['jquery','lingwo_dictionary/annotation/Reader'],
    function ($, Reader) {
        //var bibliobird_url = 'http://www.bibliobird.com';
        var bibliobird_url = 'http://localhost:35637';

        function loadEntry(target, contentArea, setContentFunc) {
            alert('loadEntry');
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
                    $('body', x).click(function (evt) {
                        return Reader.onClick(evt);
                    });
                }
            });
        });
    }
);

