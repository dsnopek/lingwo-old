
require.def('lingwo_dictionary/annotation/Annotator',
    ['jquery',
     'lingwo_dictionary/annotation/Reader2',
     'lingwo_dictionary/annotation/TextSelector',
     'text!lingwo_dictionary/annotation/Annotator/menu.html!strip'
    ],
    function ($, Reader, TextSelector, menu_html) {
        var Annotator,
            msgWordOn = '<i>Click a word on the left to edit the annotation</i>',
            msgWordOff = '<i>Panel disabled</i>';

        // IE hack for un-recognized elements
        document.createElement('word');
        document.createElement('grammar');

        /*
         * Utility functions.
         */

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

        /*
         * Setup Reader for working with this page.
         */

        Reader.onLoad = function (target) {
            Annotator.selectWord(target);
        };
        Reader.isWordNode = function (target) {
            if (target.tagName.toLowerCase() == 'word') {
                return true;
            }
            return false;
        }

        /*
         * Declare the Annotator.
         */

        Annotator = {
            toolbarNode: null,
            textNode: null,
            textValueNode: null,

            type: null,
            mode: null,
            onlyMissing: false,
            selected: null,

            _selector: null,
            _setupDone: false,

            _setupToolbar: function () {
                this.toolbarNode.html(menu_html);

                $.each(['word','sent'], function (i,x) {
                    $('#button-type-'+x).click(function () {
                        Annotator.setType(x);
                        return false;
                    });
                });

                $.each(['add','edit'], function (i,x) {
                    $('#button-mode-'+x).click(function () {
                        Annotator.setMode(x);
                        return false;
                    });
                });

                $('#button-next').click(function (evt) {
                    if (Annotator.type == 'word') {
                      Annotator.selectNextWord();
                    }
                    return false;
                });

                $('#button-missing').click(function () {
                    if (Annotator.type == 'word') {
                      Annotator.setOnlyMissing(!Annotator.onlyMissing);
                    }
                    return false;
                });
            },

            _setupText: function() {
                Reader.setup({ layout: 'popup' });
                //Reader.setBubbleContent(msgWordOn);

                $(window).click(function (evt) {
                    var wordParent;
                    if (Annotator.type == 'word' && Annotator.mode == 'edit') {
                        if (wordParent = findParentWord(evt.target)) {
                            if (Annotator.selected !== null) {
                                Annotator.saveAnnotation();
                            }
                            return Reader.handleClick(wordParent);
                        }
                        if (!isInsideViewer(evt.target)) {
                            if (Annotator.selected !== null) {
                                Annotator.saveAnnotation();
                                Annotator.selected = null;
                            }
                            Reader.hideBubble();
                        }
                    }
                });

                this._selector = new TextSelector(this.textNode.get(0));
                this._selector.onSelectionStart = function () { return Annotator._onSelectionStart.apply(Annotator, arguments); };
                this._selector.onSelectionStop = function () { return Annotator._onSelectionStop.apply(Annotator, arguments); };
            },

            _setupForm: function () {
                Reader.setBubbleContent('');

                $('#edit-anno-form')
                    .css('display', null)
                    .appendTo(Reader.contentNode);

                $('#edit-anno-form-save').click(function (evt) {
                    Annotator.saveAnnotation();
                    Reader.hideBubble();
                    Annotator.selected = null;
                    return false;
                });
                $('#edit-anno-form-delete').click(function (evt) {
                    Annotator.deleteAnnotation();
                    Reader.hideBubble();
                    Annotator.selected = null;
                    return false;
                });
                $('#edit-anno-form-cancel').click(function (evt) {
                    if (Annotator.mode == 'add') {
                        Annotator.deleteAnnotation();
                    }
                    Reader.hideBubble();
                    Annotator.selected = null;
                    return false;
                });

                // setup a seperate section for holding the senses
                $('<div id="sense-selector"><div id="sense-selector-data"></div><a href="#" id="sense-selector-return" class="anno-form-button"></a></div>')
                    .css('display', 'none')
                    .appendTo(Reader.contentNode);
                $('#sense-selector-return')
                    .text(Drupal.t('Return to annotation...'))
                    .click(function (evt) {
                        $('#sense-selector').hide();
                        $('#edit-anno-form').show();
                        return false;
                    });
                $('#edit-anno-form-select-senses').click(function (evt) {
                    $('#sense-selector').show();
                    $('#edit-anno-form').hide();

                    // load the senses
                    $('#sense-selector-data').text(Drupal.t('Loading...'));

                    $.getJSON('/lingwo_korpus/lookup_senses', {
                        'language': Drupal.settings.lingwo_korpus.text.language,
                        'headword': $('#edit-anno-form-headword').val(),
                        'pos': $('#edit-anno-form-pos :selected').val()
                    }, function (res) {
                        var sense_id, data = $('#sense-selector-data'), sense;
                        data.html('');
                        if (res.senses) {
                            $('<div class="sense-selector-data-item clear-block"></div>')
                                .append(
                                    $('<input type="radio" name="sense-selector-value" value=""></input>')
                                    .attr('checked', !Annotator.selected.attr('sense') ? 'checked' : null))
                                .append('<div class="sense-selector-data-item-label><b>'+Drupal.t('None')+'</b></div>')
                                .appendTo(data);

                            for (sense_id in res.senses) {
                                sense = res.senses[sense_id];
                                $('<div class="sense-selector-data-item clear-block"></div>')
                                    .append(
                                        $('<input type="radio" name="sense-selector-value"></input>')
                                        .attr('checked', Annotator.selected.attr('sense') == sense_id ? 'checked' : null)
                                        .val(sense_id))
                                    .append(
                                        '<div class="sense-selector-data-item-label">' +
                                        ((!sense.difference && !sense.example) ? sense_id : (
                                          (sense.difference ? ('<div><b>'+Drupal.t('Difference')+'</b>: '+sense.difference+'</div>') : '') +
                                          (sense.example    ? ('<div><b>'+Drupal.t('Example')+'</b>: '+sense.example+'</div>') : ''))) +
                                        '</div>')
                                    .appendTo(data);
                            }
                        }
                        else {
                            data.html('<i>'+Drupal.t('No entry found.')+'</i>');
                        }
                    });

                    return false;
                });
            },

            setup: function (config) {
                if (this._setupDone) return;
                this._setupDone = true;

                this.toolbarNode = $(document.getElementById(config.toolbarId));
                this.textNode = $(document.getElementById(config.textId));
                this.textValueNode = $(document.getElementById(config.textValueId));

                this._setupToolbar();
                this._setupText();
                this._setupForm();

                this.setType('word');
                this.setMode('edit');
            },

            _toggleButton: function (which, value) {
                if (this[which] !== null) {
                    $('#button-'+which+'-'+this[which]).removeClass('pressed');
                    this.textNode.removeClass(which+'-'+this[which]);
                }
                $('#button-'+which+'-'+value).addClass('pressed');
                this.textNode.addClass(which+'-'+value);

                this[which] = value;
            },

            setType: function (type) {
                if (this.type == type) return;
                this._toggleButton('type', type);
                if (this.type == 'word') {
                    $('#button-next').removeClass('disabled');
                    $('#button-missing').removeClass('disabled');
                    //Reader.setBubbleContent(msgWordOn);
                }
                else if (this.type == 'sent') {
                    $('#button-next').addClass('disabled');
                    $('#button-missing').addClass('disabled');
                    this.setOnlyMissing(false);
                    //Reader.setBubbleContent(msgWordOff);
                }
            },

            setMode: function (mode) {
                if (this.mode == mode) return;
                this._toggleButton('mode', mode);
                this._selector.activate(this.mode == 'add');
            },

            setOnlyMissing: function (value) {
                if (this.onlyMissing == value) return;
                if (value) {
                    $('#button-missing').addClass('pressed');
                }
                else {
                    $('#button-missing').removeClass('pressed');
                }
                this.onlyMissing = value;
            },

            selectWord: function (target) {
                target = $(target);

                $('#edit-anno-form').show();
                $('#sense-selector').hide();

                $('#edit-anno-form-headword').val(target.attr('headword') || target.text());
                $('#edit-anno-form-pos').val(target.attr('pos'));
                $('#edit-anno-form-attributive').attr('checked',
                    target.attr('attributive') == 'true' ? 'checked' : '');

                this.selected = target;
            },

            selectNextWord: function () {
            },

            _onSelectionStart: function (selStart) {
                this.textNode.removeClass('selection-error');
            },

            _onSelectionStop: function (selStart, selEnd) {
                if (selStart === null || selEnd === null) {
                    Reader.hideBubble();
                    this.selected = null;
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
                    this.textNode.addClass('selection-error');
                }
                else {
                    Reader.handleClick(createNode(selStart, selEnd));
                }
            },

            saveAnnotation: function () {
                var headword, changed = false, sense;

                if (this.selected === null) {
                    return;
                }

                // headword
                headword = $('#edit-anno-form-headword').val();
                if (headword == this.selected.text()) {
                    this.selected.removeAttr('headword');
                }
                else {
                    this.selected.attr('headword', headword);
                }

                // pos
                this.selected.attr('pos', $('#edit-anno-form-pos :selected').val());

                // attributive
                if ($('#edit-anno-form-attributive').attr('checked')) {
                    this.selected.attr('attributive', 'true');
                }
                else {
                    this.selected.removeAttr('attributive');
                }

                // sense
                sense = $("input[@name='sense-selector-value']:checked").val();
                if (sense) {
                    this.selected.attr('sense', sense);
                }
                else {
                    this.selected.removeAttr('sense');
                }

                // show that it is changed to the user
                this.selected.addClass(this.mode == 'edit' ? 'changed' : 'added');
            },

            deleteAnnotation: function () {
                if (!this.selected) return;

                var curAnnoNode = this.selected.get(0),
                    parentNode = curAnnoNode.parentNode,
                    node = curAnnoNode.firstChild, next;

                while(node) {
                    next = node.nextSibling;

                    curAnnoNode.removeChild(node);
                    parentNode.insertBefore(node, curAnnoNode);

                    node = next;
                }

                parentNode.removeChild(curAnnoNode);
                this.selected = null;
            },

            updateValueNode: function () {
                this.textValueNode.val(this._selector.getText());
            }
        };

        return Annotator;
    }
);

