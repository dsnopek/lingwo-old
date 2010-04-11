
// provides our annotator

(function () {
    var dialog, curWord;

    function getSelection() {
        var t = '';
        if(window.getSelection){
            t = window.getSelection();
        }else if(document.getSelection){
            t = document.getSelection();
        }else if(document.selection){
            t = document.selection.createRange().text;
        }
        return t;
    }

    // IE hack for un-recognized elements
    document.createElement('word');
    document.createElement('grammar');

    Drupal.behaviors.lingwo_korpus = function (context) {
        if (!dialog) {
            dialog = $('<div></div>')
                .attr('id', 'lingwo-korpus-annotator-dialog')
                .appendTo($('body'))
                .hide();
            dialog.html(
                'Headword: <input id="lingwo-korpus-annotator-headword" /><br />' +
                'Pos:      <input id="lingwo-korpus-annotator-pos" /><br />'      +
                'Form:     <input id="lingwo-korpus-annotator-form" /><br />'     +
                'Sense:    <input id="lingwo-korpus-annotator-sense" /><br />'
            );
        }

        /*
        $('word', context).bind("click", function (evt) {
            dialog.show();
            return true;
        });
        */

        $('#edit-korpus-text', context).bind("mouseup", function (evt) {
            var sel = getSelection(), node = evt.target;
            if (sel != '') { alert(sel); return true; }

            if (node.tagName.toLowerCase() == 'word') {
                dialog.show();
                dialog.css({
                    'left': ($(window).width() - $(dialog).width()) / 2,
                    'top': ($(window).height() - $(dialog).height()) / 2
                });
                curWord = node;
            }
            else {
                dialog.hide();
                curWord = null;
            }

            return true;
        });
    };
})();

