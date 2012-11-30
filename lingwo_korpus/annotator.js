
// provides our annotator

(function () {
    var sanityCheckDone = false;

    Drupal.behaviors.lingwo_korpus = function (context) {
        require(['lingwo_old/annotation/Annotator'],
            function (Annotator) {
                Annotator.setup({
                    toolbarId: 'lingwo-korpus-annotator-toolbar',
                    textId: 'edit-korpus-text',
                    textValueId: 'edit-korpus-text-value'
                });

                $('#lingwo-korpus-annotator-form').bind('submit', function () {
                    Annotator.updateValueNode();
                    return true;
                });

                function insane() {
                  var t = Drupal.t('Discovered an error in the HTML! The annotator will not work until this error is fixed.');
                  
                  // alert the user
                  alert(t);

                  // disable the form in a super crude way
                  $('#lingwo-korpus-annotator-form')
                    .after($('<div class="message error"></div>').text(t))
                    .remove();
                }

                function sanityCheck() {
                  var value;

                  Annotator.updateValueNode();

                  jQuery.ajax({
                    'url': '/lingwo_korpus/' + Drupal.settings.lingwo_korpus.text.nid + '/check_html',
                    'type': 'POST',
                    'dataType': 'json',
                    'data': {
                      'html': $(Annotator.textValueNode).val(),
                    },
                    'success': function (data) {
                      if (!data.ok) {
                        insane();
                      }
                    },
                    'error': insane
                  });
                }

                if (!sanityCheckDone) {
                  setTimeout(sanityCheck, 0);
                  sanityCheckDone = true;
                }
            }
        );
    };
})();

