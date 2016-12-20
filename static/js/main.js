function showNavBar() {
    $(".navbar-default").css({"border-color": "rgba(0, 0, 0, 0.2)"})        
    $(".navbar-brand").removeClass("hidden")
    $('#navbar').removeClass("nav-bar-hidden")
}

function hideNavBar() {
    $(".navbar-default").css({"border-color": "transparent"})
    $(".navbar-brand").addClass("hidden")
    $('#navbar').addClass("nav-bar-hidden")
}

$(window).load(function() {
    $('.term .collapse').first().collapse() // Auto show first term
});

$(window).resize(function() {
    handleNavbarPosition()  
});

$(window).scroll(function() {
    if ($(this).scrollTop() == 0) {
        showNavBar()
    } else {
        $("#nav-menu").collapse('hide')
        hideNavBar()
    }
});

$(document).ready(function() {
    $('.post-content > table').addClass('table');
    $('.post-content > table').wrap( "<div class='table-wrapper'></div>" );
    $('.post-title a').addClass('hvr-underline-from-left');
    $('[data-toggle*="tooltip"]').tooltip()
    $('.avatar').addClass('shake shake-constant');

    $('.term').on('show.bs.collapse', function(e) {
        $(e.currentTarget).find('.label i').removeClass("fa fa-caret-left").addClass("fa fa-caret-down")
    })

    $('.term').on('hide.bs.collapse', function(e) {
        $(e.currentTarget).find('.label i').removeClass("fa fa-caret-down").addClass("fa fa-caret-left")
    })

    $('#navbar').on('show.bs.collapse', function () {
       showNavBar()
    })

    $('#navbar').on('hide.bs.collapse', function () {
        if ($(window).scrollTop() != 0) {
           hideNavBar()
        }
    })
});