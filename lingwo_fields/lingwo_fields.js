
(function () {
    // This module will control the lingwo_fields form.
    var settings;
    var entry = null;

    var field_map = {};
    var extra_forms = [];
    var timer = null;

    // updates the on screen form with values from the entry
    function updateForm() {
        var name;

        // get rid of old cached values
        entry.clearCache();

        for (name in field_map) {
            var control = field_map[name];
            if (control.automatic) {
                control.fromEntry();
            }
        }
    };

    function Control (node) {
        this.type = $(node).attr('data-type'),
        this.name = $(node).attr('data-name');

        var self = this;

        this.inputNode = $('.lingwo-fields-value', node).get(0);
        this.wrapperNode = $(node).get(0);
        this.valueNode = $('<a href="#"></a>');
        this.autoNode = document.getElementById((''+this.inputNode.id).replace(/-value-0$/, '-automatic'));

        if (this.type == 'form') {
          this.addValueNode = $('<a class="lingwo-fields-addvalue" href="#">'+Drupal.t('Add value')+'</a>');
          this.addValueNode.click(function (evt) {
            $('#edit--lingwo-fields-extra-value').val(self.name);
            console.debug($('#edit--lingwo-fields-extra-value'));
            $('#edit--lingwo-fields-refresh').click();
            return false;
          });

          // put the addValueNode after the label
          var label = $('label[for='+this.inputNode.id+']', this.wrapperNode);
          label.append(' ');
          label.append(this.addValueNode);
        }

        $(this.inputNode).after(this.valueNode);

        this._reattachCheckbox();
        this._attachEvents();
        this.updateAutomatic();
    };
    // does some swanky magic to re-arrange the checkbox for a tighter UI
    Control.prototype._reattachCheckbox = function () {
        // first we want to seperate the label from the check box and hide the label
        $(this.autoNode).insertBefore($(this.autoNode).parent());
        $('label', $(this.autoNode).parent()).hide().attr('for', this.autoNode.id);

        // then we want to move the check box to be before the input
        $(this.autoNode).parent().insertBefore($(this.inputNode).parent().parent()).css({
            //display: 'inline',
            'float': 'left',
            'margin': '0'
        });
    };
    // sets up all the proper event handlers to make this control work
    Control.prototype._attachEvents = function () {
        var control   = this,
            type      = this.type,
            name      = this.name,
            inputNode = this.inputNode,
            valueNode = this.valueNode,
            autoNode  = this.autoNode;

        // implement our toggling between automatic/manual
        $(autoNode).bind('click', function (evt) {
            control.updateAutomatic();
            updateForm();
        });
        $(valueNode).bind('click', function (evt) {
            if (control.automatic) {
                $(autoNode).removeAttr('checked');
            }
            else {
                $(autoNode).attr('checked', 'checked');
            }

            // toggle the class value immediately
            if (control.type == 'class' && control.automatic) {
                var value = ($(':selected', inputNode).val() == '1');
                $(control.inputNode).val(value ? '0' : '1');
            }

            control.updateAutomatic();
            return false;
        });

        // attach events for catching changes and updating the form
        $(inputNode).bind(type == 'form' ? 'keyup' : 'change', function (evt) {
            control.toEntry();
            updateForm();
        });
    };
    // takes the value from the autoNode and toggles the controls
    Control.prototype.updateAutomatic = function () {
        this.automatic = $(this.autoNode).attr('checked') ? true : false;
        if (this.automatic) {
            $(this.inputNode).hide();
            $(this.valueNode).show();
            delete entry.fields[this.name];
        }
        else {
            $(this.inputNode).show();
            $(this.valueNode).hide();

            // copy from the form to the entry
            this.toEntry();
            updateForm();
        }
    };
    // pulls the values for this control from an entry
    Control.prototype.fromEntry = function () {
        var value      = '<i>(empty)</i>',
            inputValue = '',
            showFunc;

        if (entry.headword) {
            value = inputValue = entry.getField(this.name).toString();
            if (this.type == 'class') {
                inputValue = (value == 'true') ? '1' : '0';
            }
        }

        $(this.inputNode).val(inputValue);
        $(this.valueNode).html(value);

        // Run our show function if one exists
        if (showFunc = entry.getFieldInfo(this.name).show) {
            if (showFunc(entry)) {
                $(this.wrapperNode).show();
            }
            else {
                $(this.wrapperNode).hide();
            }
        }
    };
    // pulls values from the form and pushs them to the entry
    Control.prototype.toEntry = function () {
        switch(this.type) {
            case 'class':
                entry.fields[this.name] = $(':selected', this.inputNode).val() == '1';
                break;
            case 'option':
                entry.fields[this.name] = $(':selected', this.inputNode).val();
                break;
            case 'form':
                entry.fields[this.name] = $(this.inputNode).val();
                break;
        };
    };

    function ExtraForm (node) {
        this.wrapperNode = node;

        var self = this;

        this.nameNode = $('.lingwo-fields-name', this.wrapperNode);
        this.nonameNode = $('<a class="lingwo-fields-noname" href="#">'+Drupal.t('Set name')+'</a>');
        this.nonameNode.click(function (evt) {
            self.nameNode.parent().show();
            self.nameNode
                .val('name')
                .focus();
            self.nameNode.get(0).select();
            self.nonameNode.hide();
            return false;
        });
        this.nameNode.blur(function (evt) {
            if (self.nameNode.val() == '') {
                self.nameNode.parent().hide();
                self.nonameNode.show();
            }
        });

        // put the noname node after the legend
        var legend = $('legend', this.wrapperNode);
        legend.append(' ');
        legend.append(this.nonameNode);

        this.nameNode.parent().hide();
    }


    Drupal.behaviors.lingwo_fields = function (context) {
        // load the settings
        settings = Drupal.settings.lingwo_fields;

        // get the language/pos from settings or the form
        var lang = settings.lang || $('#edit-language :selected').val();
        var pos  = settings.pos || $('#'+settings.pos_field+' :selected').val();

        require(
            ['lingwo_dictionary/languages/'+lang,
             'lingwo_dictionary/Entry'],
            function (lang, Entry) {
                // this will be run every time the AHAH completes, so we need to rebuild
                // the entry object.
                entry = new Entry({
                    // NOTE: we don't search for #edit-title on context because we want it always
                    headword: $('#edit-title').val(),
                    language: lang,
                    pos: pos
                });

                // hide the Refresh button, AHAH will handle the reloading
                $('#edit--lingwo-fields-refresh', context).hide();

                $('#edit-title', context).bind('keyup', function (evt) {
                    entry.headword = evt.target.value;
                    if (timer !== null) {
                        clearTimeout(timer);
                    }
                    timer = setTimeout(function () {
                        updateForm();
                        timer = null;
                    }, 500);
                });

                field_map = {};
                extra_forms = [];
                $('.lingwo-fields-control', context).each(function (i) {
                    var control = new Control(this);
                    field_map[control.name] = control;
                });
                $('#edit--lingwo-fields-add-new-form', context).each(function (i) {
                    //console.debug(this);
                    var extraForm = new ExtraForm(this);
                    extra_forms.push(extraForm);
                });

                // updated the form!!
                updateForm();
            }
        );
    };
})();

