
define(
    ['jquery',
     'lingwo_old/annotation/Reader2',
     'lingwo_old/annotation/TextSelector',
     'lingwo_old/buildForm',
     'lingwo_old/parseTemplate',
     'lingwo_old/layout/setPositionFixed',
     'text!lingwo_old/annotation/Annotator/button.html',
     'text!lingwo_old/annotation/Annotator/button-group.html',
     'text!lingwo_old/annotation/Annotator/bubble-form.html'
    ],
    function ($, Reader, TextSelector, buildForm, parseTemplate, setPositionFixed, makeBtn, makeBtnGrp, makeBubbleForm) {
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

            pos_list: null,

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
                    makeBtn('Delete', 'button-delete') +
                    makeBtnGrp('Step', [
                        makeBtn('Previous', 'button-prev'),
                        makeBtn('Next',     'button-next')
                    ]) +
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
                    return false;
                }).addClass('disabled');

                $('#button-prev').click(function (evt) {
                    Annotator.selectPreviousWord();
                    return false;
                });

                $('#button-next').click(function (evt) {
                    Annotator.selectNextWord();
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
                Reader.setup({ layout: 'docked', skipHoverEvents: true });

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
                        if (!Reader.isInsideBubble(evt.target)) {
                            Annotator.clearSelection();
                        }
                    }
                });

                this._selector = new TextSelector(this.textNode.get(0));
                this._selector.onSelectionStart = function () { return Annotator._onSelectionStart.apply(Annotator, arguments); };
                this._selector.onSelectionStop = function () { return Annotator._onSelectionStop.apply(Annotator, arguments); };
            },

            _setupForm: function () {
                var headwordTimer = null,
                    headwordLookup = function () {
                        var pos = Annotator.getPos(), sense = Annotator.getSense();
                        Annotator._buildPos($('#anno-form-headword').val(), pos, sense);
                    };

                Reader.setBubbleContent('');

                this.bubbleFormNode = $('<div id="bubble-form"></div>');
                this.bubbleFormNode
                    .html(makeBubbleForm({ message: msgWordOn }))
                    .appendTo(Reader.contentNode);

                $('#anno-form-headword').bind('keydown', function (evt) {
                    if (headwordTimer) {
                        clearTimeout(headwordTimer);
                    }
                    headwordTimer = setTimeout(headwordLookup, 500);
                });
                
                this._buildPos();
            },

            _setupDefaultEvents: function () {
                // disable link clicking and dragging
                $('a', this.textNode)
                    .mousedown(function (evt) {
                        evt.preventDefault();
                    })
                    .click(function (evt) {
                        evt.preventDefault();
                    })
                    .each(function (node) {
                        node.draggable = false;
                    });
            },

            _setupKeyboardEvents: function () {
                $(document).keyup(function (evt) {
                    var tagName = evt.target.tagName.toLowerCase();
                    if (tagName != 'textarea' && tagName != 'select' && !(tagName == 'input' && evt.target.type == 'text')) {
                        if (evt.which == 46) { // delete
                            Annotator.deleteAnnotation();
                            return false;
                        }
                        if (evt.which == 78) { // n
                            if (evt.shiftKey) {
                                Annotator.selectPreviousWord();
                            }
                            else {
                                Annotator.selectNextWord();
                            }
                            return false;
                        }
                        if (evt.which == 65 && Annotator.mode == 'edit') {
                            Annotator.setMode('add');
                            return false;
                        }
                        if (evt.which == 69 && Annotator.mode == 'add') {
                            Annotator.setMode('edit');
                            return false;
                        }
                        if (Annotator.bubblePane == 'anno-form') {
                            if (evt.which == 72) { // h
                                $('#anno-form-headword').focus().select();
                                return false;
                            } else if (evt.which == 80) { // p
                                $('#anno-form-pos .form-radio:first').focus();
                                $('#anno-form-pos .form-radio:checked').focus();
                                // NOTE: this only happens when using keydown() and not keyup()!
                                // for some reason, the select also seems to take the keydown
                                // event and this will change its value.  So, we re-instate the
                                // original value. (Originally observed on Firefox 3.0.6)
                                /*
                                setTimeout(function () {
                                    $('#anno-form-pos').val(Annotator.selected.attr('pos')||'');
                                }, 0);
                                */
                                return false;
                            } else if (evt.which == 84) { // t
                                $('#anno-form-attributive').attr('checked', 
                                    !$('#anno-form-attributive').attr('checked'));
                                return false;
                            } else if (evt.which == 68) { // d
                                $('#anno-form-hidden').attr('checked', 
                                    !$('#anno-form-hidden').attr('checked'));
                                return false;
                            } else if (evt.which == 27) { // escape
                                Annotator.clearSelection();
                                return false;
                            }
                        }
                        else if (Annotator.bubblePane == 'sense-form') {
                            if (evt.which == 76 || evt.which == 27 || evt.which == 13) { // l, escape, enter
                                Annotator.setBubblePane('anno-form');
                                return false;
                            }
                        }
                    } else {
                        // a quick escape from a text area
                        if (evt.which == 27 || (evt.which == 13 && tagName != 'textarea')) { // escape, enter
                            $(evt.target).blur();
                            return false;
                        }
                    }
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
                this._setupDefaultEvents();
                this._setupKeyboardEvents();

                this.setType('word');
                this.setMode('edit');

                // make it act like style="position: fixed"
                setPositionFixed(this.toolbarNode);
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
                $('body').focus();
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
                if (this.onlyMissing) {
                    this._startMissingSearch();
                }
            },

            _startMissingSearch: function () {
                var list = $('word', this.textNode).get();
                var first = list.shift();
                    lookup = function () {
                        var node = list.shift(), pos;
                        if (!Annotator.onlyMissing || !node) {
                            Annotator._missingSearch = false;
                            return;
                        }

                        node = $(node);
                        pos = node.attr('pos');
                        if (!pos) {
                            node.addClass('missing');
                            setTimeout(lookup, 100);
                            return;
                        }

                        $.getJSON('/lingwo_korpus/lookup_senses', {
                            'language': Drupal.settings.lingwo_korpus.text.language,
                            'headword': node.attr('headword') || node.text(),
                            'pos': pos
                        }, function (res) {
                            if (res.senses) {
                                node.removeClass('missing');
                            }
                            else {
                                node.addClass('missing');
                            }
                            setTimeout(lookup, 100);
                        });
                    };
                this._missingSearch = true;
                lookup();
            },

            _selectWord: function (target) {
                var headword;

                // save the previously selected word
                if (this.selected !== null) {
                    this.saveAnnotation();
                }

                target = $(target);

                this.setBubblePane('anno-form');
                headword = target.attr('headword') || target.text();
                $('#anno-form-headword').val(headword);
                $('#anno-form-attributive').attr('checked',
                    target.attr('attributive') == 'true' ? 'checked' : '');
                $('#anno-form-hidden').attr('checked',
                    (target.get(0).getAttribute('hidden') == 'true' || target.get(0).getAttribute('data-hidden') == 'true') ? 'checked' : '');

                this._buildPos(headword, target.attr('pos'), target.attr('sense'));

                // we can now delete
                $('#button-delete').removeClass('disabled');

                this.selected = target;
            },

            selectWord: function (target) {
                Reader.handleClick(target);
            },

            _selectRelativeWord: function (inc) {
                if (this.type == 'word') {
                    var list = $(this.onlyMissing ? 'word.missing' : 'word').get(),
                        index = -1, i;
                    if (this.selected !== null) {
                        for(i = 0; i < list.length; i++) {
                            if (list[i] == this.selected.get(0)) {
                                index = i;
                                break;
                            }
                        }
                    }
                    if (index == -1) {
                        index = (inc > 0 ? 0 : list.length-1);
                    }
                    else {
                        index += inc;
                    }
                    if (index >= 0 && index < list.length) {
                        this.selectWord(list[index]);
                    }
                    else {
                        // don't clear the selection, if we are going through onlyMissing and
                        // the search hasn't finished yet.
                        if (!(this.onlyMissing && !this._missingSearch)) {
                            this.clearSelection();
                        }
                    }
                }
            },

            selectNextWord: function () {
                this._selectRelativeWord(1);
            },

            selectPreviousWord: function () {
                this._selectRelativeWord(-1);
            },

            _buildPos: function (headword, current_pos, current_sense) {
                var wrapper = function (pos_list) {
                    if (headword) {
                        $.getJSON('/lingwo_korpus/lookup_senses', {
                            'language': Drupal.settings.lingwo_korpus.text.language,
                            'headword': headword,
                        }, function (res) {
                            Annotator._buildPosInternal(pos_list, res.senses, current_pos, current_sense);
                        });
                    }
                    else {
                        Annotator._buildPosInternal(pos_list, null, current_pos, current_sense);
                    }
                };

                if (Annotator.pos_list) {
                    wrapper(Annotator.pos_list);
                }
                else {
                    // first, we need to get the list of posItems
                    $.getJSON('/lingwo_korpus/pos_list', {
                        'language': Drupal.settings.lingwo_korpus.text.language
                    }, function (res) {
                        var pos_list = res.pos_list;
                        pos_list.unshift({ label: Drupal.t('None'), value: '' });
                        Annotator.pos_list = pos_list;
                        wrapper(pos_list);
                    });
                }
            },

            _buildPosAdd: function (pos_div, pos, sense_list) {
            },

            _buildPosInternal: function (pos_list, sense_list, current_pos, current_sense) {
                var name = 'anno-form-pos',
                    pos_div = $('#' + name),
                    add;

                add = function (pos) {
                    var name = 'anno-form-pos',
                        item = {
                            'name': name,
                            'type': 'radio',
                            'label': pos.label,
                            'id': name + '-' + pos.value,
                            'value': pos.value,
                            'attributes': {'class': 'lingwo-korpus-pos'},
                            'prefix': '<div class="lingwo-korpus-pos-seperator">',
                            'suffix': '</div>'
                        },
                        html = buildForm(item);

                    $(html).appendTo(pos_div);

                    if (pos.value && sense_list && sense_list[pos.value]) {
                        $.each(sense_list[pos.value], function (sense_id, sense) {
                            var label = '<div class="sense-data">'+
                                   ((!sense.difference && !sense.example) ? sense_id : (
                                   (sense.difference ? ('<div><b>'+Drupal.t('Difference')+'</b>: '+sense.difference+'</div>') : '') +
                                   (sense.example    ? ('<div><b>'+Drupal.t('Example')+'</b>: '+sense.example+'</div>') : ''))) +
                                   '</div>',
                                item = {
                                    'name': name,
                                    'type': 'radio',
                                    'label': label,
                                    'id': name + '-' + pos.value + '-' + sense_id,
                                    'value': pos.value + '-' + sense_id,
                                    'attributes': {'class': 'lingwo-korpus-pos-sense'}
                                },
                                html = buildForm(item);

                            $(html).appendTo(pos_div);
                        });
                    }
                };

                // clear it out
                pos_div.html('');

                $.each(pos_list, function (i, pos) {
                    add(pos);
                });

                // set the current value
                if (current_pos) {
                    this.setPos(current_pos, current_sense);
                }
            },

            setPos: function (pos, sense, focus) {
                var pos_id = '#anno-form-pos-' + pos,
                    sense_id = pos_id + '-' + sense,
                    item;

                // clear value
                //$('input[name="anno-form-pos"]').removeAttr('checked');
                $('#anno-form-pos .form-radio:checked').removeAttr('checked');

                if (sense && $(sense_id).size() > 0) {
                    item = $(sense_id).attr('checked', 'checked');
                }
                else {
                    item = $(pos_id).attr('checked', 'checked');
                }

                // focus the element - this is the default
                if (focus) {
                    item.focus();
                }
            },

            _getPosValue: function () {
                return $('#anno-form-pos .form-radio:checked').val();
            },

            _getPosParts: function () {
                var value = this._getPosValue(),
                    parts = String(value).split('-');
                return parts;
            },

            getPos: function () {
                return this._getPosParts()[0];
            },

            getSense: function () {
                return this._getPosParts()[1];
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
                var headword, pos, changed = false, sense;

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
                pos = this.getPos();
                if (pos) {
                    this.selected.attr('pos', pos);
                }
                else {
                    this.selected.removeAttr('pos');
                }

                // attributive
                if ($('#anno-form-attributive').attr('checked')) {
                    this.selected.attr('attributive', 'true');
                }
                else {
                    this.selected.removeAttr('attributive');
                }

                // hidden
                if ($('#anno-form-hidden').attr('checked')) {
                    this.selected.get(0).setAttribute('data-hidden', 'true');
                }
                else {
                    this.selected.get(0).removeAttribute('data-hidden');
                }

                // sense
                sense = this.getSense();
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

                // this is OK to do here, because we already have the selected
                // node saved in curAnnoNode.
                // TODO: if (and when) we rework how selectNextWord is done, this
                // should be done after the annotation is deleted..
                if (this.type == 'word') {
                    this.selectNextWord();
                }
                else {
                    this.clearSelection();
                }

                while(node) {
                    next = node.nextSibling;

                    curAnnoNode.removeChild(node);
                    parentNode.insertBefore(node, curAnnoNode);

                    node = next;
                }

                parentNode.removeChild(curAnnoNode);
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

