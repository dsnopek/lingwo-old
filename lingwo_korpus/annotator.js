
// provides our annotator

(function () {
    var selector, reader, mode = 'edit', formMoved = false, curAnno = null;

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
        if (!formMoved) {
            $('#edit-anno-form')
                .css('display', null)
                .appendTo(contentArea);
            setContentFunc(null);

            $('#edit-anno-form-save').click(function (evt) {
                saveAnnotation();
                reader.hideDialog();
                curAnno = null;
            });
            $('#edit-anno-form-cancel').click(function (evt) {
                curAnno = null;
                reader.hideDialog();
            });

            formMoved = true;
        }

        $('#edit-anno-form-headword').val(target.attr('headword') || target.text());
        $('#edit-anno-form-pos').val(target.attr('pos'));
        $('#edit-anno-form-attributive').attr('checked',
            target.attr('attributive') == 'true' ? 'checked' : '');

        curAnno = target;
    }

    function saveAnnotation() {
        var headword;

        if (curAnno === null) {
            return;
        }

        // headword
        headword = $('#edit-anno-form-headword').val();
        if (headword == curAnno.text()) {
            curAnno.removeAttr('headword');
        }
        else {
            curAnno.attr('headword', headword);
        }

        // pos
        curAnno.attr('pos', $('#edit-anno-form-pos :selected').val());

        // attributive
        if ($('#edit-anno-form-attributive').attr('checked')) {
            curAnno.attr('attributive', 'true');
        }
        else {
            curAnno.removeAttr('attributive');
        }

        // show that it is changed to the user
        curAnno.addClass('changed');
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

    function isInsideViewer(node) {
        while (node = node.parentNode) {
            if (node.id == 'lingwo-korpus-entry-view') {
                return true;
            }
        }
        return false;
    }

    Drupal.behaviors.lingwo_korpus = function (context) {
        require([
            'lingwo_dictionary/annotation/Reader',
            'lingwo_dictionary/annotation/TextSelector'],
            function (Reader, TextSelector) {
                // setup the reader
                if (typeof reader === 'undefined') {
                    reader = Reader;
                    reader.setup(context, showAnnotation);

                    $('body', context).click(function (evt) {
                        var wordParent;
                        if (reader.activated) {
                            if (wordParent = findWordParent(evt.target)) {
                                if (curAnno !== null) {
                                    saveAnnotation();
                                }
                                reader.showDialog(wordParent);
                                return false;
                            }
                            if (!isInsideViewer(evt.target)) {
                                if (curAnno !== null) {
                                    saveAnnotation();
                                    curAnno = null;
                                }
                                reader.hideDialog();
                                reader.clearSelection();
                            }
                            return true;
                        }
                    });
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

