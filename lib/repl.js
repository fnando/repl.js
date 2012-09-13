;(function(window, $){
  // A simple REPL/Readline built with JavaScript + jQuery.
  // It supports history navigation with arrow up/down.
  // Commands are triggered by pressing <ENTER>. You can disable
  // the one-line commands by setting REPL#multiline to false.
  // In this case, you have to call REPL#processCommand function.
  //
  //   var repl = new REPL("#prompt");
  //   repl.on("command", function(command, ready){
  //     console.log("The command you typed: ", command);
  //     ready();
  //   });
  //
  //   repl.on("ready", function(){
  //     console.log("Ready? You can type another command now!");
  //   });
  //
  // TODO: Add some keybindings (http://www.hcs.harvard.edu/~jrus/Site/System%20Bindings.html)
  //
  // Author: Nando Vieira <http://nandovieira.com.br>
  //

  var ENTER = 13
    , ARROW_UP = 38
    , ARROW_DOWN = 40
    , U_KEY = 85
    , K_KEY = 75
  ;

  function REPL(prompt) {
    this.history = [];
    this.events = {};
    this.prompt = $(prompt);
    this.multiline = false;
    this.promptIndex = 0;
    this.status = REPL.READY_STATUS;

    var self = this;
    $.keybind(this.prompt);
    this.prompt.on("keydown", function(event){
      self.onKeyPress.call(self, event);
    });
  }

  REPL.READY_STATUS = "ready";
  REPL.LOCKED_STATUS = "locked";

  //
  //
  REPL.prototype.on = function(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(callback);
  };

  //
  //
  REPL.prototype.trigger = function() {
    var args = Array.prototype.slice.call(arguments, 0)
      , event = args.shift()
      , events = this.events[event]
    ;

    if (!events) {
      return;
    }

    events.forEach(function(callback){
      callback.apply(self, args);
    });
  };

  //
  //
  REPL.prototype.onKeyPress = function(event) {
    var keyCode = event.keyCode;

    if (keyCode === ENTER && (this.multiline && event.shiftKey || !this.multiline)) {
      this.processCommand(event);
    }

    if (keyCode === ARROW_UP && !event.shiftKey) {
      this.readHistory(event, -1);
    }

    if (keyCode === ARROW_DOWN && !event.shiftKey) {
      this.readHistory(event, +1)
    }
  };

  //
  //
  REPL.prototype.readHistory = function(event, step) {
    event.preventDefault();

    this.promptIndex += step;
    this.promptIndex = Math.max(0, this.promptIndex);
    this.promptIndex = Math.min(this.history.length, this.promptIndex);

    this.prompt.val(this.history[this.promptIndex]);
  };

  //
  //
  REPL.prototype.processCommand = function(event) {
    if (this.status !== REPL.READY_STATUS) {
      return;
    }

    var command = this.prompt.val()
      , self = this
    ;

    this.prompt.val("");

    if (this.history[this.history.length - 1] !== command) {
      this.promptIndex = this.history.push(command);
    }

    this.status = REPL.LOCKED_STATUS;

    this.trigger("command", command, function ready(){
      self.status = REPL.READY_STATUS;
      self.trigger("ready");
    });
  };

  window.REPL = REPL;
})(window, jQuery);
