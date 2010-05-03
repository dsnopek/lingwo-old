
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
            $('#edit-anno-form-delete').click(function (evt) {
                deleteAnnotation();
                reader.hideDialog();
                curAnno = null;
            });
            $('#edit-anno-form-cancel').click(function (evt) {
                if (mode == 'add') {
                    deleteAnnotation();
                }
                reader.hideDialog();
                curAnno = null;
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
        var headword, changed = false;

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
        curAnno.addClass(mode == 'edit' ? 'changed' : 'added');
    }

    function deleteAnnotation () {
        if (!curAnno) return;

        var curAnnoNode = curAnno.get(0),
            parentNode = curAnnoNode.parentNode,
            node = curAnnoNode.firstChild, next;

        while(node) {
            next = node.nextSibling;

            curAnnoNode.removeChild(node);
            parentNode.insertBefore(node, curAnnoNode);

            node = next;
        }

        parentNode.removeChild(curAnnoNode);
        curAnno = null;
    }

    function findParentWord(node) {
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

    function areSiblings(start, end) {
        if (start == end) return true;
        while (start = start.nextSibling) {
            if (start == end) {
                return true;
            }
        }
        return false;
    }

    // accepts any two siblings as arguments
    function createNode(start, end) {
        // TODO: double check that they are siblings
        if (!areSiblings(start, end)) {
            throw ("Cannot create a node between two points that aren't siblings");
        }

        var parentNode = start.parentNode,
            newNode = document.createElement('word'),
            node = start, next;

        parentNode.insertBefore(newNode, start);
        while(node) {
            next = node.nextSibling;

            parentNode.removeChild(node);
            newNode.appendChild(node);

            if (node == end) break;
            node = next;
        }

        return newNode;
    }

    function onSelectionStart(selStart) {
        $('#edit-korpus-text').removeClass('selection-error');
    }

    function onSelectionStop(selStart, selEnd) {
        if (selStart === null || selEnd === null) {
            reader.hideDialog();
            curAnno = null;
            return;
        }

        var startWord = findParentWord(selStart),
            endWord = findParentWord(selEnd),
            error = true, climbTheTree = false;

        if ((startWord && endWord && startWord == endWord) ||
            (startWord === null && endWord === null))
        {
            // the simplest case, it will just work
            error = false;
        }
        else {
            // if they are on the word boundries, then we include the whole words
            if (startWord && startWord.firstChild == selStart) {
                selStart = startWord;
            }
            if (endWord && endWord.lastChild == selEnd) {
                selEnd = endWord;
                
                // if we are dealing with the selection ending on a word boundry,
                // then we need to climb the tree to find the proper sibling in the
                // case where multiple words end in the same spot.
                climbTheTree = true;
            }

            // try to determine if these are siblings
            while (selEnd) {
                if (areSiblings(selStart, selEnd))
                    break;

                if (climbTheTree) {
                    selEnd = findParentWord(selEnd);
                }
                else {
                    // no good!
                    selEnd = null;
                }
            }

            // if selEnd avoids getting wiped out, then we are good
            if (selEnd) {
                error = false;
            }
        }

        if (error) {
            $('#edit-korpus-text').addClass('selection-error');
        }
        else {
            reader.showDialog(createNode(selStart, selEnd));
        }
    }

    function onSubmit(evt) {
        $('#edit-korpus-text-value').val(selector.getText());
        return true;
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
                            if (wordParent = findParentWord(evt.target)) {
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
                            }
                            return true;
                        }
                    });
                }
                // setup the text selector
                if (typeof selector === 'undefined') {
                    selector = new TextSelector(document.getElementById('edit-korpus-text'));
                    selector.onSelectionStart = onSelectionStart;
                    selector.onSelectionStop = onSelectionStop;
                }

                // setup the mode controls
                function handleMode() { setEditMode($('input[name=edit-mode]:checked').val()); };
                $('input[name=edit-mode]:radio', context).click(handleMode);
                handleMode();

                // setup the code to save
                $('#lingwo-korpus-annotator-form').bind('submit', onSubmit);
            }
        );
    };
})();

