document.addEventListener("DOMContentLoaded", function () {
    loaded();
});

function loaded() {
    setInterval(loop, 300);
}

var x = 0;
var titleText = [
    "|", "$", "$ q_", "$ qb_", "$ qbe_", "$ qbek_", "$ qbeku_", "$ qbekun_", 
    "$ qbekun_", "$ qbekun_", "$ qbekun|", "$ qbeku|", "$ qbek|", "$ qbe|", 
    "$ qb|", "$ q|", " "
];

function loop() {
    document.title = titleText[x++ % titleText.length];
}

$(window).on("scroll", function () {
    var a = $("#header");
    if ($(window).scrollTop() > 200) {
        a.addClass("sticky_navigation");
    } else {
        a.removeClass("sticky_navigation");
    }
});

$("#wrapper-dropdown").click(function () {
    $(this).toggleClass("active");
});

$("a[href^='#']").click(function (a) {
    a.preventDefault();
    var s = $(this).attr("href");
    $("html, body").animate({
        scrollTop: $(s).offset().top + "px"
    }, 2000, function () {
        if (s === "#home") {
            $(".navbar-auth").removeClass("advantages-a buy-a support-a").addClass("home-a");
            $(".navbar-lang").removeClass("lang-advantages lang-buy lang-support").addClass("lang-home");
        } else if (s === "#advantages") {
            $(".navbar-auth").removeClass("home-a buy-a support-a").addClass("advantages-a");
            $(".navbar-lang").removeClass("lang-home lang-buy lang-support").addClass("lang-advantages");
        } else if (s === "#buy") {
            $(".navbar-auth").removeClass("home-a advantages-a support-a").addClass("buy-a");
            $(".navbar-lang").removeClass("lang-home lang-advantages lang-support").addClass("lang-buy");
        } else if (s === "#support") {
            $(".navbar-auth").removeClass("home-a advantages-a buy-a").addClass("support-a");
            $(".navbar-lang").removeClass("lang-home lang-advantages lang-buy").addClass("lang-support");
        }
    });
    return false;
});

$(".support-item").click(function () {
    var activeClass = "active-win";
    if ($(this).is("#hw-1")) {
        $("#1").addClass(activeClass).siblings().removeClass(activeClass);
    } else if ($(this).is("#hw-2")) {
        $("#2").addClass(activeClass).siblings().removeClass(activeClass);
    } else if ($(this).is("#hw-3")) {
        $("#3").addClass(activeClass).siblings().removeClass(activeClass);
    } else if ($(this).is("#hw-4")) {
        $("#4").addClass(activeClass).siblings().removeClass(activeClass);
    } else if ($(this).is("#hw-5")) {
        $("#5").addClass(activeClass).siblings().removeClass(activeClass);
    } else if ($(this).is("#hw-6")) {
        window.open("https://t.me/qbekun");
    }
});
