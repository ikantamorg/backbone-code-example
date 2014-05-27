define(
  [],
  function() {

    // fix console for IE
    // http://stackoverflow.com/a/5539378/1573638
    if (Function.prototype.bind && window.console && typeof console.log == 'object') {
      [
        'log', 'info', 'warn', 'error', 'assert', 'dir', 'clear', 'profile', 'profileEnd'
      ].forEach(function (method) {
          console[method] = this.bind(console[method], console);
      }, Function.prototype.call);
    }

    var log = {
      start: new Date().getTime(),
      info: function() {
        console.log.apply(console, this.wrap(arguments));
      },
      warn: function() {
        console.warn.apply(console, this.wrap(arguments));
      },
      error: function() {
        console.error.apply(console, this.wrap(arguments));
      },
      wrap: function(args) {
        args = Array.prototype.slice.call(args);
        args.unshift('[' + this.diff() +']  ');
        return args;
      },
      diff: function() {
        return this.toHHMMSS(new Date().getTime() - this.start);
      },
      // http://stackoverflow.com/a/6313008/1573638
      toHHMMSS: function(duration) {
        var msec = parseInt(duration, 10);
        var sec_num = msec / 1000;
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = (sec_num - (hours * 3600) - (minutes * 60)).toFixed(2);
        if (hours < 10) {
          hours = "0" + hours;
        }
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
        var time = hours + ':' + minutes + ':' + seconds;
        return time;
      }
    };

    return log;
  }
);