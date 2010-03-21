
Drupal.behaviors.lingwo_senses = function (context) {
    function toggle(node, anim) {
        var id = (node.id+'').replace(/same-as/, 'translation'),
            show = ($(':selected', node).val() == '');

        $('#'+id)[show ? 'show' : 'hide'](anim ? 'fast' : null);
    }

    $('.same-as-select', context).change(function (evt) {
        toggle(evt.target, true);
    });
    $('.same-as-select', context).each(function (i, node) { toggle(node); });
};

