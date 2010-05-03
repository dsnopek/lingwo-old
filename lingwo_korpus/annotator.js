
// provides our annotator

(function () {
    var selector;

    // IE hack for un-recognized elements
    document.createElement('word');
    document.createElement('grammar');

    function showDialog(node, contentArea, setContentFunc) {
        alert(node);
    }

    Drupal.behaviors.lingwo_korpus = function (context) {
        $('word', context).addClass('anno');
        require([
            'lingwo_dictionary/annotation/Reader',
            'lingwo_dictionary/annotation/TextSelector'],
            function (Reader, TextSelector) {
                Reader.setup(context, showDialog);
                if (typeof selector === 'undefined') {
                    //selector = new TextSelector(document.getElementById('edit-korpus-text'));
                }
            }
        );
    };
})();

