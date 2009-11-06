
(function () {
    // This module will control the lingwo_fields form.

    var settings = Drupal.settings.lingwo_fields;
    var field_name = settings['field_name'];
    field_name = field_name.replace('_', '-');

    var entry = null;

    var updateForm = function() {
        $('#edit-field-fields-1-value').attr('value', entry.getForm('*stem'));
    };

    Drupal.behaviors.lingwo_fields = function (context) {
        // TODO: this will be run every time the AHAH completes, so we need to rebuild
        // the entry object.

        entry = new Lingwo.dictionary.Entry({
            // TODO: we need to pull the lang and pos from the form
            lang: Lingwo.dictionary.languages['pl'],
            pos: 'adjective',
        });

        // TODO: if this *ISNT* new, then we rebuild the entry based on what is
        // already in the fields.

        // remove the Refresh button, AHAH will handle the reloading
        $('#edit-'+field_name+'-refresh', context).remove();

        $('#edit-title', context).bind('change', function (evt) {
            entry.name = evt.target.value;
            entry.clearCache();
            updateForm();
        });
    };
})();

