function handleNavbarPosition() {
    if (window.matchMedia('(max-width: 480px)').matches) {
        $('#navbar').removeClass('navbar-fixed-top').addClass("navbar-static-top")
    } else {
        $('#navbar').removeClass('navbar-static-top').addClass('navbar-fixed-top')
    }
}

$(document).ready(function() {
    $('.post-title a').addClass('hvr-underline-from-left');
    $('.navbar-default .navbar-nav>li>a').addClass('hvr-underline-reveal');
    handleNavbarPosition()
});

$(window).resize(function() {
    handleNavbarPosition()  
});




