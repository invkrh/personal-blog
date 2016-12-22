function showNavBar() {
    $(".navbar-brand").removeClass("hidden")
    $('#navbar').removeClass("nav-bar-hidden")
}

function hideNavBar() {
    $(".navbar-brand").addClass("hidden")
    $('#navbar').addClass("nav-bar-hidden")
}

/* 
 * Show first list term after page loaded
 */
// $(window).load(function() {
//     $('.term .collapse').first().collapse() 
// });

var scrollTimer = null;
$(window).scroll(function () {
    if ($(this).scrollTop() == 0) {
        showNavBar()
    } else {
        $("#nav-menu").collapse('hide') // hide collapsible menu when scrolling
        hideNavBar()
    }    
});

$(document).ready(function() {
    $('.post-content > table').addClass('table');
    $('.post-content > table').wrap( "<div class='table-wrapper'></div>" );
    // in case of need to change all html class manually, use js instead
    $('.post-title a').addClass('hvr-underline-from-left'); 
    $('[data-toggle*="tooltip"]').tooltip()
    $('.avatar').addClass('shake shake-constant');

    $('.term').on('show.bs.collapse', function(e) {
        $(e.currentTarget).find('.label i').removeClass("fa fa-caret-left").addClass("fa fa-caret-down")
    })

    $('.term').on('hide.bs.collapse', function(e) {
        $(e.currentTarget).find('.label i').removeClass("fa fa-caret-down").addClass("fa fa-caret-left")
    })

    $('#navbar').on('show.bs.collapse', function() { 
        showNavBar()
        $(document).one("click", function(event) {
            var clickover = $(event.target);
            var _opened = $(".navbar-collapse").hasClass("collapse in");
            if (_opened === true && clickover.closest('.navbar').attr('id') === undefined) {
                $('.navbar .collapse').collapse('hide')
            }
        });
    })

    $('#navbar').on('hide.bs.collapse', function() {
        if ($(window).scrollTop() != 0) { hideNavBar() }
    })
});
