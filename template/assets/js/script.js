/* ==========================================================
   LUXURY ADMIN PANEL — COMMON JS
   ========================================================== */

(function ($) {
  'use strict';

  /* --------------------------------------------------------
     THEME (Dark Mode) — apply ASAP from localStorage
  -------------------------------------------------------- */
  var THEME_KEY = 'lx-admin-theme';
  var savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'dark') {
    $('html').addClass('dark-mode');
  }

  $(function () {
    if (savedTheme === 'dark') {
      $('body').addClass('dark-mode');
    }
    syncThemeIcon();

    /* ------------------------------------------------------
       PAGE LOADER — hide as soon as the DOM is ready
    ------------------------------------------------------ */
    $('#pageLoader').addClass('hide');

    /* ------------------------------------------------------
       SIDEBAR TOGGLE
    ------------------------------------------------------ */
    var $body = $('body');

    $(document).on('click', '#sidebarToggle, .js-sidebar-toggle', function (e) {
      e.preventDefault();

      if (window.matchMedia('(max-width: 991px)').matches) {
        $body.toggleClass('sidebar-open');
        $('.sidebar-overlay').toggleClass('show', $body.hasClass('sidebar-open'));
      } else {
        $body.toggleClass('sidebar-collapsed');
        try {
          localStorage.setItem('lx-sidebar', $body.hasClass('sidebar-collapsed') ? 'collapsed' : 'expanded');
        } catch (err) { /* ignore */ }
      }
    });

    if (localStorage.getItem('lx-sidebar') === 'collapsed' &&
        !window.matchMedia('(max-width: 991px)').matches) {
      $body.addClass('sidebar-collapsed');
    }

    $(document).on('click', '.sidebar-overlay', function () {
      $body.removeClass('sidebar-open');
      $(this).removeClass('show');
    });

    $('.sidebar-menu a').on('click', function () {
      if (window.matchMedia('(max-width: 991px)').matches) {
        $body.removeClass('sidebar-open');
        $('.sidebar-overlay').removeClass('show');
      }
    });

    var lastIsMobile = window.matchMedia('(max-width: 991px)').matches;
    $(window).on('resize', function () {
      var isMobile = window.matchMedia('(max-width: 991px)').matches;
      if (isMobile !== lastIsMobile) {
        $body.removeClass('sidebar-open');
        $('.sidebar-overlay').removeClass('show');
        lastIsMobile = isMobile;
      }
    });

    /* ------------------------------------------------------
       DARK MODE TOGGLE
    ------------------------------------------------------ */
    $(document).on('click', '.js-theme-toggle', function (e) {
      e.preventDefault();
      var isDark = $body.toggleClass('dark-mode').hasClass('dark-mode');
      $('html').toggleClass('dark-mode', isDark);
      try {
        localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
      } catch (err) { /* ignore */ }
      syncThemeIcon();
    });

    /* ------------------------------------------------------
       PROFILE DROPDOWN
    ------------------------------------------------------ */
    $(document).on('click', '.js-profile-toggle', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $('.notif-menu').removeClass('show');
      $('.profile-menu').toggleClass('show');
    });

    /* ------------------------------------------------------
       NOTIFICATION DROPDOWN
    ------------------------------------------------------ */
    $(document).on('click', '.js-notif-toggle', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $('.profile-menu').removeClass('show');
      $('.notif-menu').toggleClass('show');
    });

    // Mark single notification as read
    $(document).on('click', '.notif-list li.unread', function () {
      $(this).removeClass('unread');
      updateNotifBadge();
    });

    // Mark all read
    $(document).on('click', '.js-notif-mark-all', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $('.notif-list li').removeClass('unread');
      updateNotifBadge();
    });

    // Close menus when clicking outside
    $(document).on('click', function (e) {
      if (!$(e.target).closest('.profile-dropdown').length) {
        $('.profile-menu').removeClass('show');
      }
      if (!$(e.target).closest('.notif-dropdown').length) {
        $('.notif-menu').removeClass('show');
      }
    });

    // Close on ESC
    $(document).on('keyup', function (e) {
      if (e.key === 'Escape') {
        $('.profile-menu, .notif-menu').removeClass('show');
        $body.removeClass('sidebar-open');
        $('.sidebar-overlay').removeClass('show');
      }
    });

    // Initialize badge
    updateNotifBadge();

    /* ------------------------------------------------------
       PASSWORD SHOW / HIDE TOGGLE
    ------------------------------------------------------ */
    $(document).on('click', '.js-toggle-pass', function (e) {
      e.preventDefault();
      var $btn = $(this);
      var $input = $btn.closest('.input-icon').find('input');
      var $i = $btn.find('i');
      if ($input.attr('type') === 'password') {
        $input.attr('type', 'text');
        $i.removeClass('bi-eye').addClass('bi-eye-slash');
      } else {
        $input.attr('type', 'password');
        $i.removeClass('bi-eye-slash').addClass('bi-eye');
      }
      $input.trigger('focus');
    });
  });

  /* --------------------------------------------------------
     HELPERS (exposed on window.LxAdmin for reuse)
  -------------------------------------------------------- */
  function syncThemeIcon() {
    var isDark = $('body').hasClass('dark-mode') || $('html').hasClass('dark-mode');
    var $icon = $('.js-theme-toggle i');
    if (!$icon.length) return;
    if (isDark) {
      $icon.removeClass('bi-moon-stars').addClass('bi-sun');
    } else {
      $icon.removeClass('bi-sun').addClass('bi-moon-stars');
    }
  }

  function updateNotifBadge() {
    var $badge = $('.notif-badge');
    if (!$badge.length) return;
    var count = $('.notif-list li.unread').length;
    if (count > 0) {
      $badge.removeClass('empty').text(count > 9 ? '9+' : count);
    } else {
      $badge.addClass('empty').text('');
    }
  }

  function showLoader() { $('#btnLoader').addClass('show'); }
  function hideLoader() { $('#btnLoader').removeClass('show'); }

  window.LxAdmin = {
    showLoader: showLoader,
    hideLoader: hideLoader,
    updateNotifBadge: updateNotifBadge
  };
})(jQuery);
