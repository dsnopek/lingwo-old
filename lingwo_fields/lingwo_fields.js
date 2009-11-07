
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
                var node = field_map[type][name];
                switch (type) {
                    case 'class':
                        $(node).attr('checked', entry.isClass(name));
                        break;
                    case 'option':
                        $(node).val(entry.getOption(name));
                        break;
                    case 'form':
                        $(node).val(entry.getForm(name));
                        break;
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

        $('#edit-title', context).bind('change', function (evt) {
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

            field_map[type][name] = this;

            // TODO: attach events for catching changes!
        });

        updateForm();
    };
})();

