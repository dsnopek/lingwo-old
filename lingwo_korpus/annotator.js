
// provides our annotator

(function () {
    var selector, reader, mode = 'edit';

    // IE hack for un-recognized elements
    document.createElement('word');
    document.createElement('grammar');

    function setEditMode(_mode) {
        // change the display
        $('#edit-korpus-text').removeClass('mode-edit').removeClass('mode-add').addClass('mode-'+_mode);

        mode = _mode;
        switch (mode) {
            case 'edit':
                break;
            case 'add':
                break;
        };
    };

    function showAnnotation(node, contentArea, setContentFunc) {
        alert(node);
    }

    Drupal.behaviors.lingwo_korpus = function (context) {
        require([
            'lingwo_dictionary/annotation/Reader',
            'lingwo_dictionary/annotation/TextSelector'],
            function (Reader, TextSelector) {
                // setup the reader
                if (typeof reader === 'undefined') {
                    Reader.setup(context, showAnnotation);
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

