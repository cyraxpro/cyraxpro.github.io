/* =====================================================
   SHOPMART — COMMON SCRIPT
   Loader, sticky header, mobile menu, smooth scroll,
   wishlist, add-to-cart, toast, popup, scroll reveal.
   Loaded on every page. Uses safety guards so missing
   elements (e.g. trending slider on contact.html) don't
   throw errors.
   ===================================================== */

/* ===================================================
   PAGE LOADER (fires on full window load)
   =================================================== */
window.addEventListener("load", function () {
  var loader = document.getElementById("pageLoader");
  if (!loader) return;
  setTimeout(function () {
    loader.classList.add("hidden");
    setTimeout(function () { loader.parentNode && loader.parentNode.removeChild(loader); }, 700);
  }, 350);
});

// Safety fallback — never block beyond 6s
setTimeout(function () {
  var loader = document.getElementById("pageLoader");
  if (loader && !loader.classList.contains("hidden")) {
    loader.classList.add("hidden");
  }
}, 6000);

/* ===================================================
   GLOBAL TOAST HELPER (exposed for sub-page scripts)
   =================================================== */
var __toastTimer;
window.showToast = function (message, iconClass) {
  var toast = document.getElementById("toastMsg");
  if (!toast) return;
  var icon = toast.querySelector("i");
  var text = document.getElementById("toastText");
  if (icon) icon.className = "fa-solid " + (iconClass || "fa-circle-check");
  if (text) text.textContent = message || "";
  toast.classList.add("show");
  clearTimeout(__toastTimer);
  __toastTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2400);
};

