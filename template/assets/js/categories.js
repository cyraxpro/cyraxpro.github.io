/* ==========================================================
   CATEGORIES PAGE
   - Add / edit / delete categories
   - Image preview (drag & drop or click)
   - Live search
   ========================================================== */

(function ($) {
  'use strict';

  /* --------------------------------------------------------
     SAMPLE DATA  (replace with backend later)
     image: dataURL or remote URL  |  icon: bootstrap-icon fallback
  -------------------------------------------------------- */
  var categories = [
    { id: 1,  name: 'Rings',           slug: 'rings',           image: '', icon: 'bi-gem',            productCount: 24 },
    { id: 2,  name: 'Watches',         slug: 'watches',         image: '', icon: 'bi-watch',          productCount: 18 },
    { id: 3,  name: 'Bags',            slug: 'bags',            image: '', icon: 'bi-handbag',        productCount: 32 },
    { id: 4,  name: 'Perfume',         slug: 'perfume',         image: '', icon: 'bi-droplet',        productCount: 14 },
    { id: 5,  name: 'Fine Jewelry',    slug: 'fine-jewelry',    image: '', icon: 'bi-circle-half',    productCount: 27 },
    { id: 6,  name: 'Accessories',     slug: 'accessories',     image: '', icon: 'bi-stars',          productCount: 41 },
    { id: 7,  name: 'Home & Living',   slug: 'home-living',     image: '', icon: 'bi-house-heart',    productCount: 12 },
    { id: 8,  name: 'Stationery',      slug: 'stationery',      image: '', icon: 'bi-journal',        productCount: 9  },
    { id: 9,  name: 'Necklaces',       slug: 'necklaces',       image: '', icon: 'bi-heart',          productCount: 21 },
    { id: 10, name: 'Earrings',        slug: 'earrings',        image: '', icon: 'bi-record-circle',  productCount: 19 },
    { id: 11, name: 'Bracelets',       slug: 'bracelets',       image: '', icon: 'bi-link-45deg',     productCount: 16 },
    { id: 12, name: 'Sunglasses',      slug: 'sunglasses',      image: '', icon: 'bi-eyeglasses',     productCount: 11 },
    { id: 13, name: 'Wallets',         slug: 'wallets',         image: '', icon: 'bi-wallet2',        productCount: 22 },
    { id: 14, name: 'Belts',           slug: 'belts',           image: '', icon: 'bi-bookmark',       productCount: 8  },
    { id: 15, name: 'Cufflinks',       slug: 'cufflinks',       image: '', icon: 'bi-app-indicator', productCount: 7  },
    { id: 16, name: 'Pens',            slug: 'pens',            image: '', icon: 'bi-pen',            productCount: 13 },
    { id: 17, name: 'Travel',          slug: 'travel',          image: '', icon: 'bi-luggage',        productCount: 10 },
    { id: 18, name: 'Footwear',        slug: 'footwear',        image: '', icon: 'bi-bricks',         productCount: 17 },
    { id: 19, name: 'Scarves',         slug: 'scarves',         image: '', icon: 'bi-bag-heart',      productCount: 12 },
    { id: 20, name: 'Crystal Ware',    slug: 'crystal-ware',    image: '', icon: 'bi-cup',            productCount: 6  },
    { id: 21, name: 'Decor',           slug: 'decor',           image: '', icon: 'bi-house',          productCount: 18 },
    { id: 22, name: 'Lighting',        slug: 'lighting',        image: '', icon: 'bi-lightbulb',      productCount: 9  },
    { id: 23, name: 'Robes',           slug: 'robes',           image: '', icon: 'bi-droplet-half',   productCount: 5  },
    { id: 24, name: 'Pendants',        slug: 'pendants',        image: '', icon: 'bi-tropical-storm', productCount: 14 },
    { id: 25, name: 'Gift Sets',       slug: 'gift-sets',       image: '', icon: 'bi-gift',           productCount: 26 }
  ];
  var nextId = 26;

  /* --------------------------------------------------------
     PAGINATION (load more)
  -------------------------------------------------------- */
  var PAGE_SIZE = 8;
  var showCount = PAGE_SIZE;

  /* --------------------------------------------------------
     STATE
  -------------------------------------------------------- */
  var editingId = null;
  var currentImage = '';   // dataURL of the picked image
  var searchQuery = '';

  /* --------------------------------------------------------
     CACHED ELEMENTS
  -------------------------------------------------------- */
  var $form = $('#categoryForm');
  var $name = $('#catName');
  var $slug = $('#catSlug');
  var $grid = $('#catGrid');
  var $search = $('#catSearch');

  var $imgInput   = $('#catImageInput');
  var $imgDrop    = $('#catImageDrop');
  var $imgPreview = $('#catImagePreview');
  var $clearImage = $('#clearImage');

  var $formTitle  = $('#catFormTitle');
  var $formSub    = $('#catFormSubtitle');
  var $formMode   = $('#catFormMode');
  var $formFoot   = $('#catFormFoot');
  var $btnLabel   = $('.btn-label', $form);
  var $cancelBtn  = $('#cancelEditBtn');

  /* --------------------------------------------------------
     INIT
  -------------------------------------------------------- */
  $(function () {
    bind();
    render();
  });

  /* --------------------------------------------------------
     EVENT BINDINGS
  -------------------------------------------------------- */
  function bind() {
    // Auto-slug while typing the name (only when slug is empty or in 'add' mode)
    $name.on('input', function () {
      if (!editingId && !$slug.data('touched')) {
        $slug.val(slugify($(this).val()));
      }
    });
    $slug.on('input', function () { $(this).data('touched', true); });

    // Image upload (click + drag&drop)
    $imgInput.on('change', function () {
      var f = this.files && this.files[0];
      if (f) loadImage(f);
    });

    $imgDrop.on('dragover dragenter', function (e) {
      e.preventDefault(); e.stopPropagation();
      $imgDrop.addClass('is-drag');
    });
    $imgDrop.on('dragleave dragend drop', function (e) {
      e.preventDefault(); e.stopPropagation();
      $imgDrop.removeClass('is-drag');
    });
    $imgDrop.on('drop', function (e) {
      var f = e.originalEvent.dataTransfer.files;
      if (f && f[0] && /^image\//.test(f[0].type)) loadImage(f[0]);
    });

    // Clear image
    $clearImage.on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      currentImage = '';
      $imgInput.val('');
      $imgPreview.html('<i class="bi bi-image"></i>');
      $imgDrop.removeClass('has-img');
    });

    // Form submit (add or update)
    $form.on('submit', function (e) {
      e.preventDefault();
      saveCategory();
    });

    // Cancel edit
    $cancelBtn.on('click', resetForm);

    // Search
    $search.on('input', function () {
      searchQuery = $.trim($(this).val()).toLowerCase();
      showCount = PAGE_SIZE; // reset when filtering
      render();
    });

    // Load more
    $('#lmBtn').on('click', function () {
      showCount += PAGE_SIZE;
      render();
      // Smooth scroll a bit to reveal newly added cards
      var $newItems = $grid.find('.cat-card').slice(showCount - PAGE_SIZE);
      if ($newItems.length) {
        $('html, body').animate({
          scrollTop: $newItems.first().offset().top - 120
        }, 300);
      }
    });

    // Grid actions (delegated)
    $grid.on('click', '.js-edit', function (e) {
      e.preventDefault();
      var id = parseInt($(this).closest('.cat-card').data('id'), 10);
      startEdit(id);
    });

    $grid.on('click', '.js-delete', function (e) {
      e.preventDefault();
      var id = parseInt($(this).closest('.cat-card').data('id'), 10);
      var cat = categories.find(function (c) { return c.id === id; });
      if (!cat) return;
      if (confirm('Delete category "' + cat.name + '"?')) {
        categories = categories.filter(function (c) { return c.id !== id; });
        if (editingId === id) resetForm();
        render();
      }
    });
  }

  /* --------------------------------------------------------
     ACTIONS
  -------------------------------------------------------- */
  function loadImage(file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      currentImage = e.target.result;
      $imgPreview.html('<img src="' + currentImage + '" alt="preview" />');
      $imgDrop.addClass('has-img');
    };
    reader.readAsDataURL(file);
  }

  function saveCategory() {
    var name = $.trim($name.val());
    var slug = $.trim($slug.val()) || slugify(name);

    if (!name) {
      $name.focus();
      return; // we don't add JS validation messages — backend handles it
    }

    if (editingId) {
      var c = categories.find(function (x) { return x.id === editingId; });
      if (c) {
        c.name = name;
        c.slug = slug;
        if (currentImage !== null) c.image = currentImage;
      }
    } else {
      categories.unshift({
        id: nextId++,
        name: name,
        slug: slug,
        image: currentImage || '',
        icon: 'bi-tag',
        productCount: 0
      });
      // Make sure the newly added card is visible
      showCount = Math.max(showCount, PAGE_SIZE);
    }

    resetForm();
    render();
  }

  function startEdit(id) {
    var c = categories.find(function (x) { return x.id === id; });
    if (!c) return;

    editingId = id;
    $name.val(c.name);
    $slug.val(c.slug).data('touched', true);

    currentImage = c.image || '';
    if (currentImage) {
      $imgPreview.html('<img src="' + currentImage + '" alt="preview" />');
      $imgDrop.addClass('has-img');
    } else {
      $imgPreview.html('<i class="bi ' + (c.icon || 'bi-image') + '"></i>');
      $imgDrop.removeClass('has-img');
    }

    $formTitle.text('Edit Category');
    $formSub.text('Update "' + c.name + '"');
    $formMode.html('<i class="bi bi-pencil"></i> Editing').addClass('editing');
    $btnLabel.text('Update Category');
    $formFoot.addClass('is-editing');

    $('html, body').animate({ scrollTop: $form.offset().top - 80 }, 250);
    render();
  }

  function resetForm() {
    editingId = null;
    currentImage = '';
    $name.val('');
    $slug.val('').removeData('touched');
    $imgInput.val('');
    $imgPreview.html('<i class="bi bi-image"></i>');
    $imgDrop.removeClass('has-img');

    $formTitle.text('Add Category');
    $formSub.text('Create a new product category');
    $formMode.html('<i class="bi bi-plus-circle"></i> New').removeClass('editing');
    $btnLabel.text('Add Category');
    $formFoot.removeClass('is-editing');
    render();
  }

  /* --------------------------------------------------------
     RENDER
  -------------------------------------------------------- */
  function render() {
    var data = categories.filter(function (c) {
      if (!searchQuery) return true;
      return c.name.toLowerCase().indexOf(searchQuery) !== -1 ||
             (c.slug && c.slug.toLowerCase().indexOf(searchQuery) !== -1);
    });

    var totalAll = categories.length;
    var totalFiltered = data.length;

    // Clamp showCount so it never exceeds the filtered total
    if (showCount > totalFiltered) showCount = Math.max(PAGE_SIZE, totalFiltered);
    var visible = data.slice(0, showCount);

    $('#catCountPill').text(totalAll + ' categor' + (totalAll === 1 ? 'y' : 'ies'));
    $('#catListSummary').text('Showing ' + visible.length + ' of ' + totalFiltered);

    // Empty state
    if (!totalFiltered) {
      $grid.html(
        '<div class="cat-empty">' +
          '<i class="bi bi-inbox"></i>' +
          '<div>No categories found.</div>' +
        '</div>'
      );
      updateLoadMore(0, 0);
      return;
    }

    var html = '';
    visible.forEach(function (c) {
      var isEditing = editingId === c.id;
      html += '<div class="cat-card ' + (isEditing ? 'is-editing' : '') + '" data-id="' + c.id + '">';

      html +=   '<div class="cat-thumb">';
      if (c.image) {
        html += '<img src="' + c.image + '" alt="' + escapeAttr(c.name) + '">';
      } else {
        html += '<i class="bi ' + (c.icon || 'bi-tag') + '"></i>';
      }
      html +=   '</div>';

      html +=   '<div class="cat-info">';
      html +=     '<div style="min-width:0;">';
      html +=       '<strong>' + escapeHtml(c.name) + '</strong>';
      html +=       '<small>' + (c.productCount || 0) + ' products</small>';
      html +=     '</div>';
      html +=     '<div class="cat-actions">';
      html +=       '<button class="action-btn edit js-edit" title="Edit"><i class="bi bi-pencil"></i></button>';
      html +=       '<button class="action-btn delete js-delete" title="Delete"><i class="bi bi-trash"></i></button>';
      html +=     '</div>';
      html +=   '</div>';

      html += '</div>';
    });
    $grid.html(html);

    updateLoadMore(visible.length, totalFiltered);
  }

  function updateLoadMore(visible, total) {
    var $bar = $('#catLoadMore');
    var $info = $('#lmInfo');
    var $btn = $('#lmBtn');

    if (!total) {
      $bar.addClass('is-empty').removeClass('is-done');
      return;
    }
    $bar.removeClass('is-empty');

    var remaining = total - visible;
    $info.html('Showing <strong>' + visible + '</strong> of <strong>' + total + '</strong>');

    if (remaining <= 0) {
      $bar.addClass('is-done');
    } else {
      $bar.removeClass('is-done');
      var nextChunk = Math.min(PAGE_SIZE, remaining);
      $btn.find('span').text('Load more (' + nextChunk + ' of ' + remaining + ')');
    }
  }

  /* --------------------------------------------------------
     UTILS
  -------------------------------------------------------- */
  function slugify(s) {
    return String(s)
      .toLowerCase()
      .trim()
      .replace(/&/g, '-and-')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function escapeAttr(s) { return escapeHtml(s); }
})(jQuery);
