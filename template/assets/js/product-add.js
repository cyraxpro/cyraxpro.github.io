/* ==========================================================
   PRODUCT ADD — TWO-STEP FORM
   - Stepper navigation
   - Select2 dropdowns
   - Drag & drop image upload + reorder + thumbnail pick
   - Single video upload with preview
   ========================================================== */

(function ($) {
  'use strict';

  /* --------------------------------------------------------
     STATE
  -------------------------------------------------------- */
  var totalSteps = 2;
  var currentStep = 1;

  // images = [{ id, file, dataUrl }]
  var images = [];
  var thumbIndex = 0;
  var imgUid = 0;

  /* --------------------------------------------------------
     INIT
  -------------------------------------------------------- */
  $(function () {
    initSelect2();
    initStepper();
    initImageUploader();
    initVideoUploader();
    initSortable();
    initSubmit();
  });

  /* --------------------------------------------------------
     SELECT2
  -------------------------------------------------------- */
  function initSelect2() {
    if (!$.fn.select2) return;

    $('#pCategory').select2({
      placeholder: 'Select category',
      allowClear: true,
      width: '100%'
    });

    $('#pBrand').select2({
      placeholder: 'Select brand',
      allowClear: true,
      width: '100%'
    });
  }

  /* --------------------------------------------------------
     STEPPER
  -------------------------------------------------------- */
  function initStepper() {
    $('#nextStep').on('click', function () {
      if (currentStep < totalSteps) goToStep(currentStep + 1);
    });

    $('#prevStep').on('click', function () {
      if (currentStep > 1) goToStep(currentStep - 1);
    });

    // Click on a completed step circle to jump back
    $('.stepper .step').on('click', function () {
      var step = parseInt($(this).data('step'), 10);
      if (step < currentStep) goToStep(step);
    });
  }

  function goToStep(step) {
    currentStep = step;

    $('.step-pane').addClass('is-hidden');
    $('.step-pane[data-pane="' + step + '"]').removeClass('is-hidden');

    // Update step indicators
    $('.stepper .step').each(function () {
      var s = parseInt($(this).data('step'), 10);
      $(this).removeClass('is-active is-done');
      if (s < step)       $(this).addClass('is-done');
      else if (s === step) $(this).addClass('is-active');
    });

    // Animate the connector
    $('#stepLine').toggleClass('is-done', step > 1);

    // Buttons
    $('#prevStep').prop('disabled', step === 1);
    if (step === totalSteps) {
      $('#nextStep').hide();
      $('#submitBtn').show();
    } else {
      $('#nextStep').show();
      $('#submitBtn').hide();
    }

    // Scroll the form into view
    $('html, body').animate({
      scrollTop: $('#productAddForm').offset().top - 80
    }, 250);
  }

  /* --------------------------------------------------------
     IMAGE UPLOADER (drag & drop + click)
  -------------------------------------------------------- */
  function initImageUploader() {
    var $dz = $('#imageDropzone');
    var $input = $('#imageInput');

    // Click on dropzone opens file picker (label handles it; we add safety)
    $dz.on('click', function (e) {
      if ($(e.target).closest('.img-card').length) return; // ignore clicks on previews
    });

    $input.on('change', function () {
      handleFiles(this.files);
      this.value = '';
    });

    // Drag events
    $dz.on('dragover dragenter', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $dz.addClass('is-drag');
    });
    $dz.on('dragleave dragend drop', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $dz.removeClass('is-drag');
    });
    $dz.on('drop', function (e) {
      var files = e.originalEvent.dataTransfer.files;
      handleFiles(files);
    });

    // Image actions (delegated)
    $('#imageGrid').on('click', '.set-thumb', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var id = parseInt($(this).closest('.img-card').data('uid'), 10);
      var idx = images.findIndex(function (i) { return i.id === id; });
      if (idx >= 0) {
        thumbIndex = idx;
        renderImages();
      }
    });

    $('#imageGrid').on('click', '.remove-img', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var id = parseInt($(this).closest('.img-card').data('uid'), 10);
      var idx = images.findIndex(function (i) { return i.id === id; });
      if (idx < 0) return;

      images.splice(idx, 1);

      // Maintain thumb selection
      if (thumbIndex === idx) {
        thumbIndex = 0;
      } else if (thumbIndex > idx) {
        thumbIndex--;
      }
      if (thumbIndex >= images.length) thumbIndex = Math.max(0, images.length - 1);

      renderImages();
    });
  }

  function handleFiles(fileList) {
    if (!fileList || !fileList.length) return;

    var arr = Array.prototype.slice.call(fileList);
    arr.forEach(function (file) {
      if (!/^image\//.test(file.type)) return;
      var reader = new FileReader();
      reader.onload = function (e) {
        images.push({
          id: ++imgUid,
          file: file,
          dataUrl: e.target.result,
          name: file.name
        });
        renderImages();
      };
      reader.readAsDataURL(file);
    });
  }

  function renderImages() {
    var $grid = $('#imageGrid');
    if (!images.length) {
      $grid.empty();
      $('#thumbnailIndex').val('');
      return;
    }

    var html = '';
    images.forEach(function (img, idx) {
      var isThumb = idx === thumbIndex;
      html += '<div class="img-card ' + (isThumb ? 'is-thumb' : '') + '" data-uid="' + img.id + '">';
      html +=   '<span class="img-order">#' + (idx + 1) + '</span>';
      html +=   '<img src="' + img.dataUrl + '" alt="' + escapeAttr(img.name) + '">';
      html +=   '<div class="img-actions">';
      html +=     '<button type="button" class="ico-btn set-thumb ' + (isThumb ? 'is-thumb' : '') + '" title="Set as thumbnail">';
      html +=       '<i class="bi bi-' + (isThumb ? 'star-fill' : 'star') + '"></i>';
      html +=     '</button>';
      html +=     '<button type="button" class="ico-btn danger remove-img" title="Remove">';
      html +=       '<i class="bi bi-trash"></i>';
      html +=     '</button>';
      html +=   '</div>';
      html += '</div>';
    });
    $grid.html(html);
    $('#thumbnailIndex').val(thumbIndex);
  }

  function initSortable() {
    if (typeof Sortable === 'undefined') return;

    var grid = document.getElementById('imageGrid');
    if (!grid) return;

    Sortable.create(grid, {
      animation: 180,
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'dragging',
      onEnd: function (evt) {
        // Reorder our images array to match the DOM
        var newOrder = [];
        $('#imageGrid .img-card').each(function () {
          var id = parseInt($(this).data('uid'), 10);
          var img = images.find(function (i) { return i.id === id; });
          if (img) newOrder.push(img);
        });

        // Track which image was the thumbnail before reordering
        var prevThumbId = images[thumbIndex] ? images[thumbIndex].id : null;
        images = newOrder;

        if (prevThumbId !== null) {
          var newIdx = images.findIndex(function (i) { return i.id === prevThumbId; });
          if (newIdx >= 0) thumbIndex = newIdx;
        }

        renderImages();
      }
    });
  }

  /* --------------------------------------------------------
     VIDEO UPLOADER
  -------------------------------------------------------- */
  function initVideoUploader() {
    var $dz = $('#videoDropzone');
    var $input = $('#videoInput');
    var $preview = $('#videoPreview');

    $input.on('change', function () {
      var file = this.files && this.files[0];
      if (!file) return;
      showVideo(file);
    });

    $dz.on('dragover dragenter', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $dz.addClass('is-drag');
    });
    $dz.on('dragleave dragend drop', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $dz.removeClass('is-drag');
    });
    $dz.on('drop', function (e) {
      var f = e.originalEvent.dataTransfer.files;
      if (f && f[0] && /^video\//.test(f[0].type)) {
        // Set as the input's files so it's submitted with the form
        try {
          var dt = new DataTransfer();
          dt.items.add(f[0]);
          $input[0].files = dt.files;
        } catch (err) { /* older browsers */ }
        showVideo(f[0]);
      }
    });

    $preview.on('click', '.remove-video', function () {
      $input.val('');
      try {
        var dt = new DataTransfer();
        $input[0].files = dt.files;
      } catch (err) { /* ignore */ }
      $preview.empty();
    });

    function showVideo(file) {
      var url = URL.createObjectURL(file);
      var size = formatSize(file.size);
      var html = '' +
        '<div class="video-preview">' +
          '<video src="' + url + '" controls preload="metadata"></video>' +
          '<div class="video-meta">' +
            '<i class="bi bi-camera-reels"></i>' +
            '<strong>' + escapeHtml(file.name) + '</strong>' +
            '<span>' + size + '</span>' +
            '<button type="button" class="remove-video"><i class="bi bi-trash"></i> Remove</button>' +
          '</div>' +
        '</div>';
      $preview.html(html);
    }
  }

  /* --------------------------------------------------------
     SUBMIT
  -------------------------------------------------------- */
  function initSubmit() {
    $('#productAddForm').on('submit', function (e) {
      e.preventDefault();

      // Sync hidden thumbnail index
      $('#thumbnailIndex').val(thumbIndex);

      var $btn = $('#submitBtn');
      var html = $btn.html();
      $btn.prop('disabled', true)
          .html('<i class="bi bi-arrow-repeat spin me-1"></i> Saving...');

      // Demo: simulate save then redirect
      setTimeout(function () {
        $btn.prop('disabled', false).html(html);
        if (window.LxAdmin && window.LxAdmin.toast) {
          window.LxAdmin.toast('Product saved successfully');
        }
        window.location.href = 'products.html';
      }, 800);
    });
  }

  /* --------------------------------------------------------
     UTILS
  -------------------------------------------------------- */
  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function escapeAttr(s) { return escapeHtml(s); }
})(jQuery);
