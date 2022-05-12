function togglePanel(selector) {
    $(selector.attr('href')).fadeIn();
    $(selector.data('hide')).hide();
}
function handleFileLoad(input) {
    var $wrap = $(input).parent();
    $wrap.find('.file-name').remove();
    if(input.files && input.files.length) {
        $('<div/>', {
            class: 'file-name',
            text: input.files[0].name
        }).prependTo($wrap);
    }
}
function showToast(selector) {
    $(selector).toast('show');
    return false;
}
function initAccordion(elem) {
    $(elem).find('.collapse').each(function() {
        new bootstrap.Collapse(this, {
            parent: elem,
            toggle: false
        });
    });
}
$(function () {
    if ($('#scrollSpy').length) {
        var scrollSpy = new bootstrap.ScrollSpy(document.body, {
            target: '#scrollSpy'
        });
    }
    $('.js-toggle').on('click', function (e) {
        e.preventDefault();
        togglePanel($(this));
    });
    $('#authorization').on('hidden.bs.modal', function () {
        togglePanel($(this).find('.js-toggle').last());
    });
    $('.modal').on('hidden.bs.modal', function () {
        $(this).find('form').trigger('reset');
    });
    $('body').on('change', '.input-file input:file', function() {
        handleFileLoad(this);
    });
    $('.accordion').each(function() {
        initAccordion(this);
    });
});
