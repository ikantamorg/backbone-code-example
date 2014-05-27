define([
  'jquery',
  'underscore',
  'diff_match_patch'
],
  function($, _) {

    var TextDiffer = function(options) {
      this.options = _.extend({}, this.options, options);

      this.diffMatchPatch = new diff_match_patch();
      this.diffObject = null;

    };


    TextDiffer.prototype = {
      diffText: function(string1, string2){
        this.diffObject = this.diffMatchPatch.diff_main(string1, string2);

        return this;
      },
      cleanupSemantic: function(){
        this.diffMatchPatch.diff_cleanupSemantic(this.diffObject);

        return this;
      },
      toPrettyHtml: function(){
        return this.diffMatchPatch.diff_prettyHtml(this.diffObject);
      }
    };

    return TextDiffer;
  });