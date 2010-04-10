
Drupal.behaviors.lingwo_senses = function (context) {
    // TODO: do some slick functional programming and combine this clearly copy-paste coding

    function toggle_sameas(node, anim) {
        var id = (node.id+'').replace(/same-as/, 'translation'),
            show = ($(':selected', node).val() == '');

        $('#'+id)[show ? 'show' : 'hide'](anim ? 'fast' : null);
    }

    $('.same-as-select', context).change(function (evt) {
        toggle_sameas(evt.target, true);
    });
    $('.same-as-select', context).each(function (i, node) { toggle_sameas(node); });

    function toggle_noequiv(node, anim) {
        var id = (node.id+'').replace(/no-equivalent/, 'translation-trans'),
            show = !$(node).is(':checked');

        $('#'+id)[show ? 'show' : 'hide'](anim ? 'fast' : null);
    }

    $('.no-equivalent-checkbox', context).change(function (evt) {
        toggle_noequiv(evt.target, true);
    });
    $('.no-equivalent-checkbox', context).each(function (i, node) { toggle_noequiv(node); });
};

