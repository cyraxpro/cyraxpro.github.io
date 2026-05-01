/* ==========================================================
   PRODUCT VIEW PAGE
   - Gallery: thumbnail click swaps the main image
   - Keyboard arrows navigate the gallery
   - Zoom button opens the current image in a new tab
   ========================================================== */

(function ($) {
  'use strict';

  $(function () {
    var $main = $('#pvMainImg');
    var $thumbs = $('#pvThumbs');
    var $zoom = $('#pvZoomBtn');

    /* ------------------------------------------------------
       Thumbnail click — swap main image
    ------------------------------------------------------ */
    $thumbs.on('click', '.pv-thumb', function () {
      var src = $(this).data('img');
      if (!src) return;
      activate($(this));
    });

    /* ------------------------------------------------------
       Keyboard arrows — prev / next thumbnail
    ------------------------------------------------------ */
    $(document).on('keydown', function (e) {
      if ($(e.target).is('input, textarea, select')) return;
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

      var $list = $thumbs.find('.pv-thumb');
      var idx = $list.index($list.filter('.active'));
      if (idx < 0) return;

      var next = e.key === 'ArrowRight' ? idx + 1 : idx - 1;
      if (next < 0) next = $list.length - 1;
      if (next >= $list.length) next = 0;
      activate($list.eq(next));
    });

    /* ------------------------------------------------------
       Zoom button — open the active image in a new tab
    ------------------------------------------------------ */
    $zoom.on('click', function () {
      var src = $main.attr('src');
      if (src) window.open(src, '_blank', 'noopener');
    });

    function activate($t) {
      var src = $t.data('img');
      if (!src) return;

      // Smooth fade swap
      $main.css('opacity', 0);
      var loader = new Image();
      loader.onload = function () {
        $main.attr('src', src).css('opacity', 1);
      };
      loader.onerror = function () { $main.css('opacity', 1); };
      loader.src = src;

      $thumbs.find('.pv-thumb').removeClass('active');
      $t.addClass('active');
    }
  });
})(jQuery);
