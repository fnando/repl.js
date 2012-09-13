// Some emacs-like binding for HTML input.
// Author: Nando Vieira <http://nandovieira.com.br>
// Requires jQuery
;(function($){
  var KEY = {
    A: 65,
    B: 66,
    E: 69,
    F: 70,
    K: 75,
    U: 85,
    W: 87
  };

  function moveForward(element, cursor) {
    $.setCursor(element, cursor.end + 1);
  }

  function moveBackward(element, cursor) {
    $.setCursor(element, cursor.start - 1);
  }

  function moveToBeginningOfParagraph(element, cursor) {
    $.setCursor(element, 0);
  }

  function moveToEndOfParagraph(element, cursor) {
    $.setCursor(element, cursor.length);
  }

  function deleteWord(element, cursor) {
    var parts = cursor.before.split(" ")
      , index = cursor.end
      , length
      , part
    ;

    while (parts.length) {
      part = parts.pop();
      length = part.length;

      index -= Math.max(1, length);

      if (length > 0) { break; }
    }

    element.value = element.value.substring(0, index) + cursor.after;
    $.setCursor(element, index)
  }

  function deleteToEndOfParagraph(element, cursor) {
    if (cursor.selection) {
      element.value = cursor.before + cursor.after;
    } else {
      element.value = cursor.before;
    }

    $.setCursor(element, cursor.start);
  }

  function deleteToStartOfParagraph(element, cursor) {
    element.value = element.value.substring(cursor.end, cursor.length);
    $.setCursor(element, 0);
  }

  $.keybind = function(selector) {
    $(selector).on("keydown", function(event){
      var cursor = $.cursor(this);

      if (!event.ctrlKey || event.shiftKey || event.metaKey || event.altKey || !cursor) {
        return;
      }

      event.preventDefault();

      switch (event.keyCode) {
        case KEY.U:
          deleteToStartOfParagraph(this, cursor);
          break;

        case KEY.K:
          deleteToEndOfParagraph(this, cursor);
          break;

        case KEY.A:
          moveToBeginningOfParagraph(this, cursor);
          break;

        case KEY.E:
          moveToEndOfParagraph(this, cursor);
          break;

        case KEY.F:
          moveForward(this, cursor);
          break;

        case KEY.B:
          moveBackward(this, cursor);
          break;

        case KEY.W:
          deleteWord(this, cursor);
          break;
      }
    });
  };
})(jQuery);
