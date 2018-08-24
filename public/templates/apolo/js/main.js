/**
 * @package Apolo
 * Template Name - Apolo
 * @author Stephen https://jlvextension.com
 * @copyright Copyright (c) 2010 - 2017 jlvextension
 * @license http://www.gnu.org/licenses/gpl-2.0.html GNU/GPLv2 or later
*/
jQuery(function ($) {

    var $body = $('body'),
            $wrapper = $('.body-innerwrapper'),
            $toggler = $('#offcanvas-toggler'),
            $close = $('.close-offcanvas'),
            $offCanvas = $('.offcanvas-menu');

    $toggler.on('click', function (event) {
        event.preventDefault();
        stopBubble(event);
        setTimeout(offCanvasShow, 50);
    });

    $close.on('click', function (event) {
        event.preventDefault();
        offCanvasClose();
    });

    var offCanvasShow = function () {
        $body.addClass('offcanvas');
        $wrapper.on('click', offCanvasClose);
        $close.on('click', offCanvasClose);
        $offCanvas.on('click', stopBubble);

    };

    var offCanvasClose = function () {
        $body.removeClass('offcanvas');
        $wrapper.off('click', offCanvasClose);
        $close.off('click', offCanvasClose);
        $offCanvas.off('click', stopBubble);
    };

    var stopBubble = function (e) {
        e.stopPropagation();
        return true;
    };

    $('<div class="offcanvas-overlay"></div>').insertBefore('.body-innerwrapper > .offcanvas-menu');

    $('.close-offcanvas, .offcanvas-overlay').on('click', function (event) {
        event.preventDefault();
        $('body').removeClass('offcanvas');
    });

    //Mega Menu
    $('.sp-megamenu-wrapper').parent().parent().css('position', 'static').parent().css('position', 'relative');
    $('.sp-menu-full').each(function () {
        $(this).parent().addClass('menu-justify');
    });

    $('.show-menu').click(function () {
        $('.show-menu').toggleClass('active');
    });

    var nav_collapse = $('.nav.menu');
    nav_collapse.click('li a', function () {
        offCanvasClose();
    });

    // has slideshow
    $(document).ready(function(){
        var spHeader = $("#sp-header");
        if ($("body.com-sppagebuilder #sp-page-builder .full-slideshow").length) {
             spHeader.addClass('has-slideshow');
        }
        // class in header
        spHeader.addClass('menu-fixed-out');
    });

    // Add class menu-fixed when scroll
    var windowWidth = $(window).width();

    //Search
    var searchRow = $('.top-search-input-wrap').parent().closest('.row');
    $('.top-search-input-wrap').insertAfter(searchRow);

    $(".search-open-icon").on('click', function () {
        $(".top-search-input-wrap").slideDown(200);
        $(this).hide();
        $('.search-close-icon').show();
        $(".top-search-input-wrap").addClass('active');
    });

    $(".search-close-icon").on('click', function () {
        $(".top-search-input-wrap").slideUp(200);
        $(this).hide();
        $('.search-open-icon').show();
        $(".top-search-input-wrap").removeClass('active');
    });



    // Add class menu-fixed when scroll
    var windowWidth = $(window).width();

    if ($('body').hasClass('home')) {
        var windowHeight = $(window).height() - 60;
    } else {
        var windowHeight = $('#sp-menu').offset().top;
    }

    var d = navigator.userAgent.toLowerCase(),
            isSafari = (~d.indexOf("safari") && (!~d.indexOf("chrome")) && !~d.indexOf("firefox"));
    if (isSafari) {
        var slideHeight = $('.applanding-static-slider').outerHeight(true) + 80;
    } else {
        var slideHeight = $('.applanding-static-slider').outerHeight(true);
    }
    var stickyNav = function () {
        var scrollTop = $(window).scrollTop();

        if (scrollTop > slideHeight) {
            $('#sp-header').removeClass('menu-fixed-out').addClass('menu-fixed');
            $('#sp-header').css('top', 0);
        } else
        {
            if ($('#sp-header').hasClass('menu-fixed'))
            {
                $('#sp-header').removeClass('menu-fixed').addClass('menu-fixed-out');
                if (isSafari) {
                    $('#sp-header').css('top', (slideHeight + 70));
                } else {
                    $('#sp-header').css('top', slideHeight);
                }

            }

        }

    };
    stickyNav();
    $(window).scroll(function () {
        stickyNav();

    });



    // ******* Menu link ******** //
    var homeSectionId = $('#sp-page-builder > .page-content > section:first-child').attr('id');   // home section id

    //if first section hasn't id
    if (homeSectionId == undefined) {
        $('#sp-page-builder > .page-content > section:first-child').attr('id', 'first-section');
    }

    $('.sp-megamenu-wrapper ul, .nav.menu').find('li:not(".no-scroll")').each(function (i, el) {
        var $that = $(this),
                $anchor = $that.children('a'),
                url = $anchor.attr('href'),
                splitUrl = url.split('#');

        if ($that.hasClass('home')) {
            //alert(homeSectionId);
            if (homeSectionId) {
                $anchor.attr('href', oneClipUrl + '#' + homeSectionId);
            } else {
                $anchor.attr('href', oneClipUrl);
            }
        } else {            
            if (typeof splitUrl !== undefined) {
                if(splitUrl[1] == 'signin') {
                    $anchor.attr('href', onepageUrl + 'authentication/signin');
                } else {
                 $anchor.attr('href', onepageUrl + '#' + splitUrl[1]);
                }
            }
            ;
        }
    });

    //onepage nav
    $('.sp-megamenu-parent, .nav.menu').onePageNav({
        currentClass: 'active',
        changeHash: false,
        scrollSpeed: 900,
        scrollOffset: 60,
        scrollThreshold: 0.5,
        filter: ':not(.no-scroll)'
    });



    //Slideshow height
    var slideHeight = $(window).height();
    $('.sppb-slider-wrapper.sppb-slider-fullwidth-wrapper .sppb-slideshow-fullwidth-item-bg').css('height',slideHeight);
    $('.sppb-addon-animated-headlines .sppb-addon-animated-headlines-bg').css('height',slideHeight);

    //Slideshow angle down link
    var sppbSecondSectionId     = $('#sp-page-builder > .page-content > section:nth-child(2)').attr('id'),
    // pagebuilder second row id
    newAngleDownUrl             = '#'+sppbSecondSectionId,
    sppbSlideshowAngle        = $(".sppb-slider-wrapper .footer-animation a.slideshow-angle-down-link");
    //has URL
    //sppb_slideshow_angle_url    = sppb_slideshow_angle.attr('href');

    //set url to angle down
    sppbSlideshowAngle.attr("href", newAngleDownUrl);


    // Animation after click
    var clickToSlideClasses = $(".sppb-slider-wrapper .footer-animation a.slideshow-angle-down-link, .sppb-slideshow-fullwidth-read-more");

    clickToSlideClasses.click(function(){
        $('html, body').animate({
            scrollTop: $( $.attr(this, 'href') ).offset().top
        }, 500);
        return false;
    });

    //Tooltip
    $('[data-toggle="tooltip"]').tooltip();

    $(document).on('click', '.sp-rating .star', function (event) {
        event.preventDefault();

        var data = {
            'action': 'voting',
            'user_rating': $(this).data('number'),
            'id': $(this).closest('.post_rating').attr('id')
        };

        var request = {
            'option': 'com_ajax',
            'plugin': 'helix3',
            'data': data,
            'format': 'json'
        };

        $.ajax({
            type: 'POST',
            data: request,
            beforeSend: function () {
                $('.post_rating .ajax-loader').show();
            },
            success: function (response) {
                var data = $.parseJSON(response.data);

                $('.post_rating .ajax-loader').hide();

                if (data.status == 'invalid') {
                    $('.post_rating .voting-result').text('You have already rated this entry!').fadeIn('fast');
                } else if (data.status == 'false') {
                    $('.post_rating .voting-result').text('Somethings wrong here, try again!').fadeIn('fast');
                } else if (data.status == 'true') {
                    var rate = data.action;
                    $('.voting-symbol').find('.star').each(function (i) {
                        if (i < rate) {
                            $(".star").eq(-(i + 1)).addClass('active');
                        }
                    });

                    $('.post_rating .voting-result').text('Thank You!').fadeIn('fast');
                }

            },
            error: function () {
                $('.post_rating .ajax-loader').hide();
                $('.post_rating .voting-result').text('Failed to rate, try again!').fadeIn('fast');
            }
        });
    });


    // testimonial pro
    $('.sppb-testimonial-pro.variation-multiple .sppb-item').each(function () {
        var next = $(this).next();
        if (!next.length) {
            next = $(this).siblings(':first');
        }
        next.children(':first-child').clone().appendTo($(this));

        if (next.next().length > 0) {
            next.next().children(':first-child').clone().appendTo($(this));
        } else {
            $(this).siblings(':first').children(':first-child').clone().appendTo($(this));
        }
    });
    //Ajax Contact Form
    jQuery(function($) {
        // $(document).on('submit', '.sppb-ajaxt-contact-form', function(event) {

        //     event.preventDefault();

        //     var $self   = $(this);
        //     var value   = $(this).serializeArray();
        //     var request = {
        //         'option' : 'com_sppagebuilder',
        //         'task' : 'ajax',
        //         'addon' : 'ajax_contact',
        //         'data'   : value
        //     };

        //     $.ajax({
        //         type   : 'POST',
        //         data   : request,
        //         beforeSend: function(){
        //             $self.find('.fa').addClass('fa-spinner fa-spin');
        //         },
        //         success: function (response) {
        //             $self.find('.fa-spin').removeClass('fa-spinner fa-spin');
        //             $self.next('.sppb-ajax-contact-status').html($.parseJSON(response).data).fadeIn().delay(2000).fadeOut(500);;
        //         }
        //     });

        //     return false;
        // });
    });

    // Magnetic Popup
    jQuery(function($) {
      $(document).on('click', '.sppb-magnific-popup', function(event) {
        event.preventDefault();
        var $this = $(this);
        $this.magnificPopup({
          type: $this.data('popup_type'),
          mainClass: $this.data('mainclass')
        }).magnificPopup('open');
      });
    });

});