(function ($) {
  "use strict";

  $(function () {

    var $header   = $("#siteHeader");
    var $backTop  = $("#backToTop");

    /* ===================================================
       1. STICKY HEADER + BACK-TO-TOP
       =================================================== */
    $(window).on("scroll", function () {
      var sc = $(window).scrollTop();
      $header.toggleClass("scrolled", sc > 30);
      $backTop.toggleClass("visible", sc > 400);
    });

    /* ===================================================
       2. MOBILE MENU
       =================================================== */
    var $hamburger = $("#hamburgerBtn");
    var $mainNav   = $("#mainNav");
    var $overlay   = $("#mobileOverlay");

    function closeMobileNav() {
      $hamburger.removeClass("active");
      $mainNav.removeClass("open");
      $overlay.removeClass("active");
      $("body").css("overflow", "");
    }

    $hamburger.on("click", function () {
      $(this).toggleClass("active");
      $mainNav.toggleClass("open");
      $overlay.toggleClass("active");
      $("body").css("overflow", $mainNav.hasClass("open") ? "hidden" : "");
    });

    $overlay.on("click", closeMobileNav);

    // Forward mouse-wheel scroll anywhere on the page to the scrollable nav
    // list inside the drawer — fixes scroll in desktop responsive devtools view
    // where the cursor is often over the overlay rather than over the menu.
    $(document).on("wheel.drawerScroll", function (e) {
      if (!$mainNav.hasClass("open")) return;
      var listEl = $mainNav.find(".nav-list").get(0);
      if (!listEl) return;
      var target = e.target;
      if (listEl === target || $.contains(listEl, target)) return; // native scroll inside list
      listEl.scrollTop += e.originalEvent.deltaY;
      e.preventDefault();
    });

    $(document).on("click", ".mobile-drawer-close", function (e) {
      e.preventDefault();
      closeMobileNav();
    });

    $mainNav.on("click", "a", function () {
      var href = $(this).attr("href") || "";
      // Close drawer when navigating in-page anchors (or external link clicks)
      if (href.indexOf("#") === 0 && href.length > 1) closeMobileNav();
    });

    // Mobile dropdown toggle
    $(".has-dropdown > a").on("click", function (e) {
      if ($(window).width() <= 991) {
        e.preventDefault();
        $(this).parent().toggleClass("open");
      }
    });

    /* ===================================================
       2b. USER MENU DROPDOWN (logged-in)
       =================================================== */
    var $userMenu = $(".user-menu");
    if ($userMenu.length) {
      $userMenu.find(".user-menu-toggle").on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        $userMenu.toggleClass("open");
      });

      // Close when clicking outside
      $(document).on("click", function (e) {
        if (!$(e.target).closest(".user-menu").length) {
          $userMenu.removeClass("open");
        }
      });

      // Close on Escape
      $(document).on("keydown", function (e) {
        if (e.key === "Escape") $userMenu.removeClass("open");
      });

      // Logout demo
      $userMenu.on("click", "a.logout", function (e) {
        e.preventDefault();
        $userMenu.removeClass("open");
        if (typeof window.showToast === "function") {
          window.showToast("You've been logged out", "fa-arrow-right-from-bracket");
        }
      });
    }

    /* ===================================================
       3. HEADER SEARCH FORM
       =================================================== */
    $(".header-search").on("submit", function (e) {
      e.preventDefault();
      var query = $(this).find("input").val().trim();
      if (query) window.showToast('Searching for "' + query + '"...', "fa-magnifying-glass");
    });

    /* ===================================================
       4. BACK-TO-TOP
       =================================================== */
    $backTop.on("click", function () {
      $("html, body").animate({ scrollTop: 0 }, 500);
    });

    /* ===================================================
       5. SMOOTH SCROLL (in-page anchors)
       =================================================== */
    $('a[href^="#"]').not('[data-bs-toggle], [data-bs-target]').on("click", function (e) {
      var target = $(this).attr("href");
      if (target && target.length > 1 && $(target).length) {
        e.preventDefault();
        var headerH = ($header.outerHeight() || 0) + 20;
        $("html, body").animate({
          scrollTop: $(target).offset().top - headerH
        }, 600);
      }
    });

    /* ===================================================
       6. WISHLIST TOGGLE (common product cards)
       =================================================== */
    $(document).on("click", ".wishlist-btn", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var $btn = $(this);
      $btn.toggleClass("active");
      var $icon = $btn.find("i");
      if ($btn.hasClass("active")) {
        $icon.removeClass("fa-regular").addClass("fa-solid");
        window.showToast("Added to wishlist", "fa-heart");
      } else {
        $icon.removeClass("fa-solid").addClass("fa-regular");
        window.showToast("Removed from wishlist", "fa-heart-crack");
      }
    });

    /* ===================================================
       7. ADD TO CART (card grid)
       =================================================== */
    $(document).on("click", ".add-cart-btn", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var name = $(this).closest(".product-card").find(".product-name").text().trim() || "Item";
      window.showToast(name + " added to cart", "fa-circle-check");

      var $cartBadge = $('.action-btn[aria-label="Cart"] .badge-count');
      if ($cartBadge.length) {
        var cur = parseInt($cartBadge.text(), 10) || 0;
        $cartBadge.text(cur + 1);
        $cartBadge.parent().css("transform", "scale(1.15)");
        setTimeout(function () { $cartBadge.parent().css("transform", ""); }, 250);
      }
    });

    /* ===================================================
       8. PRODUCT FILTER TABS (home only, safe-guarded)
       =================================================== */
    if ($(".filter-tab").length) {
      $(".filter-tab").on("click", function () {
        var $tab = $(this);
        var filter = $tab.data("filter");
        $(".filter-tab").removeClass("active");
        $tab.addClass("active");

        var $cards = $(".products-section .product-card");
        $cards.addClass("hidden");
        if (filter === "all") {
          $cards.removeClass("hidden");
        } else {
          $cards.filter('[data-category="' + filter + '"]').removeClass("hidden");
        }
      });
    }

    /* ===================================================
       9. TRENDING SLIDER (home only, safe-guarded)
       =================================================== */
    var $track = $(".trending-track");
    if ($track.length) {
      var $prev = $("#trendPrev");
      var $next = $("#trendNext");
      var slideIndex = 0;

      function getVisible() {
        var w = $(window).width();
        if (w <= 575) return 1;
        if (w <= 767) return 2;
        if (w <= 991) return 2;
        if (w <= 1199) return 3;
        return 4;
      }

      function update() {
        var totalCards = $track.children().length;
        var visible = getVisible();
        var maxIndex = Math.max(0, totalCards - visible);
        if (slideIndex > maxIndex) slideIndex = maxIndex;
        if (slideIndex < 0) slideIndex = 0;

        var card = $track.children().first();
        var cardW = card.outerWidth(true) || 0;

        if ($(window).width() <= 767) {
          $track.css("transform", "");
        } else {
          $track.css("transform", "translateX(" + (-slideIndex * cardW) + "px)");
        }

        $prev.prop("disabled", slideIndex === 0);
        $next.prop("disabled", slideIndex >= maxIndex);
      }

      $next.on("click", function () { slideIndex++; update(); });
      $prev.on("click", function () { slideIndex--; update(); });

      setTimeout(update, 100);
      var rt;
      $(window).on("resize", function () {
        clearTimeout(rt);
        rt = setTimeout(update, 150);
      });
    }

    /* ===================================================
       10. POPUP OFFER (home only, safe-guarded)
       =================================================== */
    var $popup = $("#popupOverlay");
    if ($popup.length) {
      var popupShown = false;
      var $popupClose = $("#popupClose");

      function showPopup() {
        if (popupShown) return;
        try { if (sessionStorage.getItem("popupDismissed") === "1") return; } catch (err) {}
        popupShown = true;
        $popup.addClass("active");
        $("body").css("overflow", "hidden");
      }

      function hidePopup() {
        $popup.removeClass("active");
        $("body").css("overflow", "");
        try { sessionStorage.setItem("popupDismissed", "1"); } catch (err) {}
      }

      setTimeout(showPopup, 8000);

      $(window).on("scroll.popup", function () {
        var sp = $(window).scrollTop() + $(window).height();
        var dh = $(document).height();
        if (sp / dh > 0.4) {
          showPopup();
          $(window).off("scroll.popup");
        }
      });

      $popupClose.on("click", hidePopup);
      $popup.on("click", function (e) { if (e.target === this) hidePopup(); });
      $(document).on("keydown", function (e) {
        if (e.key === "Escape" && $popup.hasClass("active")) hidePopup();
      });

      $(".popup-form").on("submit", function (e) {
        e.preventDefault();
        hidePopup();
        setTimeout(function () {
          window.showToast("Discount code sent to your email", "fa-envelope-circle-check");
        }, 350);
      });
    }

    /* ===================================================
       11. NEWSLETTER FORM
       =================================================== */
    $(".newsletter-form").on("submit", function (e) {
      e.preventDefault();
      $(this).find("input").val("");
      window.showToast("Subscribed successfully", "fa-circle-check");
    });

    /* ===================================================
       12. CONTACT FORM (contact page) — no validation
       =================================================== */
    var $contactForm = $("#contactForm");
    if ($contactForm.length) {
      $contactForm.on("submit", function (e) {
        e.preventDefault();
        window.showToast("Message sent — we'll be in touch", "fa-paper-plane");
        this.reset();
      });
    }

    /* ===================================================
       13. AUTH PAGES — login.html / signup.html
       Password toggle + simple submit (no validation)
       =================================================== */

    // Password show / hide toggle
    $(".password-toggle").on("click", function () {
      var $btn = $(this);
      var targetId = $btn.data("target");
      var $input = $("#" + targetId);
      if (!$input.length) return;
      var isPwd = $input.attr("type") === "password";
      $input.attr("type", isPwd ? "text" : "password");
      $btn.find("i").attr("class", isPwd ? "fa-regular fa-eye-slash" : "fa-regular fa-eye");
      $btn.attr("aria-label", isPwd ? "Hide password" : "Show password");
    });

    // Login form submit — no validation
    var $loginForm = $("#loginForm");
    if ($loginForm.length) {
      $loginForm.on("submit", function (e) {
        e.preventDefault();
        window.showToast("Welcome back! Signing you in...", "fa-circle-check");
        setTimeout(function () { window.location.href = "index.html"; }, 1000);
      });
    }

    // Signup form submit — no validation
    var $signupForm = $("#signupForm");
    if ($signupForm.length) {
      $signupForm.on("submit", function (e) {
        e.preventDefault();
        window.showToast("Account created! Welcome to ShopMart.", "fa-circle-check");
        setTimeout(function () { window.location.href = "index.html"; }, 1200);
      });
    }

    // Google sign-in button (demo)
    $(".btn-social").on("click", function () {
      window.showToast("Connecting to Google...", "fa-circle-notch");
    });

    /* ===================================================
       14. SCROLL REVEAL (IntersectionObserver)
       =================================================== */
    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      $(revealEls).addClass("in-view");
    }

    /* ===================================================
       15. PREVENT-DEFAULT FOR DEMO LINKS
       =================================================== */
    $(".action-btn").on("click", function (e) {
      if ($(this).attr("href") === "#") e.preventDefault();
    });

  });

})(jQuery);
