/* =====================================================
   PRODUCT DETAILS PAGE — JS
   Gallery, color/variant, quantity, zoom, tabs, wishlist
   ===================================================== */

(function ($) {
  "use strict";

  $(function () {

    /* ===================================================
       1. THUMBNAIL → MAIN IMAGE SWAP
       =================================================== */
    var $mainImg = $("#pdMainImgEl");

    $(".pd-thumb").on("click", function () {
      var $btn = $(this);
      var src = $btn.data("img");
      if (!src) return;

      $(".pd-thumb").removeClass("active");
      $btn.addClass("active");

      // Smooth fade
      $mainImg.css("opacity", 0);
      setTimeout(function () {
        $mainImg.attr("src", src);
        $mainImg.css("opacity", 1);
      }, 180);
    });

    /* ===================================================
       2. IMAGE ZOOM ON HOVER (CSS-driven)
       =================================================== */
    var $mainWrap = $("#pdMainImg");

    $mainWrap.on("mousemove", function (e) {
      if (!$mainWrap.hasClass("zooming")) return;
      var offset = $mainWrap.offset();
      var x = ((e.pageX - offset.left) / $mainWrap.width()) * 100;
      var y = ((e.pageY - offset.top) / $mainWrap.height()) * 100;
      $mainWrap[0].style.setProperty("--zoom-x", x + "%");
      $mainWrap[0].style.setProperty("--zoom-y", y + "%");
    });

    $(".pd-zoom-trigger, #pdMainImg").on("click", function (e) {
      // Avoid double-trigger when clicking the inner button
      if ($(e.target).closest(".pd-zoom-trigger").length && e.currentTarget !== $(".pd-zoom-trigger")[0]) return;
      $mainWrap.toggleClass("zooming");
    });

    $mainWrap.on("mouseleave", function () {
      $mainWrap.removeClass("zooming");
    });

    /* ===================================================
       3. COLOR SELECT
       =================================================== */
    $(".pd-color").on("click", function () {
      var $btn = $(this);
      $(".pd-color").removeClass("active");
      $btn.addClass("active");
      var color = $btn.data("color");
      $("#selectedColor").text(color);
    });

    /* ===================================================
       4. VARIANT SELECT
       =================================================== */
    $(".pd-variant").not(".disabled").on("click", function () {
      $(".pd-variant").removeClass("active");
      $(this).addClass("active");
    });

    /* ===================================================
       5. QUANTITY ± BUTTONS
       =================================================== */
    var $qtyInput = $("#qtyInput");
    var $qtyMinus = $("#qtyMinus");
    var $qtyPlus = $("#qtyPlus");

    function clampQty(v) {
      v = parseInt(v, 10);
      if (isNaN(v) || v < 1) v = 1;
      if (v > 99) v = 99;
      return v;
    }

    $qtyMinus.on("click", function () {
      $qtyInput.val(clampQty($qtyInput.val()) - 1 || 1);
    });

    $qtyPlus.on("click", function () {
      $qtyInput.val(clampQty($qtyInput.val()) + 1);
    });

    $qtyInput.on("input change blur", function () {
      $qtyInput.val(clampQty($qtyInput.val()));
    });

    /* ===================================================
       6. PRODUCT TABS
       =================================================== */
    $(".pd-tab-btn").on("click", function () {
      var $btn = $(this);
      var target = $btn.data("tab");
      if (!target) return;

      $(".pd-tab-btn").removeClass("active").attr("aria-selected", "false");
      $btn.addClass("active").attr("aria-selected", "true");

      $(".pd-tab-pane").removeClass("active");
      $("#" + target).addClass("active");
    });

    /* ===================================================
       7. PRODUCT-PAGE WISHLIST TOGGLE
       =================================================== */
    $(".pd-wishlist").on("click", function () {
      var $btn = $(this);
      $btn.toggleClass("active");
      var $icon = $btn.find("i");

      if ($btn.hasClass("active")) {
        $icon.removeClass("fa-regular").addClass("fa-solid");
        if (typeof window.showToast === "function") {
          window.showToast("Added to wishlist", "fa-heart");
        }
      } else {
        $icon.removeClass("fa-solid").addClass("fa-regular");
      }
    });

    /* ===================================================
       8. ADD TO CART / BUY NOW (PD page)
       =================================================== */
    $(".pd-cart-btn").on("click", function () {
      var qty = $qtyInput.val();
      var name = $(".pd-name").text().trim();
      var msg = qty + " × " + name + " added to cart";
      if (typeof window.showToast === "function") {
        window.showToast(msg, "fa-cart-plus");
      }

      var $cartBadge = $('.action-btn[aria-label="Cart"] .badge-count');
      if ($cartBadge.length) {
        var cur = parseInt($cartBadge.text(), 10) || 0;
        $cartBadge.text(cur + parseInt(qty, 10));
      }
    });

    $(".pd-buy-btn").on("click", function () {
      if (typeof window.showToast === "function") {
        window.showToast("Redirecting to checkout...", "fa-bag-shopping");
      }
    });

    /* ===================================================
       9. SHARE BUTTON HANDLERS (demo)
       =================================================== */
    $(".pd-share a").on("click", function (e) {
      e.preventDefault();
      var label = $(this).attr("aria-label") || "";
      if (label.indexOf("Copy") !== -1) {
        if (typeof window.showToast === "function") {
          window.showToast("Link copied to clipboard", "fa-link");
        }
        try { navigator.clipboard && navigator.clipboard.writeText(window.location.href); } catch (err) {}
      }
    });

    /* ===================================================
       10. WRITE-A-REVIEW MODAL
       =================================================== */
    var $reviewModal = $("#reviewModal");
    var $reviewForm = $("#reviewForm");
    var $rating = $("#ratingInput");
    var $ratingText = $("#ratingText");
    var ratingLabels = ["Select a rating", "Poor", "Fair", "Good", "Very Good", "Excellent"];

    function openReviewModal() {
      $reviewModal.addClass("active");
      $reviewModal.attr("aria-hidden", "false");
      $("body").css("overflow", "hidden");
    }

    function closeReviewModal() {
      $reviewModal.removeClass("active");
      $reviewModal.attr("aria-hidden", "true");
      $("body").css("overflow", "");
    }

    $("#openReviewModal").on("click", openReviewModal);
    $("#reviewModalClose").on("click", closeReviewModal);
    $reviewModal.on("click", function (e) {
      if (e.target === this) closeReviewModal();
    });
    $(document).on("keydown", function (e) {
      if (e.key === "Escape" && $reviewModal.hasClass("active")) closeReviewModal();
    });

    // Star rating selector — hover preview + click-to-set
    function paintStars(value, hovering) {
      var $stars = $rating.find(".star-btn");
      $stars.removeClass("active hovered");
      $stars.each(function () {
        var v = parseInt($(this).data("value"), 10);
        if (hovering) {
          if (v <= value) $(this).addClass("hovered");
        } else {
          if (v <= value) $(this).addClass("active");
        }
      });
    }

    $rating.find(".star-btn").on("mouseenter", function () {
      var v = parseInt($(this).data("value"), 10);
      $rating.addClass("is-hovering");
      paintStars(v, true);
      $ratingText.text(ratingLabels[v] || "");
    });

    $rating.on("mouseleave", function () {
      $rating.removeClass("is-hovering");
      var v = parseInt($rating.attr("data-value"), 10) || 0;
      paintStars(v, false);
      $ratingText.text(ratingLabels[v] || ratingLabels[0]);
    });

    $rating.find(".star-btn").on("click", function () {
      var v = parseInt($(this).data("value"), 10);
      $rating.attr("data-value", v);
      paintStars(v, false);
      $ratingText.text(ratingLabels[v]);
    });

    // Submit review — no validation
    $reviewForm.on("submit", function (e) {
      e.preventDefault();
      if (typeof window.showToast === "function") {
        window.showToast("Thank you — your review has been submitted", "fa-circle-check");
      }
      this.reset();
      $rating.attr("data-value", "0");
      paintStars(0, false);
      $ratingText.text(ratingLabels[0]);
      closeReviewModal();
    });

  });

})(jQuery);
