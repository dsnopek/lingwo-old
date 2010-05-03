
// provides our annotator

(function () {
    var selector, reader, mode = 'edit';

    // IE hack for un-recognized elements
    document.createElement('word');
    document.createElement('grammar');

    function setEditMode(_mode) {
        mode = _mode;

        // change the display
        $('#edit-korpus-text').removeClass('mode-edit').removeClass('mode-add').addClass('mode-'+mode);

        // change which control is in charge
        selector.activate(mode == 'add');
        reader.activate(mode == 'edit');
    };

    function showAnnotation(target, contentArea, setContentFunc) {
        setContentFunc(target.attr('pos'));
        //alert(target.attr('pos'));
        //alert(target.getAttr('pos'));
    }

    function findWordParent(node) {
        var name;
        while (node = node.parentNode) {
            if (!node.tagName) return null;
            name = node.tagName.toLowerCase();
            if (name == 'body') {
                return null;
            }
            if (name == 'word') {
                return node;
            }
        }
        return null;
    }

    Drupal.behaviors.lingwo_korpus = function (context) {
        require([
            'lingwo_dictionary/annotation/Reader',
            'lingwo_dictionary/annotation/TextSelector'],
            function (Reader, TextSelector) {
                // setup the reader
                if (typeof reader === 'undefined') {
                    Reader.setup(context, showAnnotation);
                    $('body', context).click(function (evt) {
                        var wordParent;
                        if (Reader.activated) {
                            Reader.clearSelection();
                            if (wordParent = findWordParent(evt.target)) {
                                Reader.showDialog(wordParent);
                                return false;
                            }
                            Reader.hideDialog();
                            return true;
                        }
                    });
                    reader = Reader;
                }
                // setup the text selector
                if (typeof selector === 'undefined') {
                    selector = new TextSelector(document.getElementById('edit-korpus-text'));
                }

                // setup the mode controls
                function handleMode() { setEditMode($('input[name=edit-mode]:checked').val()); };
                $('input[name=edit-mode]:radio', context).click(handleMode);
                handleMode();
            }
        );
    };
})();

