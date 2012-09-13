// Handle text selection in easy way.
// Author: Nando Vieira <http://nandovieira.com.br>
// Requires jQuery.
;(function($){
  var get = function(selector, callback) {
    var element = $(selector).get(0);

    if (!element) { return; }
    if (!element.setSelectionRange) { return; }

    return element;
  };

  $.cursor = function(selector) {
    var element = get(selector)
      , value
      , length
    ;

    if (!element) {
      return;
    }

    value = element.value;
    length = value.length;

    return {
      start: element.selectionStart,
      end: element.selectionEnd,
      before: value.substring(0, element.selectionStart),
      after: value.substring(element.selectionEnd, length),
      selection: value.substring(element.selectionStart, element.selectionEnd),
      length: length
    };
  };

  $.setCursor = function(selector, start, end) {
    var element = get(selector);

    if (!element) {
      return;
    }

    end |= start;
    element.focus();
    element.setSelectionRange(start, end);
  };
})(jQuery);
