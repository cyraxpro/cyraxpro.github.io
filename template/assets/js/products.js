/* ==========================================================
   PRODUCTS PAGE — lightweight datatable
   - filtering (name, status, date)
   - pagination (with page-size selector)
   - inline status toggle (active / inactive)
   - row actions (view / edit / delete)
   ========================================================== */

(function ($) {
  'use strict';

  /* --------------------------------------------------------
     SAMPLE DATA  (replace with backend fetch later)
     icon = bootstrap-icon name (used as placeholder image)
  -------------------------------------------------------- */
  var products = [
    { id: 1,  name: "Diamond Solitaire Ring",  sku: "DSR-204", price: 482000, oldPrice: 525000, status: "active",   date: "2026-04-21", icon: "bi-gem"          },
    { id: 2,  name: "Heritage Gold Watch",     sku: "HGW-118", price: 321500, oldPrice: 355000, status: "active",   date: "2026-04-19", icon: "bi-watch"        },
    { id: 3,  name: "Aurora Leather Tote",     sku: "ALT-077", price: 198200, oldPrice: 0,      status: "active",   date: "2026-04-18", icon: "bi-handbag"      },
    { id: 4,  name: "Rose Oud Eau de Parfum",  sku: "ROD-310", price: 14280,  oldPrice: 16500,  status: "active",   date: "2026-04-17", icon: "bi-droplet"      },
    { id: 5,  name: "Sapphire Drop Earrings",  sku: "SDE-051", price: 89500,  oldPrice: 0,      status: "inactive", date: "2026-04-15", icon: "bi-gem"          },
    { id: 6,  name: "Silk Cashmere Scarf",     sku: "SCS-022", price: 24800,  oldPrice: 28000,  status: "active",   date: "2026-04-14", icon: "bi-bag-heart"    },
    { id: 7,  name: "Pearl Strand Necklace",   sku: "PSN-099", price: 154000, oldPrice: 0,      status: "active",   date: "2026-04-13", icon: "bi-circle"       },
    { id: 8,  name: "Crystal Tumbler Set",     sku: "CTS-301", price: 12400,  oldPrice: 14500,  status: "inactive", date: "2026-04-10", icon: "bi-cup"          },
    { id: 9,  name: "Italian Leather Wallet",  sku: "ILW-088", price: 18900,  oldPrice: 0,      status: "active",   date: "2026-04-09", icon: "bi-wallet2"      },
    { id: 10, name: "Vintage Cufflinks",       sku: "VCL-012", price: 32500,  oldPrice: 0,      status: "active",   date: "2026-04-08", icon: "bi-stars"        },
    { id: 11, name: "Embossed Travel Trunk",   sku: "ETT-045", price: 245000, oldPrice: 280000, status: "active",   date: "2026-04-06", icon: "bi-suitcase2"    },
    { id: 12, name: "Velvet Evening Clutch",   sku: "VEC-014", price: 36800,  oldPrice: 0,      status: "inactive", date: "2026-04-05", icon: "bi-bag"          },
    { id: 13, name: "Designer Sunglasses",     sku: "DSG-203", price: 28900,  oldPrice: 32000,  status: "active",   date: "2026-04-03", icon: "bi-eyeglasses"   },
    { id: 14, name: "Engraved Fountain Pen",   sku: "EFP-110", price: 14200,  oldPrice: 0,      status: "active",   date: "2026-04-01", icon: "bi-pen"          },
    { id: 15, name: "Art Deco Bracelet",       sku: "ADB-058", price: 64500,  oldPrice: 72000,  status: "active",   date: "2026-03-29", icon: "bi-circle-half"  },
    { id: 16, name: "Hand-stitched Loafers",   sku: "HSL-076", price: 38400,  oldPrice: 0,      status: "inactive", date: "2026-03-26", icon: "bi-bricks"       },
    { id: 17, name: "Embroidered Silk Robe",   sku: "ESR-031", price: 41200,  oldPrice: 46000,  status: "active",   date: "2026-03-24", icon: "bi-droplet-half" },
    { id: 18, name: "Marble Chess Set",        sku: "MCS-007", price: 58900,  oldPrice: 0,      status: "active",   date: "2026-03-22", icon: "bi-grid-3x3"     },
    { id: 19, name: "Crocodile Leather Belt",  sku: "CLB-040", price: 21500,  oldPrice: 0,      status: "active",   date: "2026-03-20", icon: "bi-link-45deg"   },
    { id: 20, name: "Ruby Tennis Bracelet",    sku: "RTB-112", price: 392000, oldPrice: 425000, status: "active",   date: "2026-03-17", icon: "bi-gem"          },
    { id: 21, name: "Gold-leaf Notebook",      sku: "GLN-019", price: 6800,   oldPrice: 0,      status: "inactive", date: "2026-03-15", icon: "bi-journal"      },
    { id: 22, name: "Carved Jade Pendant",     sku: "CJP-066", price: 87600,  oldPrice: 0,      status: "active",   date: "2026-03-12", icon: "bi-tropical-storm" },
    { id: 23, name: "Brass Telescope",         sku: "BTC-024", price: 132500, oldPrice: 145000, status: "active",   date: "2026-03-10", icon: "bi-binoculars"   },
    { id: 24, name: "Silk Pocket Square",      sku: "SPS-088", price: 9200,   oldPrice: 0,      status: "active",   date: "2026-03-07", icon: "bi-flag"         },
    { id: 25, name: "Onyx Statement Ring",     sku: "OSR-051", price: 76400,  oldPrice: 84000,  status: "inactive", date: "2026-03-05", icon: "bi-record-circle" },
    { id: 26, name: "Linen Travel Set",        sku: "LTS-009", price: 18700,  oldPrice: 0,      status: "active",   date: "2026-03-02", icon: "bi-luggage"      }
  ];

  /* --------------------------------------------------------
     STATE
  -------------------------------------------------------- */
  var state = {
    page: 1,
    perPage: 10,
    filters: { name: "", status: "", date: "" }
  };

  /* --------------------------------------------------------
     CACHED ELEMENTS
  -------------------------------------------------------- */
  var $body = $('#productsBody');
  var $pagination = $('#pagination');
  var $rangeInfo = $('#rangeInfo');
  var $summary = $('#resultsSummary');
  var $perPage = $('#perPage');
  var $chips = $('#activeFilters');

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
    // Search button
    $('#btnSearch').on('click', applyFilters);
    $('#productFilters').on('submit', function (e) { e.preventDefault(); applyFilters(); });

    // Quick search on Enter inside the name input
    $('#fName').on('keyup', function (e) {
      if (e.key === 'Enter') applyFilters();
    });

    // Reset
    $('#btnReset').on('click', function () {
      $('#fName').val('');
      $('#fStatus').val('');
      $('#fDate').val('');
      state.filters = { name: "", status: "", date: "" };
      state.page = 1;
      render();
    });

    // Per-page change
    $perPage.on('change', function () {
      state.perPage = parseInt($(this).val(), 10) || 10;
      state.page = 1;
      render();
    });

    // Pagination clicks
    $pagination.on('click', 'button[data-page]', function () {
      var p = parseInt($(this).data('page'), 10);
      if (!isNaN(p)) { state.page = p; render(true); }
    });

    // Status toggle (per-row)
    $body.on('change', '.js-status-toggle', function () {
      var id = parseInt($(this).data('id'), 10);
      var item = products.find(function (p) { return p.id === id; });
      if (!item) return;
      item.status = this.checked ? 'active' : 'inactive';

      var $cell = $(this).closest('.switch-cell');
      $cell.toggleClass('is-on', this.checked);
      $cell.find('.switch-label').text(this.checked ? 'Active' : 'Inactive');
    });

    // Row actions
    $body.on('click', '.action-btn.view', function () {
      var id = $(this).data('id');
      window.location.href = 'product-view.html?id=' + id;
    });

    $body.on('click', '.action-btn.edit', function () {
      var id = $(this).data('id');
      window.location.href = 'product-add.html?id=' + id;
    });

    $body.on('click', '.action-btn.delete', function () {
      var id = $(this).data('id');
      var p = products.find(function (x) { return x.id === id; });
      if (!p) return;
      if (confirm('Delete "' + p.name + '"?')) {
        products = products.filter(function (x) { return x.id !== id; });
        render();
      }
    });

    // Active-filter chip removal
    $chips.on('click', '.filter-chip button', function () {
      var key = $(this).data('key');
      if (key === 'name')   { $('#fName').val('');   state.filters.name = ''; }
      if (key === 'status') { $('#fStatus').val(''); state.filters.status = ''; }
      if (key === 'date')   { $('#fDate').val('');   state.filters.date = ''; }
      state.page = 1;
      render();
    });
  }

  function applyFilters() {
    state.filters.name   = $.trim($('#fName').val()).toLowerCase();
    state.filters.status = $('#fStatus').val();
    state.filters.date   = $('#fDate').val();
    state.page = 1;
    render();
  }

  /* --------------------------------------------------------
     FILTER LOGIC
  -------------------------------------------------------- */
  function filtered() {
    var f = state.filters;
    return products.filter(function (p) {
      if (f.name && (p.name.toLowerCase().indexOf(f.name) === -1) &&
                    (p.sku.toLowerCase().indexOf(f.name) === -1)) return false;
      if (f.status && p.status !== f.status) return false;
      if (f.date && p.date !== f.date) return false;
      return true;
    });
  }

  /* --------------------------------------------------------
     RENDER
  -------------------------------------------------------- */
  function render(skipChips) {
    var data = filtered();
    var total = data.length;
    var per = state.perPage;
    var pages = Math.max(1, Math.ceil(total / per));
    if (state.page > pages) state.page = pages;
    if (state.page < 1) state.page = 1;

    var start = (state.page - 1) * per;
    var end = Math.min(start + per, total);
    var slice = data.slice(start, end);

    renderRows(slice);
    renderPagination(pages);
    renderInfo(total, start, end);
    if (!skipChips) renderChips();
  }

  function renderRows(rows) {
    if (!rows.length) {
      $body.html(
        '<tr class="empty-row"><td colspan="5">' +
          '<i class="bi bi-inbox"></i>' +
          '<div>No products match your filters.</div>' +
        '</td></tr>'
      );
      return;
    }

    var html = '';
    rows.forEach(function (p) {
      var isActive = p.status === 'active';
      html += '<tr data-id="' + p.id + '">';

      // Image
      html += '<td><div class="lx-thumb"><i class="bi ' + p.icon + '"></i></div></td>';

      // Name + SKU
      html += '<td><div class="lx-name">' +
                  '<a href="product-view.html?id=' + p.id + '" style="color:inherit;">' +
                    '<strong>' + escapeHtml(p.name) + '</strong>' +
                  '</a>' +
                  '<small>SKU: ' + p.sku + ' &middot; ' + formatDate(p.date) + '</small>' +
              '</div></td>';

      // Price
      var priceHtml = '<div class="product-price">&#8377; ' + format(p.price);
      if (p.oldPrice && p.oldPrice > p.price) {
        priceHtml += '<small>&#8377; ' + format(p.oldPrice) + '</small>';
      }
      priceHtml += '</div>';
      html += '<td>' + priceHtml + '</td>';

      // Status (toggle + label + pill)
      html += '<td>' +
                '<label class="switch-cell ' + (isActive ? 'is-on' : '') + '">' +
                  '<span class="switch">' +
                    '<input type="checkbox" class="js-status-toggle" data-id="' + p.id + '" ' +
                            (isActive ? 'checked' : '') + ' />' +
                    '<span class="switch-slider"></span>' +
                  '</span>' +
                  '<span class="switch-label">' + (isActive ? 'Active' : 'Inactive') + '</span>' +
                '</label>' +
              '</td>';

      // Actions
      html += '<td class="col-actions">' +
                '<div class="action-btns">' +
                  '<button class="action-btn view"   data-id="' + p.id + '" title="View"><i class="bi bi-eye"></i></button>' +
                  '<button class="action-btn edit"   data-id="' + p.id + '" title="Edit"><i class="bi bi-pencil"></i></button>' +
                  '<button class="action-btn delete" data-id="' + p.id + '" title="Delete"><i class="bi bi-trash"></i></button>' +
                '</div>' +
              '</td>';

      html += '</tr>';
    });
    $body.html(html);
  }

  function renderPagination(pages) {
    var current = state.page;

    function btn(label, page, opts) {
      opts = opts || {};
      var cls = '';
      if (opts.active) cls += ' active';
      var attrs = 'data-page="' + page + '"';
      if (opts.disabled) attrs += ' disabled';
      return '<li><button ' + attrs + ' class="' + cls + '">' + label + '</button></li>';
    }

    var html = '';
    html += btn('<i class="bi bi-chevron-double-left"></i>',  1,            { disabled: current === 1 });
    html += btn('<i class="bi bi-chevron-left"></i>',         current - 1,  { disabled: current === 1 });

    // Compact page numbers (window of 5 around current)
    var pageNums = buildPageList(current, pages);
    pageNums.forEach(function (item) {
      if (item === '…') {
        html += '<li><span class="ellipsis">…</span></li>';
      } else {
        html += btn(item, item, { active: item === current });
      }
    });

    html += btn('<i class="bi bi-chevron-right"></i>',        current + 1,  { disabled: current === pages });
    html += btn('<i class="bi bi-chevron-double-right"></i>', pages,        { disabled: current === pages });

    $pagination.html(html);
  }

  function buildPageList(current, total) {
    var pages = [];
    if (total <= 7) {
      for (var i = 1; i <= total; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (current > 4) pages.push('…');
    var start = Math.max(2, current - 1);
    var end   = Math.min(total - 1, current + 1);
    for (var j = start; j <= end; j++) pages.push(j);
    if (current < total - 3) pages.push('…');
    pages.push(total);
    return pages;
  }

  function renderInfo(total, start, end) {
    if (total === 0) {
      $rangeInfo.text('0 - 0 of 0');
      $summary.text('Showing 0 of ' + products.length + ' products');
    } else {
      $rangeInfo.text((start + 1) + ' - ' + end + ' of ' + total);
      $summary.text('Showing ' + total + ' of ' + products.length + ' products');
    }
  }

  function renderChips() {
    var f = state.filters;
    var chips = [];

    if (f.name)   chips.push({ key: 'name',   label: 'Name: "' + f.name + '"' });
    if (f.status) chips.push({ key: 'status', label: 'Status: ' + (f.status[0].toUpperCase() + f.status.slice(1)) });
    if (f.date)   chips.push({ key: 'date',   label: 'Date: ' + formatDate(f.date) });

    if (!chips.length) {
      $chips.hide().empty();
      return;
    }

    var html = '';
    chips.forEach(function (c) {
      html += '<span class="filter-chip">' + escapeHtml(c.label) +
                '<button type="button" data-key="' + c.key + '" aria-label="Remove">&times;</button>' +
              '</span>';
    });
    $chips.html(html).show();
  }

  /* --------------------------------------------------------
     UTILS
  -------------------------------------------------------- */
  function format(n) {
    return Number(n).toLocaleString('en-IN');
  }
  function formatDate(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})(jQuery);
