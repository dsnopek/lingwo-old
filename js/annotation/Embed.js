
require.def('lingwo_dictionary/annotation/Embed',
    ['jquery','lingwo_dictionary/annotation/Reader'],
    function ($, Reader) {
        //var bibliobird_url = 'http://www.bibliobird.com';
        var bibliobird_url = 'http://localhost:35637',
            embedWindow = $('<div></div>'),
            embedIframe = $('<iframe></iframe>');

        // make the embedWindow / embedIframe
        embedIframe
            .css({
                width: 600,
                height: 400
            })
            .appendTo(embedWindow);
        embedWindow
            .css({
                width: 600,
                height: 400,
                position: 'fixed',
            })
            .hide()
            .appendTo($('body'));
        function positionEmbedWindow() {
            var left = ($(window).width() - 600) / 2,
                top  = ($(window).height() - 400) / 2;
            embedWindow.css({ top: top, left: left });
        }
        $(window).resize(positionEmbedWindow);
        setTimeout(positionEmbedWindow, 0);

        // Debuging!  Cache busting!
        /*
        var oldAttach = require.attach;
        require.attach = function (url, contextName, moduleName, callback, type) {
           url += (url.indexOf('?') === -1 ? '?' : '&') + 'bust=' + (new
        Date()).getTime()
           return oldAttach.call(require, url, contextName, moduleName,
        callback, type);
        }
        */

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

        function open_embedded(url) {
            embedIframe.attr('src', url+'?embed=1');
            embedWindow.show();
        }

        $('.bibliobird-content').each(function (i, x) {
            var from_lang = $(x).attr('data-from-lang'),
                to_lang   = $(x).attr('data-to-lang'),
                url       = $(x).attr('data-url') || window.location.href,
                teaser    = $(x).attr('data-teaser') == 'true',
                links     = $('<div class="bibliobird-links"></div>').insertBefore(x);

            function build_links(res) {
                links.html('');

                if (res.username) {
                    links.append('Logged into BiblioBird as '+res.username+' ');
                    /*
                    links.append($('<a></a>')
                        .html('Logout')
                        .attr('href', bibliobird_url+'/logout')
                        // TODO: I think we need a special JSONP logout function, because we need to know when
                        // its finished
                        .click(function () { return false })
                    );
                    */
                }
                else {
                    links.append('Not logged into BiblioBird ');
                    links.append($('<a></a>')
                        .html('Login')
                        .attr('href', bibliobird_url+'/user/login')
                        .click(function (evt) { open_embedded(evt.target.href); return false; })
                    );
                    links.append(' ');
                    links.append($('<a></a>')
                        .html('Join BiblioBird')
                        .attr('href', bibliobird_url+'/user/register')
                        .click(function (evt) { open_embedded(evt.target.href); return false; })
                    );
                }
                links.append(' ');

                if (res.not_found) {
                    links.append($('<a></a>')
                        .html('Add to Bibliobird')
                        // TODO: we need some configuration, so we can point the user to the
                        // correct language site!
                        .attr({
                            href: bibliobird_url+'/node/add/content?remote_url='+escape(url),
                            target: '_blank'
                        })
                    );
                }
            }

            // we need to JSONP get the annotated text of the node
            $.ajax({
                url: bibliobird_url+'/lingwo_korpus/lookup_content',
                dataType: 'jsonp',
                data: { url: url, to_lang: to_lang },
                success: function (res) {
                    build_links(res);

                    if (res.content) {
                        // assign the content
                        x.innerHTML = res.content;
                        
                        Reader.setup(x, loadEntry, true);
                        $('body').click(function (evt) {
                            return Reader.onClick(evt);
                        });
                    }
                }
            });
        });
    }
);

