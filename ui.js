define([
  'jquery',
  // scripts with no export
  'cf',
  'comma_separated',
  'autoresize.jquery'
], function($) {

  var Ui = function() {
    return this;
  };

  Ui.prototype = {
    bind: function() {

      /* custom checkbox/radio button */
      var cf = $('.cf').not('.cf-not-auto-init');
      if (cf.length) {
        cf.cf();
      }

      /* placeholder */
      $('.ie8 [placeholder], .ie9 [placeholder]').focus(function() {
        var input = $(this);
        if (input.val() == input.attr('placeholder')) {
          input.val('');
          input.removeClass('placeholder');
        }
      }).blur(function() {
        var input = $(this);
        if (input.val() == '' || input.val() == input.attr('placeholder')) {
          input.addClass('placeholder');
          input.val(input.attr('placeholder'));
        }
      }).blur().parents('form').submit(function() {
        $(this).find('[placeholder]').each(function() {
          var input = $(this);
          if (input.val() == input.attr('placeholder')) {
            input.val('');
          }
        })
      });

      /* jQuery autoResize (textarea auto-resizer) */
      $('.load-file-record textarea').autoResize({
        extraSpace : 0,
        limit: 280
      });

      $("#commaSep input").focus(function() {
        $("#commaSep").addClass("active-send");
      });

      $("#commaSep input").blur(function() {
        $("#commaSep").removeClass("active-send");
      });


      $(".load-file-record textarea").keyup(function() {
        if( $(this).val() != "" ) {
          $(".load-file-record").addClass("filled");
        } else {
          $(".load-file-record").removeClass("filled");
        }
      });

      $(".record-search input").focus(function() {
        $(".main-record-search .btn-search").addClass("btn-search-focus");
      });

      $(".record-search input").blur(function() {
        $(".main-record-search .btn-search").removeClass("btn-search-focus");
      });

      $(".load-file-record textarea").focus(function() {
        $(".load-file-record").css("border", "1px solid #70BDFD");
      });

      $(".load-file-record textarea").blur(function() {
        $(".load-file-record").css("border", "1px solid #D6D5D5");
      });
    }
  };

  return Ui;
});