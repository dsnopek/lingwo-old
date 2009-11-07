
(function () {
    // This module will control the lingwo_fields form.
    var settings;
    var entry = null;

    var field_map = {};

    var updateForm = function() {
        // get rid of old cached values
        entry.clearCache();

        var type, name;
        for (type in field_map) {
            for (var name in field_map[type]) {
                var control = field_map[type][name];
                if (control.automatic) {
                    var value;
                    switch (type) {
                        case 'class':
                            value = entry.isClass(name);
                            break;
                        case 'option':
                            value = entry.getOption(name);
                            break;
                        case 'form':
                            value = entry.getForm(name).toString();
                            break;
                    }
                    control.setValue(value);
                }
            }
        }
    };

    Drupal.behaviors.lingwo_fields = function (context) {
        // load the settings
        settings = Drupal.settings.lingwo_fields;

        // this will be run every time the AHAH completes, so we need to rebuild
        // the entry object.
        entry = new Lingwo.dictionary.Entry({
            // NOTE: These don't go on context because we want it always
            name: $('#edit-title').val(),
            lang: Lingwo.dictionary.languages[$('#edit-language :selected').val()],
            pos: settings.pos_values[$('#edit-taxonomy-'+settings.pos_vid+' :selected').val()]
        });

        // TODO: if this *ISNT* new, then we rebuild the entry based on what is
        // already in the fields.

        // remove the Refresh button, AHAH will handle the reloading
        $('#edit-'+settings.field_name+'-refresh', context).remove();

        $('#edit-title', context).bind('keyup', function (evt) {
            entry.name = evt.target.value;
            updateForm();
        });

        field_map = {
            'class': {},
            'option': {},
            'form': {}
        };
        $('.'+settings.field_name+'-control', context).each(function (i) {
            var type = $(this).attr('data-type'),
                name = $(this).attr('data-name');

            var control = {
                'name': name,
                'type': type,

                'inputNode': this,
                'valueNode': $('<a href="#"></a>'),
                'autoNode': $('#'+(''+this.id).replace(/-value$/, '-automatic')).get(),

                // takes the value from the autoNode and toggles the controls
                'updateAutomatic': function () {
                    this.automatic = $(this.autoNode).attr('checked') ? true : false;
                    if (this.automatic) {
                        $(this.inputNode).hide();
                        $(this.valueNode).show();
                        
                        switch (this.type) {
                            case 'class':
                                delete entry.classes[this.name];
                                break;
                            case 'option':
                                delete entry.options[this.name];
                                break;
                            case 'form':
                                delete entry.forms[this.name];
                                break;
                        }

                        updateForm();
                    }
                    else {
                        $(this.inputNode).show();
                        $(this.valueNode).hide();
                    }
                },

                // updates the value of the control
                'setValue': function (value) {
                    var inputValue = (this.type == 'class') ? (value ? '1' : '0') : value;
                    $(this.inputNode).val(inputValue);
                    $(this.valueNode).text(value);
                }
            };

            // implement our toggling between automatic/manual
            $(control.inputNode).parent().append(control.valueNode);
            $(control.autoNode).bind('click', function (evt) {
                control.updateAutomatic();
            });
            $(control.valueNode).bind('click', function (evt) {
                if (control.automatic) {
                    $(control.autoNode).removeAttr('checked');
                }
                else {
                    $(control.autoNode).attr('checked', 'checked');
                }

                // toggle the class value immediately
                if (type == 'class' && control.automatic) {
                    var value = ($(':selected', control.inputNode).val() == '1');
                    control.setValue(!($(':selected', control.inputNode).val() == '1'));
                }

                control.updateAutomatic();
                return false;
            });
            control.updateAutomatic();

            // attach events for catching changes and updating the form
            $(control.inputNode).bind(type == 'form' ? 'keyup' : 'change', function (evt) {
                switch(type) {
                    case 'class':
                        entry.classes[name] = $(':selected', control.inputNode).val() == '1';
                        break;
                    case 'option':
                        entry.options[name] = $(':selected', control.inputNode).val();
                        break;
                    case 'form':
                        entry.forms[name] = $(control.inputNode).val();
                        break;
                };

                updateForm();
            });

            field_map[type][name] = control;
        });

        updateForm();
    };
})();

