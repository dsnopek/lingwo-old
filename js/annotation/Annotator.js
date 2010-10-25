
require.def('lingwo_dictionary/annotation/Annotator',
    ['jquery',
     'lingwo_dictionary/annotation/Reader2',
     'lingwo_dictionary/annotation/TextSelector',
     'lingwo_dictionary/buildForm',
     'lingwo_dictionary/parseTemplate',
     'text!lingwo_dictionary/annotation/Annotator/button.html',
     'text!lingwo_dictionary/annotation/Annotator/button-group.html',
     'text!lingwo_dictionary/annotation/Annotator/bubble-form.html'
    ],
    function ($, Reader, TextSelector, buildForm, parseTemplate, makeBtn, makeBtnGrp, makeBubbleForm) {
        var Annotator,
            msgWordOn = '<i>Click a word on the left to edit the annotation</i>',
            msgWordOff = '<i>Panel disabled</i>';

        // IE hack for un-recognized elements
        document.createElement('word');
        document.createElement('grammar');

        /*
         * Setup template functions.
         */

        // make a shorter calling signature for the buttons
        makeBtn = (function (f) {
            return function (label, id) {
                return f({label:label, id:id});
            };
        })(parseTemplate(makeBtn));
        makeBtnGrp = (function (f) {
            return function (title, buttons) {
                return f({title:title, buttons:buttons});
            };
        })(parseTemplate(makeBtnGrp));
        
        // simple parse
        makeBubbleForm = parseTemplate(makeBubbleForm);

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

        function isInsideBubble(node) {
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
         * Declare the Annotator.
         */

        Annotator = {
            toolbarNode: null,
            textNode: null,
            textValueNode: null,
            bubbleFormNode: null,

            type: null,
            mode: null,
            bubblePane: 'message',
            onlyMissing: false,
            selected: null,

            _selector: null,
            _setupDone: false,

            _setupToolbar: function () {
                this.toolbarNode.html(
                    makeBtnGrp('Type', [
                        makeBtn('Sentence', 'button-type-sent'),
                        makeBtn('Word',     'button-type-word')
                    ]) +
                    makeBtnGrp('Mode', [
                        makeBtn('Add',  'button-mode-add'),
                        makeBtn('Edit', 'button-mode-edit')
                    ]) +
                    makeBtn('Delete',  'button-delete') +
                    makeBtn('Next',    'button-next') +
                    makeBtn('Missing', 'button-missing')
                );

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

                $('#button-delete').click(function (evt) {
                    Annotator.deleteAnnotation();
                }).addClass('disabled');

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
                // setup Reader to work for the Annotator
                Reader.onLoad = function (target) {
                    Annotator._selectWord(target);
                };
                Reader.isWordNode = function (target) {
                    if (target.tagName.toLowerCase() == 'word') {
                        return true;
                    }
                    return false;
                }
                Reader.setup({ layout: 'docked' });

                $(window).click(function (evt) {
                    var wordParent;
                    if (Annotator.type == 'word' && Annotator.mode == 'edit') {
                        if (wordParent = findParentWord(evt.target)) {
                            // TODO: shouldn't this be handled in .selectWord()?
                            if (Annotator.selected !== null) {
                                Annotator.saveAnnotation();
                            }
                            return Reader.handleClick(wordParent);
                        }
                        if (!isInsideBubble(evt.target)) {
                            Annotator.clearSelection();
                        }
                    }
                });

                this._selector = new TextSelector(this.textNode.get(0));
                this._selector.onSelectionStart = function () { return Annotator._onSelectionStart.apply(Annotator, arguments); };
                this._selector.onSelectionStop = function () { return Annotator._onSelectionStop.apply(Annotator, arguments); };
            },

            _setupForm: function () {
                Reader.setBubbleContent('');

                // first, we need to get the list of posItems
                $.getJSON('/lingwo_korpus/pos_list', function (res) {
                    Annotator.bubbleFormNode = $('<div id="bubble-form"></div>');
                    Annotator.bubbleFormNode
                        .html(makeBubbleForm({ pos_list: res.pos_list, message: msgWordOn }))
                        .appendTo(Reader.contentNode);

                    $('#anno-form-lookup-entry').click(function (evt) {
                        Annotator._lookupSelectedEntry();
                        return false;
                    });

                    $('#sense-form-return').click(function (evt) {
                        Annotator.setBubblePane('anno-form');
                        return false;
                    });

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
                    this.showBubbleMessage(msgWordOn);
                }
                else if (this.type == 'sent') {
                    $('#button-next').addClass('disabled');
                    $('#button-missing').addClass('disabled');
                    this.setOnlyMissing(false);
                    this.showBubbleMessage(msgWordOff);
                }
            },

            setMode: function (mode) {
                if (this.mode == mode) return;
                this._toggleButton('mode', mode);
                this._selector.activate(this.mode == 'add');
            },

            setBubblePane: function (bubblePane) {
                if (this.bubbleFormNode === null) return;
                if (this.bubblePane == bubblePane) return;
                $('#bubble-form-pane-'+this.bubblePane).hide();
                $('#bubble-form-pane-'+bubblePane).show();
                this.bubblePane = bubblePane;
            },

            showBubbleMessage: function (message) {
                if (this.bubbleFormNode === null) return;
                this.setBubblePane('message');
                $('#bubble-form-pane-message').html(message);
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

            _selectWord: function (target) {
                // save the previously selected word
                if (this.selected !== null) {
                    this.saveAnnotation();
                }

                target = $(target);

                this.setBubblePane('anno-form');
                $('#anno-form-headword').val(target.attr('headword') || target.text());
                $('#anno-form-pos').val(target.attr('pos'));
                $('#anno-form-attributive').attr('checked',
                    target.attr('attributive') == 'true' ? 'checked' : '');

                // we can now delete
                $('#button-delete').removeClass('disabled');

                // clear the old sense form, so that we don't accidently save it to this annotation
                $('#sense-form-data').html('');

                this.selected = target;
            },

            selectWord: function (target) {
                Reader.handleClick(target);
            },

            selectNextWord: function () {
            },

            _lookupSelectedEntry: function () {
                var dataNode = $('#sense-form-data');

                this.setBubblePane('sense-form');
                dataNode.text('Loading...');

                $.getJSON('/lingwo_korpus/lookup_senses', {
                    'language': Drupal.settings.lingwo_korpus.text.language,
                    'headword': $('#anno-form-headword').val(),
                    'pos': $('#anno-form-pos :selected').val()
                }, function (res) {
                    var sense_id, sense, options = [];

                    if (res.senses) {
                        options.push({
                            label: 'None',
                            value: ''
                        });

                        for (sense_id in res.senses) {
                            sense = res.senses[sense_id];
                            options.push({
                                label: '<div class="sense-data">'+
                                       ((!sense.difference && !sense.example) ? sense_id : (
                                       (sense.difference ? ('<div><b>'+Drupal.t('Difference')+'</b>: '+sense.difference+'</div>') : '') +
                                       (sense.example    ? ('<div><b>'+Drupal.t('Example')+'</b>: '+sense.example+'</div>') : ''))) +
                                       '</div>',
                                value: sense_id
                            });
                        }

                        dataNode.html(buildForm({
                            type: 'radios',
                            name: 'sense-form-selector',
                            options: options,
                            default_value: Annotator.selected.attr('sense')
                        }));
                        $('.form-item', dataNode).addClass('clear-block');
                    }
                    else {
                        dataNode.html('<i>No entry found.</i>');
                    }
                });
            },

            _onSelectionStart: function (selStart) {
                this.textNode.removeClass('selection-error');
            },

            _onSelectionStop: function (selStart, selEnd) {
                if (selStart === null || selEnd === null) {
                    this.clearSelection();
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
                headword = $('#anno-form-headword').val();
                if (headword == this.selected.text()) {
                    this.selected.removeAttr('headword');
                }
                else {
                    this.selected.attr('headword', headword);
                }

                // pos
                this.selected.attr('pos', $('#anno-form-pos :selected').val());

                // attributive
                if ($('#anno-form-attributive').attr('checked')) {
                    this.selected.attr('attributive', 'true');
                }
                else {
                    this.selected.removeAttr('attributive');
                }

                // sense
                sense = $("input[@name='sense-form-selector']:checked").val();
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
                if (this.selected === null) return;

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
                this.clearSelection();
            },

            clearSelection: function () {
                this.saveAnnotation();
                this.selected = null;
                this.showBubbleMessage(msgWordOn);
                Reader.clearSelection();
                $('#button-delete').addClass('disabled');
            },

            updateValueNode: function () {
                this.saveAnnotation();
                this.textValueNode.val(this._selector.getText());
            }
        };

        return Annotator;
    }
);

