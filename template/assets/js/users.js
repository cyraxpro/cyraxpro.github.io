/* ==========================================================
   USERS PAGE JS — UI helpers only (no validation)
   ========================================================== */

(function ($) {
  'use strict';

  $(function () {
    var $fileInput = $('#avatarInput');
    var $preview   = $('#avatarPreview');

    /* ------------------------------------------------------
       Avatar uploader — open picker + live preview
    ------------------------------------------------------ */
    $('.upload-trigger').on('click', function () {
      $fileInput.trigger('click');
    });

    $fileInput.on('change', function () {
      var file = this.files && this.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (e) {
        $preview.html('<img src="' + e.target.result + '" alt="avatar preview">');
      };
      reader.readAsDataURL(file);
    });
  });
})(jQuery);
