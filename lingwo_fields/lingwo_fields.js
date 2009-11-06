
Drupal.behaviors.lingwo_fields = function (context) {
    var field_name = Drupal.settings.lingwo_fields.field_name;
    field_name = field_name.replace('_', '-');

    // remove the Refresh button, AHAH will handle the reloading
    $('#edit-'+field_name+'-refresh').remove();
}

