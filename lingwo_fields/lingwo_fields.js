
(function () {
    // This module will control the lingwo_fields form.
    var settings;
    var entry = null;

    var field_map = {};

    // updates the on screen form with values from the entry
    function updateForm() {
        // get rid of old cached values
        entry.clearCache();

        var type, name;
        for (type in field_map) {
            for (name in field_map[type]) {
                var control = field_map[type][name];
                if (control.automatic) {
                    control.fromEntry();
                }
            }
        }
    };

    function Control (node) {
        this.type = $(node).attr('data-type'),
        this.name = $(node).attr('data-name');

        this.inputNode = node;
        this.valueNode = $('<a class="lingwo-fields-value" href="#"></a>');
        this.autoNode = $('#'+(''+node.id).replace(/-value$/, '-automatic')).get();

        this._attachEvents();
        this.updateAutomatic();
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
        $(inputNode).parent().append(valueNode);
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
            if (type == 'class' && control.automatic) {
                var value = ($(':selected', inputNode).val() == '1');
                control.setValue(!($(':selected', inputNode).val() == '1'));
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
        }
        else {
            $(this.inputNode).show();
            $(this.valueNode).hide();

            // copy from the form to the entry
            this.toEntry();
        }
    };
    // pulls the values for this control from an entry
    Control.prototype.fromEntry = function () {
        var value      = '<i>(empty)</i>',
            inputValue = '';

        if (entry.name) {
            switch (this.type) {
                case 'class':
                    value = entry.isClass(this.name).toString();
                    inputValue = (value == 'true') ? '1' : '0';
                    break;
                case 'option':
                    inputValue = value = entry.getOption(this.name);
                    break;
                case 'form':
                    inputValue = value = entry.getForm(this.name).toString();
                    break;
            }
        }

        $(this.inputNode).val(inputValue);
        $(this.valueNode).html(value);
    };
    // pulls values from the form and pushs them to the entry
    Control.prototype.toEntry = function () {
        switch(this.type) {
            case 'class':
                entry.classes[this.name] = $(':selected', this.inputNode).val() == '1';
                break;
            case 'option':
                entry.options[this.name] = $(':selected', this.inputNode).val();
                break;
            case 'form':
                entry.forms[this.name] = $(this.inputNode).val();
                break;
        };
    };


    Drupal.behaviors.lingwo_fields = function (context) {
        // load the settings
        settings = Drupal.settings.lingwo_fields;

        // get the language/pos from settings or the form
        var lang = settings.lang || $('#edit-language :selected').val();
        var pos  = settings.pos ||
            settings.pos_values[$('#edit-taxonomy-'+settings.pos_vid+' :selected').val()];

        // this will be run every time the AHAH completes, so we need to rebuild
        // the entry object.
        entry = new Lingwo.dictionary.Entry({
            // NOTE: These don't go on context because we want it always
            name: $('#edit-title').val(),
            lang: Lingwo.dictionary.languages[lang],
            pos: pos
        });

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
            var control = new Control(this);
            field_map[control.type][control.name] = control;
        });

        // updated the form!!
        updateForm();
    };
})();

