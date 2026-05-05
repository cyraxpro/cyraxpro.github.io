/* =====================================================
   SHOPMART — SHOP / CATALOGUE SCRIPT
   Filtering (category, brand, price, rating),
   sorting (latest, price asc/desc, popular),
   load more, mobile filter drawer, view switch.
   ===================================================== */

(function () {
  "use strict";

  /* ===================================================
     1. PRODUCT CATALOGUE (mock data)
     =================================================== */
  var PRODUCTS = [
    { id:  1, name: "Heritage Chrono Gold Watch",       cat: "watches",     brand: "Heritage", price: 1249, oldPrice: 1499, rating: 5.0, reviews: 124, tag: "hot",  date: "2026-04-22", popular: 98, img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80",  desc: "Heirloom-quality automatic chronograph crafted by master horologists." },
    { id:  2, name: "Premium Denim Jacket",             cat: "fashion",     brand: "Velluto",  price: 89,   oldPrice: 119,  rating: 4.5, reviews: 124, tag: "sale", date: "2026-04-18", popular: 86, img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",  desc: "Tailored heavyweight denim jacket with copper hardware." },
    { id:  3, name: "Modern Velvet Sofa",               cat: "furniture",   brand: "Maison",   price: 899,  oldPrice: 1199, rating: 4.0, reviews: 45,  tag: "sale", date: "2026-04-15", popular: 60, img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",  desc: "Three-seater modern velvet sofa on solid wood frame." },
    { id:  4, name: "Casual White Sneakers",            cat: "footwear",    brand: "Nordica",  price: 79,   oldPrice: null, rating: 4.5, reviews: 231, tag: "",     date: "2026-04-10", popular: 92, img: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&q=80",  desc: "Minimalist Italian leather sneakers with cushioned sole." },
    { id:  5, name: "Designer Sunglasses",              cat: "eyewear",     brand: "Solis",    price: 129,  oldPrice: 185,  rating: 4.0, reviews: 67,  tag: "sale", date: "2026-04-08", popular: 70, img: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&q=80",  desc: "Polarised acetate sunglasses with hand-finished hinges." },
    { id:  6, name: "Scandinavian Lounge Chair",        cat: "furniture",   brand: "Nordica",  price: 329,  oldPrice: null, rating: 5.0, reviews: 98,  tag: "",     date: "2026-04-05", popular: 88, img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80",  desc: "Solid oak lounge chair with full-grain leather seat." },
    { id:  7, name: "Atelier Leather Bag",              cat: "bags",        brand: "Atelier",  price: 489,  oldPrice: null, rating: 4.5, reviews: 112, tag: "new",  date: "2026-04-01", popular: 96, img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",  desc: "Hand-stitched full-grain leather tote with brass detail." },
    { id:  8, name: "Premium Leather Wallet",           cat: "bags",        brand: "Atelier",  price: 59,   oldPrice: 70,   rating: 4.0, reviews: 76,  tag: "sale", date: "2026-03-28", popular: 64, img: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80",  desc: "Bifold wallet in vegetable-tanned cowhide leather." },
    { id:  9, name: "Aurora Brass Table Lamp",          cat: "furniture",   brand: "Aurora",   price: 329,  oldPrice: null, rating: 4.5, reviews: 86,  tag: "new",  date: "2026-03-26", popular: 78, img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=80",  desc: "Sculptural brass table lamp with linen shade." },
    { id: 10, name: "Aviator Glasses",                  cat: "eyewear",     brand: "Solis",    price: 89,   oldPrice: null, rating: 4.0, reviews: 142, tag: "",     date: "2026-03-22", popular: 80, img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",  desc: "Classic aviator metal frames with gradient lenses." },
    { id: 11, name: "Running Shoes Pro",                cat: "footwear",    brand: "Ember",    price: 149,  oldPrice: null, rating: 4.5, reviews: 188, tag: "",     date: "2026-03-19", popular: 90, img: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80",  desc: "High-rebound foam running shoes with breathable knit upper." },
    { id: 12, name: "Smart Watch Sport",                cat: "watches",     brand: "Ember",    price: 229,  oldPrice: 279,  rating: 4.5, reviews: 134, tag: "sale", date: "2026-03-15", popular: 84, img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80",  desc: "Lightweight smart watch with GPS and 7-day battery." },
    { id: 13, name: "Modern Bed Frame Oak",             cat: "furniture",   brand: "Nordica",  price: 649,  oldPrice: null, rating: 4.5, reviews: 64,  tag: "",     date: "2026-03-12", popular: 58, img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",  desc: "Solid oak king-size bed frame with fluted headboard." },
    { id: 14, name: "Vintage Wool Hat",                 cat: "fashion",     brand: "Velluto",  price: 45,   oldPrice: null, rating: 4.0, reviews: 52,  tag: "",     date: "2026-03-10", popular: 48, img: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80",  desc: "Soft wool felt fedora with grosgrain band." },
    { id: 15, name: "Urban Knit Sneakers",              cat: "footwear",    brand: "Ember",    price: 99,   oldPrice: 129,  rating: 4.0, reviews: 110, tag: "sale", date: "2026-03-08", popular: 72, img: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80",  desc: "Lightweight knit sneakers with rubber sole." },
    { id: 16, name: "Wireless Headphones",              cat: "accessories", brand: "Ember",    price: 199,  oldPrice: null, rating: 4.5, reviews: 230, tag: "new",  date: "2026-03-04", popular: 95, img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80",  desc: "Over-ear wireless headphones with active noise cancellation." },
    { id: 17, name: "Silver Chain Bracelet",            cat: "accessories", brand: "Heritage", price: 219,  oldPrice: null, rating: 4.5, reviews: 49,  tag: "",     date: "2026-03-01", popular: 55, img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80",  desc: "Sterling silver chain bracelet with toggle clasp." },
    { id: 18, name: "Atelier Crossbody Bag",            cat: "bags",        brand: "Atelier",  price: 299,  oldPrice: 379,  rating: 4.5, reviews: 88,  tag: "sale", date: "2026-02-26", popular: 76, img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",  desc: "Compact crossbody in pebbled leather with adjustable strap." },
    { id: 19, name: "Linen Summer Shirt",               cat: "fashion",     brand: "Velluto",  price: 79,   oldPrice: null, rating: 4.0, reviews: 76,  tag: "new",  date: "2026-02-23", popular: 62, img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",  desc: "Lightweight pure linen shirt with mother-of-pearl buttons." },
    { id: 20, name: "Leather Ankle Boots",              cat: "footwear",    brand: "Maison",   price: 259,  oldPrice: null, rating: 4.5, reviews: 92,  tag: "",     date: "2026-02-20", popular: 78, img: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80",  desc: "Goodyear-welted leather Chelsea boots, hand-finished." },
    { id: 21, name: "Round Acetate Glasses",            cat: "eyewear",     brand: "Solis",    price: 119,  oldPrice: null, rating: 4.0, reviews: 41,  tag: "",     date: "2026-02-17", popular: 50, img: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&q=80",  desc: "Round vintage-inspired Italian acetate optical frames." },
    { id: 22, name: "Marble Coffee Table",              cat: "furniture",   brand: "Maison",   price: 749,  oldPrice: 899,  rating: 4.5, reviews: 38,  tag: "sale", date: "2026-02-14", popular: 56, img: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&q=80",  desc: "White marble round coffee table on brass pedestal base." },
    { id: 23, name: "Heritage Pocket Watch",            cat: "watches",     brand: "Heritage", price: 549,  oldPrice: null, rating: 5.0, reviews: 36,  tag: "new",  date: "2026-02-10", popular: 64, img: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600&q=80",  desc: "Mechanical pocket watch with engraved cover." },
    { id: 24, name: "Cashmere Throw Blanket",           cat: "furniture",   brand: "Aurora",   price: 189,  oldPrice: null, rating: 4.5, reviews: 64,  tag: "",     date: "2026-02-08", popular: 60, img: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=600&q=80",  desc: "100% pure cashmere throw woven in Scotland." },
    { id: 25, name: "Slim Quartz Watch",                cat: "watches",     brand: "Solis",    price: 179,  oldPrice: 219,  rating: 4.0, reviews: 78,  tag: "sale", date: "2026-02-05", popular: 70, img: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80",  desc: "Ultra-slim quartz watch with sapphire crystal." },
    { id: 26, name: "Wool Tailored Coat",               cat: "fashion",     brand: "Maison",   price: 459,  oldPrice: null, rating: 4.5, reviews: 56,  tag: "new",  date: "2026-02-02", popular: 68, img: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80",  desc: "Tailored single-breasted wool coat in classic camel." },
    { id: 27, name: "Aurora Pendant Light",             cat: "furniture",   brand: "Aurora",   price: 289,  oldPrice: null, rating: 4.0, reviews: 42,  tag: "",     date: "2026-01-30", popular: 54, img: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&q=80",  desc: "Hand-blown smoked glass pendant lamp with brass cap." },
    { id: 28, name: "Leather Card Holder",              cat: "bags",        brand: "Atelier",  price: 39,   oldPrice: null, rating: 4.5, reviews: 154, tag: "",     date: "2026-01-26", popular: 82, img: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&q=80",  desc: "Slim card holder in saffiano leather, six-card capacity." },
    { id: 29, name: "Knit Cashmere Sweater",            cat: "fashion",     brand: "Velluto",  price: 219,  oldPrice: 279,  rating: 4.5, reviews: 88,  tag: "sale", date: "2026-01-22", popular: 74, img: "https://images.unsplash.com/photo-1580331451062-99ff207b1f88?w=600&q=80",  desc: "Pure Mongolian cashmere crew-neck sweater." },
    { id: 30, name: "Aviator Pilot Watch",              cat: "watches",     brand: "Heritage", price: 689,  oldPrice: null, rating: 4.5, reviews: 64,  tag: "new",  date: "2026-01-18", popular: 72, img: "https://images.unsplash.com/photo-1548171245-3f0b3a47e6f2?w=600&q=80",  desc: "Vintage-inspired pilot watch with sapphire crystal." },
    { id: 31, name: "Designer Belt",                    cat: "accessories", brand: "Atelier",  price: 119,  oldPrice: null, rating: 4.0, reviews: 36,  tag: "",     date: "2026-01-15", popular: 50, img: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&q=80",  desc: "Italian leather belt with brushed nickel buckle." },
    { id: 32, name: "Silk Square Scarf",                cat: "accessories", brand: "Velluto",  price: 95,   oldPrice: null, rating: 4.5, reviews: 64,  tag: "",     date: "2026-01-12", popular: 58, img: "https://images.unsplash.com/photo-1601762603339-fd61e28b698a?w=600&q=80",  desc: "Hand-rolled pure silk square scarf with floral print." }
  ];

  /* ===================================================
     2. STATE
     =================================================== */
  var STATE = {
    cats: [],
    brands: [],
    minPrice: 0,
    maxPrice: 2000,
    rating: 0,
    sort: "latest",
    page: 1,
    perPage: 9,
    view: "grid"
  };

  var BOUNDS = (function () {
    var min = Infinity, max = -Infinity;
    PRODUCTS.forEach(function (p) {
      if (p.price < min) min = p.price;
      if (p.price > max) max = p.price;
    });
    return { min: Math.floor(min), max: Math.ceil(max) };
  })();

  /* ===================================================
     3. DOM REFERENCES
     =================================================== */
  var $grid          = document.getElementById("productGrid");
  var $empty         = document.getElementById("shopEmpty");
  var $emptyReset    = document.getElementById("emptyResetBtn");
  var $shownCount    = document.getElementById("shownCount");
  var $totalCount    = document.getElementById("totalCount");
  var $loadShown     = document.getElementById("loadShown");
  var $loadTotal     = document.getElementById("loadTotal");
  var $loadFill      = document.getElementById("loadMoreFill");
  var $loadMoreBtn   = document.getElementById("loadMoreBtn");
  var $loadMoreWrap  = document.getElementById("loadMoreWrap");
  var $sortSelect    = document.getElementById("sortSelect");
  var $sidebar       = document.getElementById("shopSidebar");
  var $sidebarOver   = document.getElementById("sidebarOverlay");
  var $sidebarClose  = document.getElementById("sidebarCloseBtn");
  var $filterToggle  = document.getElementById("filterToggleBtn");
  var $applyMobile   = document.getElementById("applyMobileBtn");
  var $resetMobile   = document.getElementById("resetMobileBtn");
  var $activeBar     = document.getElementById("activeFilterBar");
  var $activeChips   = document.getElementById("activeChips");
  var $clearAll      = document.getElementById("clearAllBtn");
  var $contentPills  = document.getElementById("contentActivePills");
  var $brandSearch   = document.getElementById("brandSearch");
  var $brandList     = document.getElementById("brandList");

  // Price slider refs
  var $priceMinRange = document.getElementById("priceMinRange");
  var $priceMaxRange = document.getElementById("priceMaxRange");
  var $priceMinInput = document.getElementById("priceMinInput");
  var $priceMaxInput = document.getElementById("priceMaxInput");
  var $sliderFill    = document.getElementById("sliderFill");
  var $priceApply    = document.getElementById("priceApplyBtn");

  /* ===================================================
     4. INITIALISE PRICE SLIDER BOUNDS
     =================================================== */
  function initPriceBounds() {
    var min = BOUNDS.min, max = BOUNDS.max;
    [$priceMinRange, $priceMaxRange, $priceMinInput, $priceMaxInput].forEach(function (el) {
      el.min = min;
      el.max = max;
    });
    $priceMinRange.value = min;
    $priceMaxRange.value = max;
    $priceMinInput.value = min;
    $priceMaxInput.value = max;
    STATE.minPrice = min;
    STATE.maxPrice = max;
    updateSliderFill();
  }

  function updateSliderFill() {
    var min = parseFloat($priceMinRange.value);
    var max = parseFloat($priceMaxRange.value);
    var lo  = parseFloat($priceMinRange.min);
    var hi  = parseFloat($priceMinRange.max);
    var leftPct  = ((min - lo) / (hi - lo)) * 100;
    var rightPct = 100 - ((max - lo) / (hi - lo)) * 100;
    $sliderFill.style.left  = leftPct  + "%";
    $sliderFill.style.right = rightPct + "%";
  }

  /* ===================================================
     5. READ FILTER STATE FROM DOM
     =================================================== */
  function syncStateFromDOM() {
    STATE.cats = Array.prototype.slice
      .call(document.querySelectorAll('input[name="category"]:checked'))
      .map(function (i) { return i.value; });

    STATE.brands = Array.prototype.slice
      .call(document.querySelectorAll('input[name="brand"]:checked'))
      .map(function (i) { return i.value; });

    var ratingEl = document.querySelector('input[name="rating"]:checked');
    STATE.rating = ratingEl ? parseInt(ratingEl.value, 10) : 0;

    var minVal = parseInt($priceMinInput.value, 10);
    var maxVal = parseInt($priceMaxInput.value, 10);
    if (isNaN(minVal)) minVal = BOUNDS.min;
    if (isNaN(maxVal)) maxVal = BOUNDS.max;
    if (minVal > maxVal) { var t = minVal; minVal = maxVal; maxVal = t; }
    STATE.minPrice = minVal;
    STATE.maxPrice = maxVal;
  }

  /* ===================================================
     6. FILTER + SORT
     =================================================== */
  function applyFilters() {
    var list = PRODUCTS.filter(function (p) {
      if (STATE.cats.length    && STATE.cats.indexOf(p.cat) === -1)     return false;
      if (STATE.brands.length  && STATE.brands.indexOf(p.brand) === -1) return false;
      if (p.price < STATE.minPrice || p.price > STATE.maxPrice)         return false;
      if (STATE.rating          && p.rating < STATE.rating)             return false;
      return true;
    });

    switch (STATE.sort) {
      case "price-asc":  list.sort(function (a, b) { return a.price - b.price; }); break;
      case "price-desc": list.sort(function (a, b) { return b.price - a.price; }); break;
      case "popular":    list.sort(function (a, b) { return b.popular - a.popular; }); break;
      default: // latest
        list.sort(function (a, b) {
          return (new Date(b.date)).getTime() - (new Date(a.date)).getTime();
        });
    }

    return list;
  }

  /* ===================================================
     7. RENDER PRODUCT CARD
     =================================================== */
  function tagHtml(tag, oldPrice, price) {
    if (tag === "sale" && oldPrice) {
      var pct = Math.round(((oldPrice - price) / oldPrice) * 100);
      return '<span class="product-tag tag-sale">-' + pct + '%</span>';
    }
    if (tag === "new") return '<span class="product-tag tag-new">New</span>';
    if (tag === "hot") return '<span class="product-tag tag-hot">Hot</span>';
    return "";
  }

  function ratingHtml(r) {
    var html = "", i, full = Math.floor(r), half = (r - full) >= 0.5;
    for (i = 0; i < full; i++) html += '<i class="fa-solid fa-star"></i>';
    if (half) { html += '<i class="fa-solid fa-star-half-stroke"></i>'; i++; }
    for (; i < 5; i++) html += '<i class="fa-regular fa-star"></i>';
    return html;
  }

  function priceHtml(p) {
    var html = '<span class="price-now">$' + p.price.toLocaleString() + '.00</span>';
    if (p.oldPrice) html += '<span class="price-old">$' + p.oldPrice.toLocaleString() + '.00</span>';
    return html;
  }

  function catLabel(cat) {
    if (cat === "bags") return "Bags & Wallets";
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  }

  function cardHtml(p) {
    return '' +
      '<article class="product-card" data-id="' + p.id + '">' +
        '<div class="product-thumb">' +
          '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy" />' +
          tagHtml(p.tag, p.oldPrice, p.price) +
          '<button class="wishlist-btn" aria-label="Add to wishlist"><i class="fa-regular fa-heart"></i></button>' +
          '<button class="add-cart-btn"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>' +
        '</div>' +
        '<div class="product-info">' +
          '<span class="product-cat">' + catLabel(p.cat) + '</span>' +
          '<h3 class="product-name"><a href="product-details.html">' + p.name + '</a></h3>' +
          '<p class="product-desc">' + p.desc + '</p>' +
          '<div class="product-rating">' + ratingHtml(p.rating) + '<span>(' + p.reviews + ')</span></div>' +
          '<div class="product-price">' + priceHtml(p) + '</div>' +
          '<span class="product-brand">' + p.brand + '</span>' +
        '</div>' +
      '</article>';
  }

  /* ===================================================
     8. RENDER GRID
     =================================================== */
  function renderGrid(reset) {
    var list = applyFilters();
    var totalFiltered = list.length;
    var pageSize = STATE.page * STATE.perPage;
    var slice = list.slice(0, pageSize);

    if (reset || !$grid.children.length) {
      $grid.innerHTML = slice.map(cardHtml).join("");
    } else {
      // Append only the newly added items
      var existing = $grid.children.length;
      var frag = document.createDocumentFragment();
      for (var i = existing; i < slice.length; i++) {
        var div = document.createElement("div");
        div.innerHTML = cardHtml(slice[i]);
        frag.appendChild(div.firstChild);
      }
      $grid.appendChild(frag);
    }

    // Empty state
    if (totalFiltered === 0) {
      $empty.hidden = false;
      $grid.style.display = "none";
      $loadMoreWrap.style.display = "none";
    } else {
      $empty.hidden = true;
      $grid.style.display = "";
      $loadMoreWrap.style.display = "";
    }

    // Counts
    var shown = slice.length;
    $shownCount.textContent = shown;
    $totalCount.textContent = totalFiltered;
    $loadShown.textContent  = shown;
    $loadTotal.textContent  = totalFiltered;

    var pct = totalFiltered ? Math.min(100, (shown / totalFiltered) * 100) : 0;
    $loadFill.style.width = pct + "%";

    // Load more state
    if (shown >= totalFiltered) {
      $loadMoreBtn.classList.add("done");
      $loadMoreBtn.disabled = true;
      $loadMoreBtn.querySelector(".lm-text").textContent = totalFiltered ? "All products loaded" : "No products";
    } else {
      $loadMoreBtn.classList.remove("done");
      $loadMoreBtn.disabled = false;
      $loadMoreBtn.querySelector(".lm-text").textContent = "Load More";
    }

    updateCounts();
    updateActiveChips();
  }

  /* ===================================================
     9. UPDATE PER-FILTER COUNTS (badges)
     =================================================== */
  function updateCounts() {
    var pool = PRODUCTS.filter(function (p) {
      if (p.price < STATE.minPrice || p.price > STATE.maxPrice) return false;
      if (STATE.rating && p.rating < STATE.rating) return false;
      return true;
    });

    document.querySelectorAll("[data-count-cat]").forEach(function (el) {
      var c = el.getAttribute("data-count-cat");
      var n = pool.filter(function (p) {
        if (STATE.brands.length && STATE.brands.indexOf(p.brand) === -1) return false;
        return p.cat === c;
      }).length;
      el.textContent = n;
    });

    document.querySelectorAll("[data-count-brand]").forEach(function (el) {
      var b = el.getAttribute("data-count-brand");
      var n = pool.filter(function (p) {
        if (STATE.cats.length && STATE.cats.indexOf(p.cat) === -1) return false;
        return p.brand === b;
      }).length;
      el.textContent = n;
    });
  }

  /* ===================================================
     10. ACTIVE FILTER CHIPS
     =================================================== */
  function chip(label, type, value) {
    return '<span class="chip" data-type="' + type + '" data-value="' + value + '">' +
             label +
             '<button type="button" aria-label="Remove ' + label + '"><i class="fa-solid fa-xmark"></i></button>' +
           '</span>';
  }

  function buildChips() {
    var chips = [];
    STATE.cats.forEach(function (c)   { chips.push(chip(catLabel(c), "cat", c)); });
    STATE.brands.forEach(function (b) { chips.push(chip(b, "brand", b)); });
    if (STATE.minPrice > BOUNDS.min || STATE.maxPrice < BOUNDS.max) {
      chips.push(chip("$" + STATE.minPrice + " — $" + STATE.maxPrice, "price", "price"));
    }
    if (STATE.rating) {
      chips.push(chip(STATE.rating + "+ stars", "rating", STATE.rating));
    }
    return chips;
  }

  function updateActiveChips() {
    var chips = buildChips();
    if (chips.length === 0) {
      $activeBar.hidden = true;
      $contentPills.hidden = true;
      $contentPills.innerHTML = "";
      return;
    }
    $activeBar.hidden = false;
    $activeChips.innerHTML = chips.join("");

    // Mirror in content area on mobile
    $contentPills.hidden = false;
    $contentPills.innerHTML = '<span class="pills-label">Filters:</span>' + chips.join("") +
      '<button type="button" class="clear-all-btn" id="contentClearAll" style="margin-left:auto;">Clear All</button>';
    var contentClear = document.getElementById("contentClearAll");
    if (contentClear) contentClear.addEventListener("click", clearAll);
  }

  /* ===================================================
     11. EVENT WIRING
     =================================================== */

  // Sidebar — checkbox / radio change
  document.querySelectorAll('input[name="category"], input[name="brand"], input[name="rating"]')
    .forEach(function (input) {
      input.addEventListener("change", function () {
        STATE.page = 1;
        syncStateFromDOM();
        renderGrid(true);
      });
    });

  // Sort
  $sortSelect.addEventListener("change", function () {
    STATE.sort = this.value;
    STATE.page = 1;
    renderGrid(true);
  });

  // View switch
  document.querySelectorAll(".view-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".view-btn").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      STATE.view = btn.getAttribute("data-view");
      $grid.classList.toggle("list-view", STATE.view === "list");
    });
  });

  // Load more
  $loadMoreBtn.addEventListener("click", function () {
    if (this.disabled) return;
    var btn = this;
    btn.classList.add("loading");
    btn.querySelector(".lm-text").textContent = "Load";
    setTimeout(function () {
      STATE.page++;
      renderGrid(false);
      btn.classList.remove("loading");
    }, 450);
  });

  // Filter accordion
  document.querySelectorAll(".filter-head").forEach(function (head) {
    head.addEventListener("click", function () {
      head.parentElement.classList.toggle("open");
    });
  });

  // Price — sliders
  function onSliderInput() {
    var min = parseInt($priceMinRange.value, 10);
    var max = parseInt($priceMaxRange.value, 10);
    var gap = 10;
    if (max - min < gap) {
      if (this === $priceMinRange) $priceMinRange.value = max - gap;
      else $priceMaxRange.value = min + gap;
      min = parseInt($priceMinRange.value, 10);
      max = parseInt($priceMaxRange.value, 10);
    }
    $priceMinInput.value = min;
    $priceMaxInput.value = max;
    updateSliderFill();
  }
  $priceMinRange.addEventListener("input", onSliderInput);
  $priceMaxRange.addEventListener("input", onSliderInput);

  function commitPrice() {
    syncStateFromDOM();
    $priceMinRange.value = STATE.minPrice;
    $priceMaxRange.value = STATE.maxPrice;
    updateSliderFill();
    STATE.page = 1;
    renderGrid(true);
  }
  $priceMinRange.addEventListener("change", commitPrice);
  $priceMaxRange.addEventListener("change", commitPrice);

  // Price — number inputs
  function onPriceInputBlur() {
    var min = parseInt($priceMinInput.value, 10);
    var max = parseInt($priceMaxInput.value, 10);
    if (isNaN(min)) min = BOUNDS.min;
    if (isNaN(max)) max = BOUNDS.max;
    min = Math.max(BOUNDS.min, Math.min(min, BOUNDS.max));
    max = Math.max(BOUNDS.min, Math.min(max, BOUNDS.max));
    if (min > max) { var t = min; min = max; max = t; }
    $priceMinInput.value = min;
    $priceMaxInput.value = max;
    $priceMinRange.value = min;
    $priceMaxRange.value = max;
    updateSliderFill();
  }
  $priceMinInput.addEventListener("blur",  onPriceInputBlur);
  $priceMaxInput.addEventListener("blur",  onPriceInputBlur);
  $priceMinInput.addEventListener("change", onPriceInputBlur);
  $priceMaxInput.addEventListener("change", onPriceInputBlur);

  $priceApply.addEventListener("click", function () {
    onPriceInputBlur();
    commitPrice();
  });

  // Brand search
  $brandSearch.addEventListener("input", function () {
    var q = this.value.trim().toLowerCase();
    $brandList.querySelectorAll("li").forEach(function (li) {
      var label = li.querySelector(".check-label").textContent.toLowerCase();
      li.style.display = label.indexOf(q) === -1 ? "none" : "";
    });
  });

  // Active chip removal (delegated)
  $activeChips.addEventListener("click", function (e) {
    var btn = e.target.closest("button");
    if (!btn) return;
    var c = btn.parentElement;
    removeChip(c.getAttribute("data-type"), c.getAttribute("data-value"));
  });
  $contentPills.addEventListener("click", function (e) {
    var btn = e.target.closest("button.chip > button, .chip button");
    if (!btn) return;
    var c = btn.closest(".chip");
    if (!c) return;
    removeChip(c.getAttribute("data-type"), c.getAttribute("data-value"));
  });

  function removeChip(type, value) {
    if (type === "cat") {
      var el = document.querySelector('input[name="category"][value="' + value + '"]');
      if (el) el.checked = false;
    } else if (type === "brand") {
      var el2 = document.querySelector('input[name="brand"][value="' + value + '"]');
      if (el2) el2.checked = false;
    } else if (type === "price") {
      $priceMinInput.value = BOUNDS.min;
      $priceMaxInput.value = BOUNDS.max;
      $priceMinRange.value = BOUNDS.min;
      $priceMaxRange.value = BOUNDS.max;
      updateSliderFill();
    } else if (type === "rating") {
      var el3 = document.querySelector('input[name="rating"]:checked');
      if (el3) el3.checked = false;
    }
    STATE.page = 1;
    syncStateFromDOM();
    renderGrid(true);
  }

  function clearAll() {
    document.querySelectorAll('input[name="category"], input[name="brand"]').forEach(function (i) { i.checked = false; });
    var r = document.querySelector('input[name="rating"]:checked');
    if (r) r.checked = false;
    $priceMinInput.value = BOUNDS.min;
    $priceMaxInput.value = BOUNDS.max;
    $priceMinRange.value = BOUNDS.min;
    $priceMaxRange.value = BOUNDS.max;
    updateSliderFill();
    STATE.page = 1;
    syncStateFromDOM();
    renderGrid(true);
  }
  $clearAll.addEventListener("click", clearAll);
  $emptyReset.addEventListener("click", clearAll);

  // Mobile sidebar
  function openSidebar() {
    $sidebar.classList.add("open");
    $sidebarOver.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  function closeSidebar() {
    $sidebar.classList.remove("open");
    $sidebarOver.classList.remove("active");
    document.body.style.overflow = "";
  }
  $filterToggle.addEventListener("click", openSidebar);
  $sidebarClose.addEventListener("click", closeSidebar);
  $sidebarOver.addEventListener("click", closeSidebar);
  $applyMobile.addEventListener("click", closeSidebar);
  $resetMobile.addEventListener("click", function () {
    clearAll();
  });

  /* ===================================================
     12. URL PARAM (?cat=watches) PRESET
     =================================================== */
  function applyUrlPreset() {
    var params = new URLSearchParams(window.location.search);
    var cat = params.get("cat");
    if (!cat) return;
    var el = document.querySelector('input[name="category"][value="' + cat + '"]');
    if (el) {
      el.checked = true;
      syncStateFromDOM();
    }
  }

  /* ===================================================
     13. KICK-OFF
     =================================================== */
  initPriceBounds();
  applyUrlPreset();
  syncStateFromDOM();
  renderGrid(true);

})();
