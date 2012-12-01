
// provides our annotator

(function () {
    var setupDone = false;

    Drupal.behaviors.lingwo_korpus = function (context) {
        require(['lingwo_old/annotation/Annotator'],
            function (Annotator) {
                if (!setupDone) {
                    setupDone = true;

                    Annotator.setup({
                        toolbarId: 'lingwo-korpus-annotator-toolbar',
                        textId: 'edit-korpus-text',
                        textValueId: 'edit-korpus-text-value'
                    });

                    $('#lingwo-korpus-annotator-form').bind('submit', function () {
                        Annotator.updateValueNode();
                        return true;
                    });
                }
            }
        );
    };
})();

