
(function () {
  var senses = {}, senses_reverse = {};
  Drupal.behaviors.lingwo_korpus = function (context) {
    $('.lingwo-senses-id').each(function () {
      var id = $(this).val(), match;
      if (match = /edit-lingwo-senses-(\d+)-id/.exec(''+this.id)) {
        senses[id] = match[1];
        senses_reverse[match[1]] = id;
      }
    });

    function toggleReplaceWith() {
      var new_input = $('#' + (''+this.id).replace(/-remove$/, '-new')),
          replace_with = $('#' + (''+this.id).replace(/-remove$/, '-replace-with-wrapper'));
      if (new_input.val() != '1') {
        if ($(this).is(':checked')) {
          replace_with.show();
        }
        else {
          replace_with.hide();
        }
      }
    }

    // bind to the remove checkbox and show/hide the 'Replace with' field
    $('.lingwo-senses-remove', context).click(toggleReplaceWith);
    $('.lingwo-senses-remove', context).each(toggleReplaceWith);

    function updateOptions() {
      var match, id, key, index, val;
      if (match = /^edit-lingwo-senses-(\d+)-data-difference$/.exec(this.id)) {
        key = match[1];
        if (id = senses_reverse[key]) {
          index = parseInt(key) + 1;
          val = $(this).val();
          if (val) {
            val = index + ': ' + val;
            if (val.length > 25) {
              val = val.substring(0, 25) + '...';
            }
          }
          else {
            val = Drupal.t('Sense #@sense_num', {'@sense_num': index});
          }
          $('select.lingwo-korpus-replace-with option[value='+id+']').text(val);
        }
      }
    }

    // bind to the difference input so that we can update the select box options
    $('.lingwo-senses-difference-input', context).change(updateOptions);
    $('.lingwo-senses-difference-input', context).each(updateOptions);
  };
})();

