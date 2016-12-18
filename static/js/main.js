function handleNavbarPosition() {
    if (window.matchMedia('(max-width: 480px)').matches) {
        $('#navbar').removeClass('navbar-fixed-top').addClass("navbar-static-top")
    } else {
        $('#navbar').removeClass('navbar-static-top').addClass('navbar-fixed-top')
    }
}

$(window).load(function() {
    $('.term .collapse').first().collapse() // Auto show first term
});

$(window).resize(function() {
    handleNavbarPosition()  
});

$(document).ready(function() {
    $('.post-content > table').addClass('table');
    $('.post-content > table').wrap( "<div class='table-wrapper'></div>" );
    $('.post-title a').addClass('hvr-underline-from-left');
    $('[data-toggle*="tooltip"]').tooltip()
    handleNavbarPosition()

    $('.term').on('show.bs.collapse', function(e) {
        $(e.currentTarget).find('.label i').removeClass("fa fa-caret-left").addClass("fa fa-caret-down")
    })

    $('.term').on('hide.bs.collapse', function(e) {
        $(e.currentTarget).find('.label i').removeClass("fa fa-caret-down").addClass("fa fa-caret-left")
    })

    $('.avatar').addClass('shake shake-constant');
});







